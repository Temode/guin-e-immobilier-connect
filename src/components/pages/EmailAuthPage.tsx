import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { Eye, EyeOff, Mail, Phone, User, Lock } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

const EmailAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const { signUpWithEmail, signInWithEmail } = useAuthContext();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signInWithEmail(formData.email, formData.password);
        if (error) setError(error.message);
      } else {
        const { data, error } = await signUpWithEmail(
          formData.email,
          formData.password,
          { full_name: formData.fullName, phone: formData.phone }
        );
        if (error) {
          setError(error.message);
        } else if (data.user && !data.session) {
          setSuccess('Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.');
        }
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
          <p>Votre maison en Guinée vous attend</p>
        </div>

        <div className={styles.authTabs}>
          <button
            className={`${styles.authTab} ${!isLogin ? styles.active : ''}`}
            onClick={() => { setIsLogin(false); setError(null); setSuccess(null); }}
          >
            S'inscrire
          </button>
          <button
            className={`${styles.authTab} ${isLogin ? styles.active : ''}`}
            onClick={() => { setIsLogin(true); setError(null); setSuccess(null); }}
          >
            Se connecter
          </button>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#D1FAE5', color: '#065F46', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {success}
          </div>
        )}

        {/* Signup Form */}
        <div className={`${styles.authContent} ${!isLogin ? styles.active : ''}`}>
          <h2 className={styles.formTitle}>Créez votre compte</h2>
          <p className={styles.formSubtitle}>Rejoignez des milliers de Guinéens qui trouvent leur maison sur ImmoGuinée</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nom complet</label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={20} />
                <input type="text" className={styles.formInput} placeholder="Ex: Mamadou Diallo" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={20} />
                <input type="email" className={styles.formInput} placeholder="votre@email.com" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Numéro de téléphone</label>
              <div className={styles.inputWrapper}>
                <Phone className={styles.inputIcon} size={20} />
                <input type="tel" className={styles.formInput} placeholder="+224 XXX XX XX XX" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Mot de passe</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
                <div className={styles.passwordWrapper}>
                  <input type={showPassword ? 'text' : 'password'} className={styles.formInput} name="password" placeholder="Minimum 8 caractères" value={formData.password} onChange={handleChange} required />
                  <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <input type="checkbox" className={styles.checkboxInput} id="terms" required />
              <label className={styles.checkboxLabel} htmlFor="terms">
                J'accepte les <a href="#">Conditions d'utilisation</a> et la{' '}
                <a href="#">Politique de confidentialité</a> d'ImmoGuinée
              </label>
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={submitting}>
              {submitting ? 'Création en cours...' : 'Créer mon compte'}
            </button>

            <div className={styles.trustBadge}>
              🔒 Vos données sont protégées et cryptées
            </div>
          </form>
        </div>

        {/* Login Form */}
        <div className={`${styles.authContent} ${isLogin ? styles.active : ''}`}>
          <h2 className={styles.formTitle}>Bon retour !</h2>
          <p className={styles.formSubtitle}>Connectez-vous pour accéder à votre compte ImmoGuinée</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={20} />
                <input type="email" className={styles.formInput} placeholder="votre@email.com" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Mot de passe</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
                <div className={styles.passwordWrapper}>
                  <input type={showPassword ? 'text' : 'password'} className={styles.formInput} name="password" placeholder="Votre mot de passe" value={formData.password} onChange={handleChange} required />
                  <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.forgotPassword}>
              <a href="#">Mot de passe oublié ?</a>
            </div>

            <div className={styles.checkboxGroup}>
              <input type="checkbox" className={styles.checkboxInput} id="remember" />
              <label className={styles.checkboxLabel} htmlFor="remember">Se souvenir de moi</label>
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={submitting}>
              {submitting ? 'Connexion en cours...' : 'Se connecter'}
            </button>

            <div className={styles.trustBadge}>
              ✓ Connexion sécurisée avec cryptage SSL
            </div>
          </form>
        </div>

        <div className={styles.authFooter}>
          <p>
            Vous préférez les réseaux sociaux ?{' '}
            <Link to="/auth" className={styles.toggleButton}>
              Se connecter avec Google
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailAuthPage;
