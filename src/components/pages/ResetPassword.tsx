import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import styles from './AuthPage.module.css';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user arrived via recovery link (session with type=recovery)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      }
      setChecking(false);
    };

    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
        setChecking(false);
      }
    });

    checkSession();
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/auth/email'), 3000);
      }
    } catch {
      setError('Une erreur inattendue est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authCard}>
          <p style={{ textAlign: 'center', color: '#71717A' }}>Vérification en cours...</p>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authCard}>
          <div className={styles.authLogo}>
            <Link to="/">ImmoGuinée</Link>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Ce lien de réinitialisation est invalide ou a expiré. Veuillez en demander un nouveau.
            </div>
            <Link to="/forgot-password" className={styles.toggleButton}>
              Demander un nouveau lien
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <Link to="/">ImmoGuinée</Link>
          <p>Nouveau mot de passe</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#D1FAE5', color: '#065F46', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              ✅ Mot de passe mis à jour avec succès ! Redirection vers la connexion...
            </div>
          </div>
        ) : (
          <>
            <h2 className={styles.formTitle}>Créez un nouveau mot de passe</h2>
            <p className={styles.formSubtitle}>Choisissez un mot de passe sécurisé d'au moins 8 caractères.</p>

            {error && (
              <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nouveau mot de passe</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} size={20} />
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={styles.formInput}
                      placeholder="Minimum 8 caractères"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Confirmer le mot de passe</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={styles.formInput}
                    placeholder="Retapez le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.btnPrimary} disabled={submitting}>
                {submitting ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
