import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: {
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    kyc_status: string;
    subscription_plan: string;
  } | null;
}

function getDashboardByRole(role?: string): string {
  if (role === 'agent' || role === 'owner') return '/dashbord-agent';
  return '/dashboard-locataire';
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    profile: null,
  });
  const navigate = useNavigate();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, avatar_url, kyc_status, subscription_plan')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('fetchProfile error', err);
      return null;
    }
  }, []);
  useEffect(() => {
    const isMounted = { current: true };
    const initializingRef = { current: true } as { current: boolean };
    let lastFetchId = 0;

    const handleSession = async (session: Session | null) => {
      const user = session?.user ?? null;
      if (!user) {
        if (!isMounted.current) return;
        setState({ user: null, session: null, loading: false, profile: null });
        return;
      }

      const myFetchId = ++lastFetchId;
      const profile = await fetchProfile(user.id);
      if (!isMounted.current) return;
      if (myFetchId !== lastFetchId) return; // stale
      setState({ user, session, loading: false, profile });
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Ignore token refresh noisy events and ignore while we are initializing
        if (event === 'TOKEN_REFRESHED' || initializingRef.current) return;
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          void handleSession(session);
        }
      }
    );

    // Initialize from current session first
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        void handleSession(session);
      })
      .catch((err) => {
        console.error('getSession error', err);
        if (isMounted.current) {
          setState({ user: null, session: null, loading: false, profile: null });
        }
      })
      .finally(() => {
        initializingRef.current = false;
      });

    return () => {
      isMounted.current = false;
      try { subscription.unsubscribe(); } catch (e) { /* ignore */ }
    };
  }, [fetchProfile]);

  const signUpWithEmail = async (
    email: string,
    password: string,
    metadata: { full_name: string; phone: string }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/user-role`,
        data: {
          full_name: metadata.full_name,
          phone: metadata.phone,
        },
      },
    });
    if (data.session && data.user) {
      const profile = await fetchProfile(data.user.id);
      setState({ user: data.user, session: data.session, loading: false, profile });
      navigate('/user-role');
    }
    return { data, error };
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data.session && data.user) {
      const profile = await fetchProfile(data.user.id);
      setState({ user: data.user, session: data.session, loading: false, profile });
      const role = data.user.user_metadata?.role;
      navigate(role ? getDashboardByRole(role) : '/user-role');
    }
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/user-role`,
      },
    });
    return { error };
  };

  const updateUserRole = async (role: string) => {
    const { error } = await supabase.auth.updateUser({
      data: { role },
    });
    if (!error && state.user) {
      setState((prev) => ({
        ...prev,
        user: {
          ...prev.user!,
          user_metadata: { ...prev.user!.user_metadata, role },
        },
      }));
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    profile: state.profile,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    updateUserRole,
    getDashboardByRole,
  };
}
