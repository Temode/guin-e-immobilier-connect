import { useState, useEffect, useCallback } from 'react';
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

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    profile: null,
  });
  const navigate = useNavigate();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, phone, avatar_url, kyc_status, subscription_plan')
      .eq('id', userId)
      .single();
    return data;
  }, []);

  useEffect(() => {
    // Set up auth listener BEFORE getSession
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        let profile = null;

        if (user) {
          // Use setTimeout to avoid potential deadlocks with Supabase client
          setTimeout(async () => {
            profile = await fetchProfile(user.id);
            setState({ user, session, loading: false, profile });
          }, 0);
        } else {
          setState({ user: null, session: null, loading: false, profile: null });
        }
      }
    );

    // Then check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      let profile = null;
      if (user) {
        profile = await fetchProfile(user.id);
      }
      setState({ user, session, loading: false, profile });
    });

    return () => subscription.unsubscribe();
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
        emailRedirectTo: window.location.origin,
        data: {
          full_name: metadata.full_name,
          phone: metadata.phone,
        },
      },
    });
    if (data.session) {
      navigate('/dashboard-locataire');
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
      navigate('/dashboard-locataire');
    }
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard-locataire`,
      },
    });
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
  };
}
