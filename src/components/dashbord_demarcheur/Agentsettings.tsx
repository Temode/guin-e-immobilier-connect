// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import styles from './AgentSettings.module.css';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { countries, getDialCodeByCountryName } from '@/data/countries';

/* ==========================================
   ICONS COMPONENTS
========================================== */
const HelpIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IdCardIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" />
  </svg>
);

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const BadgeCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CameraIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const KeyIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const DeviceIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const DesktopIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const AlertIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const MinusIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);

const WarningIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/* ==========================================
   TOAST COMPONENT
========================================== */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      padding: '12px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8,
      background: type === 'success' ? '#D1FAE5' : '#FEE2E2',
      color: type === 'success' ? '#065F46' : '#991B1B',
      fontWeight: 500, fontSize: '0.875rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      {type === 'success' ? <CheckIcon /> : <WarningIcon />}
      <span>{message}</span>
    </div>
  );
};

/* ==========================================
   TOP BAR COMPONENT
========================================== */
const TopBar = () => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <div className={styles.pageContext}>
          <span className={styles.pageDate}>{dateStr}</span>
          <h1 className={styles.pageTitle}>Paramètres & Profil</h1>
        </div>
      </div>
      <div className={styles.topBarRight}>
        <button className={styles.iconBtn}>
          <HelpIcon />
        </button>
      </div>
    </header>
  );
};

/* ==========================================
   SETTINGS NAVIGATION COMPONENT
========================================== */
const SettingsNav = ({ activeSection, onSectionChange, onLogout }) => {
  const navItems = [
    { id: 'profile', icon: UserIcon, label: 'Profil public' },
    { id: 'informations', icon: IdCardIcon, label: 'Informations' },
    { id: 'verification', icon: ShieldIcon, label: 'Vérification KYC' },
    { divider: true },
    { id: 'subscription', icon: SparklesIcon, label: 'Abonnement' },
    { id: 'wallet', icon: CreditCardIcon, label: 'Portefeuille' },
    { divider: true },
    { id: 'security', icon: LockIcon, label: 'Sécurité' },
    { id: 'notifications', icon: BellIcon, label: 'Notifications' },
    { divider: true },
    { id: 'danger', icon: AlertIcon, label: 'Zone danger', danger: true },
    { divider: true },
    { id: 'logout', icon: LogoutIcon, label: 'Déconnexion', danger: true },
  ];

  return (
    <nav className={styles.settingsNav}>
      <div className={styles.settingsNavCard}>
        {navItems.map((item, index) => {
          if (item.divider) {
            return <div key={index} className={styles.settingsNavDivider} />;
          }
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`${styles.settingsNavItem} ${activeSection === item.id ? styles.active : ''} ${item.danger ? styles.danger : ''}`}
              onClick={(e) => {
                e.preventDefault();
                if (item.id === 'logout') {
                  onLogout();
                } else {
                  onSectionChange(item.id);
                }
              }}
            >
              <item.icon />
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

/* ==========================================
   TOGGLE SWITCH COMPONENT
========================================== */
const ToggleSwitch = ({ checked, onChange }) => (
  <label className={styles.toggleSwitch}>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className={styles.toggleSlider}></span>
  </label>
);

/* ==========================================
   PROFILE SECTION COMPONENT (dynamic)
========================================== */
const ProfileSection = ({ profile, avatarUrl, onChangePhoto }) => {
  const getInitials = (name) => {
    if (!name || name.includes('@')) return '?';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <section id="profile" className={styles.settingsSection}>
      <div className={styles.settingsSectionHeader}>
        <div className={styles.settingsSectionTitle}>
          <div className={`${styles.sectionIcon} ${styles.primary}`}>
            <UserIcon />
          </div>
          <h2>Profil public</h2>
        </div>
        <a href="#" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={(e) => e.preventDefault()}>
          <EyeIcon />
          Voir mon profil
        </a>
      </div>
      <div className={styles.settingsSectionBody}>
        <div className={styles.profilePublic}>
          <div className={styles.profileAvatarSection}>
            <div className={styles.profileAvatarLarge}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                getInitials(profile.name)
              )}
              <button className={styles.profileAvatarEdit} title="Modifier la photo" onClick={() => document.getElementById('agent-avatar-upload')?.click()}>
                <CameraIcon />
              </button>
            </div>
            <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={() => document.getElementById('agent-avatar-upload')?.click()}>
              Changer la photo
            </button>
            <input
              type="file"
              id="agent-avatar-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) onChangePhoto(e.target.files[0]);
              }}
            />
          </div>
          <div className={styles.profileInfoSection}>
            <div className={styles.profileNameRow}>
              <h3>{profile.name}</h3>
              {profile.verified && (
                <span className={styles.verifiedBadge}>
                  <BadgeCheckIcon />
                  Agent Certifié
                </span>
              )}
            </div>
            <p className={styles.profileLocation}>
              <LocationIcon />
              {profile.location || 'Localisation non renseignée'}
            </p>
            <div className={styles.profileBio}>
              <p className={styles.profileBioLabel}>Biographie</p>
              <p className={styles.profileBioText}>{profile.bio || 'Aucune biographie renseignée.'}</p>
            </div>
            <div className={styles.profileStatsPublic}>
              {profile.stats.map((stat, index) => (
                <div key={index} className={styles.profileStatItem}>
                  <div className={styles.value}>
                    {stat.value}
                    {stat.icon && <StarIcon />}
                  </div>
                  <div className={styles.label}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   INFORMATIONS SECTION COMPONENT (dynamic)
========================================== */
const InformationsSection = ({ data, onChange, onSave, onCancel, saving }) => {
  const dialCode = getDialCodeByCountryName(data.nationality);

  const handleNationalityChange = (value) => {
    onChange('nationality', value);
    const newDialCode = getDialCodeByCountryName(value);
    if (newDialCode) {
      const currentPhone = data.phone || '';
      const localPart = currentPhone.replace(/^\+\d+[\s-]?/, '').trim();
      onChange('phone', `${newDialCode} ${localPart}`);
    }
  };

  return (
    <section id="informations" className={styles.settingsSection}>
      <div className={styles.settingsSectionHeader}>
        <div className={styles.settingsSectionTitle}>
          <div className={`${styles.sectionIcon} ${styles.info}`}>
            <IdCardIcon />
          </div>
          <h2>Informations personnelles</h2>
        </div>
      </div>
      <div className={styles.settingsSectionBody}>
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Prénom <span style={{ color: 'var(--color-error-500)' }}>*</span></label>
              <input type="text" className={styles.formInput} value={data.firstName} onChange={(e) => onChange('firstName', e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nom <span style={{ color: 'var(--color-error-500)' }}>*</span></label>
              <input type="text" className={styles.formInput} value={data.lastName} onChange={(e) => onChange('lastName', e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input type="email" className={styles.formInput} value={data.email} disabled style={{ opacity: 0.6 }} />
              <span className={styles.formHelp}>L'email ne peut pas être modifié ici</span>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nationalité</label>
              <select className={styles.formInput} value={data.nationality} onChange={(e) => handleNationalityChange(e.target.value)} style={{ cursor: 'pointer' }}>
                <option value="">— Sélectionner —</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Téléphone <span style={{ color: 'var(--color-error-500)' }}>*</span></label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  background: 'var(--color-neutral-100)', padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500,
                  color: 'var(--color-neutral-700)', whiteSpace: 'nowrap',
                  border: '1px solid var(--color-neutral-200)'
                }}>
                  {dialCode || '—'}
                </span>
                <input
                  type="tel"
                  className={styles.formInput}
                  value={data.phone.replace(/^\+\d+[\s-]?/, '').trim()}
                  onChange={(e) => onChange('phone', `${dialCode} ${e.target.value}`)}
                  placeholder="Numéro local"
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Date de naissance</label>
              <input type="date" className={styles.formInput} value={data.birthDate} onChange={(e) => onChange('birthDate', e.target.value)} />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.formLabel}>Biographie</label>
              <textarea className={`${styles.formInput} ${styles.formTextarea}`} value={data.bio} onChange={(e) => onChange('bio', e.target.value)} />
              <span className={styles.formHelp}>Cette description sera visible sur votre profil public.</span>
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={onCancel} disabled={saving}>Annuler</button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

/* ==========================================
   KYC SECTION COMPONENT (reads from DB)
========================================== */
const KYCSection = ({ kycStatus }) => {
  const statusMap = {
    verified: { title: 'Votre identité est vérifiée', description: 'Votre profil bénéficie du badge "Agent Certifié".', cssClass: 'verified' },
    pending: { title: 'Vérification en cours', description: 'Vos documents sont en cours de vérification.', cssClass: 'pending' },
    rejected: { title: 'Vérification refusée', description: 'Veuillez soumettre de nouveaux documents.', cssClass: 'rejected' },
  };
  const info = statusMap[kycStatus] || statusMap.pending;

  return (
    <section id="verification" className={styles.settingsSection}>
      <div className={styles.settingsSectionHeader}>
        <div className={styles.settingsSectionTitle}>
          <div className={`${styles.sectionIcon} ${styles.success}`}>
            <ShieldIcon />
          </div>
          <h2>Vérification d'identité (KYC)</h2>
        </div>
      </div>
      <div className={styles.settingsSectionBody}>
        <div className={`${styles.kycStatusCard} ${styles[info.cssClass]}`}>
          <div className={`${styles.kycStatusIcon} ${styles[info.cssClass]}`}>
            <CheckIcon />
          </div>
          <div className={styles.kycStatusInfo}>
            <h4>{info.title}</h4>
            <p>{info.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   SUBSCRIPTION SECTION COMPONENT (reads from DB)
========================================== */
const SubscriptionSection = ({ plan }) => {
  const planDetails = {
    free: { label: 'GRATUIT', price: '0 GNF', features: ['5 biens max', 'Commission : 8-10%', 'Support communautaire'] },
    basic: { label: 'BASIC', price: '50,000 GNF', features: ['Biens illimités', '2 mises en avant/mois', 'Commission : 5-6%'] },
    pro: { label: 'PRO', price: '150,000 GNF', features: ['Biens illimités', '10 mises en avant/mois', 'Commission : 3-4%', 'Support prioritaire'] },
    enterprise: { label: 'ENTERPRISE', price: 'Sur devis', features: ['Tout illimité', 'Commission : 1-2%', 'Account manager dédié'] },
  };
  const details = planDetails[plan] || planDetails.free;

  return (
    <section id="subscription" className={styles.settingsSection}>
      <div className={styles.settingsSectionHeader}>
        <div className={styles.settingsSectionTitle}>
          <div className={`${styles.sectionIcon} ${styles.gold}`}>
            <SparklesIcon />
          </div>
          <h2>Abonnement</h2>
        </div>
      </div>
      <div className={styles.settingsSectionBody}>
        <div className={styles.subscriptionCurrent}>
          <div className={styles.subscriptionInfo}>
            <h4>
              Plan actuel
              <span className={styles.planBadge}>{details.label}</span>
            </h4>
          </div>
          <div className={styles.subscriptionPrice}>
            <div className={styles.amount}>{details.price}</div>
            <div className={styles.period}>par mois</div>
          </div>
        </div>
        <div className={styles.subscriptionFeatures}>
          {details.features.map((feature, index) => (
            <div key={index} className={styles.subscriptionFeature}>
              <CheckIcon />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        {plan !== 'pro' && plan !== 'enterprise' && (
          <div className={styles.upgradeBanner}>
            <div className={styles.upgradeBannerContent}>
              <h4><SparklesIcon /> Passez au Plan Pro</h4>
              <p>Commission réduite à 3-4% • 10 mises en avant/mois • Support prioritaire</p>
            </div>
            <button className={styles.upgradeBtn}>Voir les avantages</button>
          </div>
        )}
      </div>
    </section>
  );
};

/* ==========================================
   WALLET SECTION COMPONENT (static for now)
========================================== */
const WalletSection = () => (
  <section id="wallet" className={styles.settingsSection}>
    <div className={styles.settingsSectionHeader}>
      <div className={styles.settingsSectionTitle}>
        <div className={`${styles.sectionIcon} ${styles.gold}`}>
          <CreditCardIcon />
        </div>
        <h2>Portefeuille</h2>
      </div>
    </div>
    <div className={styles.settingsSectionBody}>
      <div className={styles.walletBalance}>
        <div className={styles.walletBalanceInfo}>
          <h4>Solde disponible</h4>
          <div className={styles.walletBalanceAmount}>0 GNF</div>
          <p className={styles.walletBalanceNote}>Le portefeuille sera bientôt disponible.</p>
        </div>
      </div>
    </div>
  </section>
);

/* ==========================================
   SECURITY SECTION COMPONENT (functional)
========================================== */
const SecuritySection = ({ passwordChangedAt, onChangePassword }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  const getPasswordAge = () => {
    if (!passwordChangedAt) return 'Jamais modifié';
    const diff = Date.now() - new Date(passwordChangedAt).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Modifié aujourd'hui";
    if (days === 1) return 'Modifié hier';
    if (days < 30) return `Modifié il y a ${days} jours`;
    const months = Math.floor(days / 30);
    return `Modifié il y a ${months} mois`;
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Le mot de passe doit faire au moins 8 caractères' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }
    setChangingPassword(true);
    setPasswordMsg(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMsg({ type: 'error', text: error.message });
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ password_changed_at: new Date().toISOString() }).eq('id', user.id);
      }
      setPasswordMsg({ type: 'success', text: 'Mot de passe modifié avec succès' });
      setShowPasswordForm(false);
      setNewPassword('');
      setConfirmPassword('');
      onChangePassword?.();
    }
    setChangingPassword(false);
  };

  return (
    <section id="security" className={styles.settingsSection}>
      <div className={styles.settingsSectionHeader}>
        <div className={styles.settingsSectionTitle}>
          <div className={`${styles.sectionIcon} ${styles.info}`}>
            <LockIcon />
          </div>
          <h2>Sécurité</h2>
        </div>
      </div>
      <div className={styles.settingsSectionBody}>
        {/* Password */}
        <div className={styles.securityItem}>
          <div className={styles.securityItemInfo}>
            <div className={styles.securityItemIcon}><KeyIcon /></div>
            <div className={styles.securityItemDetails}>
              <h5>Mot de passe</h5>
              <p>{getPasswordAge()}</p>
            </div>
          </div>
          <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={() => setShowPasswordForm(!showPasswordForm)}>
            {showPasswordForm ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        {showPasswordForm && (
          <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input type="password" className={styles.formInput} placeholder="Nouveau mot de passe (min 8 car.)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" className={styles.formInput} placeholder="Confirmer le nouveau mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            {passwordMsg && (
              <p style={{ color: passwordMsg.type === 'error' ? 'var(--color-error-500)' : 'var(--color-success-500)', fontSize: '0.875rem' }}>
                {passwordMsg.text}
              </p>
            )}
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handlePasswordChange} disabled={changingPassword}>
              {changingPassword ? 'Modification…' : 'Changer le mot de passe'}
            </button>
          </div>
        )}

        {/* 2FA */}
        <div className={styles.securityItem}>
          <div className={styles.securityItemInfo}>
            <div className={styles.securityItemIcon}><DeviceIcon /></div>
            <div className={styles.securityItemDetails}>
              <h5>Authentification à deux facteurs (2FA)</h5>
              <p>Non activée — Recommandé pour plus de sécurité</p>
            </div>
          </div>
          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`} disabled style={{ opacity: 0.6 }}>
            Bientôt disponible
          </button>
        </div>

        {/* Sessions */}
        <div className={styles.securityItem}>
          <div className={styles.securityItemInfo}>
            <div className={styles.securityItemIcon}><DesktopIcon /></div>
            <div className={styles.securityItemDetails}>
              <h5>Sessions actives</h5>
              <p>Session actuelle</p>
            </div>
          </div>
          <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={async () => {
            await supabase.auth.signOut({ scope: 'others' });
            alert('Autres sessions déconnectées');
          }}>
            Déconnecter les autres
          </button>
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   NOTIFICATIONS SECTION COMPONENT
========================================== */
const NotificationsSection = ({ notifications, onToggle }) => (
  <section id="notifications" className={styles.settingsSection}>
    <div className={styles.settingsSectionHeader}>
      <div className={styles.settingsSectionTitle}>
        <div className={`${styles.sectionIcon} ${styles.primary}`}>
          <BellIcon />
        </div>
        <h2>Notifications</h2>
      </div>
    </div>
    <div className={styles.settingsSectionBody}>
      {notifications.groups.map((group, groupIndex) => (
        <div key={groupIndex} className={styles.notificationGroup}>
          <div className={styles.notificationGroupTitle}>
            <group.icon />
            {group.title}
          </div>
          {group.items.map((item, itemIndex) => (
            <div key={itemIndex} className={styles.notificationItem}>
              <div className={styles.notificationItemInfo}>
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </div>
              <ToggleSwitch
                checked={item.enabled}
                onChange={(checked) => onToggle(groupIndex, itemIndex, checked)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  </section>
);

/* ==========================================
   DANGER ZONE SECTION COMPONENT (functional)
========================================== */
const DangerZoneSection = ({ onDeactivate, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  return (
    <section id="danger" className={`${styles.settingsSection} ${styles.dangerZone}`}>
      <div className={styles.settingsSectionHeader}>
        <div className={styles.settingsSectionTitle}>
          <div className={`${styles.sectionIcon} ${styles.error}`}>
            <AlertIcon />
          </div>
          <h2>Zone de danger</h2>
        </div>
      </div>
      <div className={styles.settingsSectionBody}>
        {/* Deactivate */}
        <div className={styles.dangerItem}>
          <div className={styles.dangerItemInfo}>
            <h5>Désactiver le compte</h5>
            <p>Votre compte sera masqué mais vos données seront conservées.</p>
          </div>
          {!confirmDeactivate ? (
            <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={() => setConfirmDeactivate(true)}>Désactiver</button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={() => setConfirmDeactivate(false)}>Annuler</button>
              <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`} onClick={onDeactivate}>Confirmer</button>
            </div>
          )}
        </div>
        {/* Delete */}
        <div className={styles.dangerItem}>
          <div className={styles.dangerItemInfo}>
            <h5>Supprimer le compte</h5>
            <p>Cette action est irréversible. Toutes vos données seront supprimées.</p>
          </div>
          {!confirmDelete ? (
            <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`} onClick={() => setConfirmDelete(true)}>Supprimer</button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-error-500)' }}>Tapez "SUPPRIMER" pour confirmer :</p>
              <input type="text" className={styles.formInput} value={deleteText} onChange={(e) => setDeleteText(e.target.value)} placeholder="SUPPRIMER" />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={() => { setConfirmDelete(false); setDeleteText(''); }}>Annuler</button>
                <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`} disabled={deleteText !== 'SUPPRIMER'} onClick={onDelete}>
                  Supprimer définitivement
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const AgentSettings = () => {
  const { user, profile, signOut } = useAuthContext();
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [dbProfile, setDbProfile] = useState(null);

  // Personal data form
  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    nationality: '',
    bio: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    groups: [
      {
        title: 'Email',
        icon: MailIcon,
        items: [
          { title: 'Nouveaux messages', description: 'Recevoir un email quand un client vous contacte', enabled: true },
          { title: 'Rappels de visite', description: 'Recevoir un email 1h avant chaque visite', enabled: true },
          { title: 'Résumé hebdomadaire', description: 'Recevoir un récapitulatif de votre activité', enabled: false },
        ],
      },
      {
        title: 'SMS',
        icon: DeviceIcon,
        items: [
          { title: 'Alertes urgentes', description: 'Recevoir un SMS pour les actions importantes', enabled: true },
          { title: 'Confirmation de paiement', description: 'Recevoir un SMS quand vous recevez un paiement', enabled: true },
        ],
      },
    ],
  });

  // Fetch profile from DB
  const fetchFullProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (data) {
      setDbProfile(data);
      const names = (data.full_name || '').split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';
      setPersonalData({
        firstName,
        lastName,
        email: user.email || '',
        phone: data.phone || '',
        birthDate: data.birth_date || '',
        nationality: data.nationality || '',
        bio: '', // bio field could be added to profiles table later
      });
      if (data.avatar_url) {
        setAvatarUrl(`${data.avatar_url}?t=${Date.now()}`);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchFullProfile();
  }, [fetchFullProfile]);

  // Avatar upload
  const handleAvatarUpload = async (file) => {
    if (!user || !file) return;
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;

    setSaving(true);
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setToast({ type: 'error', message: `Erreur upload: ${uploadError.message}` });
      setSaving(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    const urlWithBuster = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      setToast({ type: 'error', message: `Erreur: ${updateError.message}` });
    } else {
      setAvatarUrl(urlWithBuster);
      setToast({ type: 'success', message: 'Photo de profil mise à jour' });
    }
    setSaving(false);
  };

  // Save personal info
  const handleSavePersonal = async () => {
    if (!user) return;
    if (!personalData.firstName.trim() || !personalData.lastName.trim()) {
      setToast({ type: 'error', message: 'Prénom et nom sont obligatoires' });
      return;
    }

    setSaving(true);
    const fullName = `${personalData.firstName.trim()} ${personalData.lastName.trim()}`;
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone: personalData.phone,
        nationality: personalData.nationality,
        birth_date: personalData.birthDate || null,
      })
      .eq('id', user.id);

    if (error) {
      setToast({ type: 'error', message: `Erreur: ${error.message}` });
    } else {
      setToast({ type: 'success', message: 'Informations enregistrées avec succès' });
      await fetchFullProfile();
    }
    setSaving(false);
  };

  const handleCancelPersonal = () => {
    fetchFullProfile();
  };

  // Deactivate account
  const handleDeactivate = async () => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ is_active: false }).eq('id', user.id);
    if (error) {
      setToast({ type: 'error', message: error.message });
    } else {
      setToast({ type: 'success', message: 'Compte désactivé' });
      await signOut();
    }
  };

  // Delete account
  const handleDelete = async () => {
    if (!user) return;
    setToast({ type: 'error', message: 'La suppression de compte nécessite une confirmation par un administrateur. Votre demande a été enregistrée.' });
    await supabase.from('profiles').update({ is_active: false }).eq('id', user.id);
    setTimeout(() => signOut(), 2000);
  };

  const handleNotificationToggle = (groupIndex, itemIndex, checked) => {
    setNotificationSettings((prev) => {
      const newGroups = [...prev.groups];
      newGroups[groupIndex] = { ...newGroups[groupIndex], items: [...newGroups[groupIndex].items] };
      newGroups[groupIndex].items[itemIndex] = { ...newGroups[groupIndex].items[itemIndex], enabled: checked };
      return { ...prev, groups: newGroups };
    });
  };

  // Compute profile data
  const profileData = {
    name: dbProfile?.full_name || user?.user_metadata?.full_name || user?.email || 'Agent',
    verified: dbProfile?.kyc_status === 'verified',
    location: dbProfile?.nationality ? `Conakry, Guinée` : '',
    bio: personalData.bio || '',
    stats: [
      { value: '—', icon: true, label: 'Avis' },
      { value: '—', label: 'Taux réponse' },
      { value: '—', label: 'Biens gérés' },
      { value: '—', label: 'Temps réponse' },
    ],
  };

  if (!user) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}><p>Chargement…</p></div>;
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <TopBar />

      <div className={styles.pageContent}>
        <div className={styles.settingsLayout}>
          <SettingsNav activeSection={activeSection} onSectionChange={setActiveSection} onLogout={signOut} />

          <div className={styles.settingsContent}>
            <ProfileSection profile={profileData} avatarUrl={avatarUrl} onChangePhoto={handleAvatarUpload} />

            <InformationsSection
              data={personalData}
              onChange={(field, value) => setPersonalData(prev => ({ ...prev, [field]: value }))}
              onSave={handleSavePersonal}
              onCancel={handleCancelPersonal}
              saving={saving}
            />

            <KYCSection kycStatus={dbProfile?.kyc_status || 'pending'} />

            <SubscriptionSection plan={dbProfile?.subscription_plan || 'free'} />

            <WalletSection />

            <SecuritySection
              passwordChangedAt={dbProfile?.password_changed_at}
              onChangePassword={fetchFullProfile}
            />

            <NotificationsSection
              notifications={notificationSettings}
              onToggle={handleNotificationToggle}
            />

            <DangerZoneSection onDeactivate={handleDeactivate} onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentSettings;
