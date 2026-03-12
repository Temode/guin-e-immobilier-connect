import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import styles from './AuthPage.module.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    } catch {
      setError('Une erreur inattendue est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <Link to="/">ImmoGuinée</Link>
          <p>Réinitialisation du mot de passe</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#D1FAE5', color: '#065F46', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              ✅ Un email de réinitialisation a été envoyé à <strong>{email}</strong>. Vérifiez votre boîte de réception (et les spams).
            </div>
            <Link to="/auth/email" className={styles.toggleButton}>
              <ArrowLeft size={16} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <h2 className={styles.formTitle}>Mot de passe oublié ?</h2>
            <p className={styles.formSubtitle}>
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            {error && (
              <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} size={20} />
                  <input
                    type="email"
                    className={styles.formInput}
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.btnPrimary} disabled={submitting}>
                {submitting ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </button>
            </form>

            <div className={styles.authFooter}>
              <Link to="/auth/email" className={styles.toggleButton}>
                <ArrowLeft size={16} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
