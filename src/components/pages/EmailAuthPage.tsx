import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { Eye, EyeOff, Mail, Phone, User, Lock } from 'lucide-react';

const EmailAuthPage: React.FC = () => {
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nom complet</label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={20} />
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
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={20} />
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
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Numéro de téléphone</label>
              <div className={styles.inputWrapper}>
                <Phone className={styles.inputIcon} size={20} />
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
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Mot de passe</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
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

            <button type="submit" className={styles.btnPrimary}>
              Créer mon compte
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email ou téléphone</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={20} />
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
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Mot de passe</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
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
            Vous préférez les réseaux sociaux ?{' '}
            <Link to="/auth" className={styles.toggleButton}>
              Se connecter avec Google/Facebook
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailAuthPage;