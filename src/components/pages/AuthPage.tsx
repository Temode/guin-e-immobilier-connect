import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { Eye, EyeOff, Mail, Phone, User, Lock } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // Par défaut sur login
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const toggleForm = () => setIsLogin(!isLogin);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLogin ? 'Connexion' : 'Inscription', formData);
    // Ici, tu intégreras Supabase Auth ou ton backend
  };

  return (
    <div className={styles.authPage}>
      {/* Auth Card */}
      <div className={styles.authCard}>
        {/* Logo */}
        <div className={styles.authLogo}>
          <Link to="/">ImmoGuinée</Link>
          <p>Votre maison en Guinée vous attend</p>
        </div>

        {/* Tabs */}
        <div className={styles.authTabs}>
          <button
            className={`${styles.authTab} ${!isLogin ? styles.active : ''}`}
            onClick={() => setIsLogin(false)}
          >
            S'inscrire
          </button>
          <button
            className={`${styles.authTab} ${isLogin ? styles.active : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Se connecter
          </button>
        </div>

        {/* Signup Form */}
        <div className={`${styles.authContent} ${!isLogin ? styles.active : ''}`}>
          <h2 className={styles.formTitle}>Créez votre compte</h2>
          <p className={styles.formSubtitle}>Rejoignez des milliers de Guinéens qui trouvent leur maison sur ImmoGuinée</p>

          {/* Social Login */}
          <div className={styles.socialButtons}>
            <button className={styles.btnSocial}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className={styles.btnSocial}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          <div className={styles.socialDivider}>ou avec email</div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nom complet</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Ex: Mamadou Diallo"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    className={styles.formInput}
                    placeholder="votre@email.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Numéro de téléphone</label>
                  <input
                    type="tel"
                    className={styles.formInput}
                    placeholder="+224 XXX XX XX XX"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Mot de passe</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={styles.formInput}
                  id="signupPassword"
                  name="password"
                  placeholder="Minimum 8 caractères"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className={styles.checkboxGroup}>
                <input type="checkbox" className={styles.checkboxInput} id="terms" required />
                <label className={styles.checkboxLabel} htmlFor="terms">
                  J'accepte les <a href="#">Conditions d'utilisation</a> et la{' '}
                  <a href="#">Politique de confidentialité</a> d'ImmoGuinée
                </label>
              </div>
            )}

            <button type="submit" className={styles.btnPrimary}>
              {isLogin ? 'Se connecter' : 'Créer mon compte'}
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

          {/* Social Login */}
          <div className={styles.socialButtons}>
            <button className={styles.btnSocial}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className={styles.btnSocial}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          <div className={styles.socialDivider}>ou avec email</div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email ou téléphone</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="votre@email.com ou +224..."
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Mot de passe</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={styles.formInput}
                  id="loginPassword"
                  name="password"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className={styles.forgotPassword}>
              <a href="#">Mot de passe oublié ?</a>
            </div>

            <div className={styles.checkboxGroup}>
              <input type="checkbox" className={styles.checkboxInput} id="remember" />
              <label className={styles.checkboxLabel} htmlFor="remember">
                Se souvenir de moi
              </label>
            </div>

            <button type="submit" className={styles.btnPrimary}>
              Se connecter
            </button>

            <div className={styles.trustBadge}>
              ✓ Connexion sécurisée avec cryptage SSL
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className={styles.authFooter}>
          <p>
            {isLogin
              ? "Pas encore de compte ? "
              : "Vous avez déjà un compte ? "}
            <button onClick={toggleForm} className={styles.toggleButton}>
              {isLogin ? "S'inscrire gratuitement" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;