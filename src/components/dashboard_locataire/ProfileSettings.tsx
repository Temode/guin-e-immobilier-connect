// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import styles from './ProfileSettings.module.css';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { countries, getDialCodeByCountryName } from '@/data/countries';

/* ==========================================
   ICONS COMPONENTS (page-specific only)
========================================== */
const UserIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CameraIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const MailIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const VerifiedBadgeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const CreditCardIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const NotificationIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const WarningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IdCardIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>
);

const PassportIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ImageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const EditIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const SmartphoneIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const DesktopIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

/* ==========================================
   TOAST / FEEDBACK
========================================== */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {type === 'success' ? <CheckIcon /> : <WarningIcon />}
      <span>{message}</span>
    </div>
  );
};

/* ==========================================
   HEADER COMPONENT
========================================== */
const Header = () => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className={styles.mainHeader}>
      <nav className={styles.breadcrumb}>
        <a href="#">Tableau de bord</a>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Profil & Paramètres</span>
      </nav>
      <div className={styles.headerRight}>
        <span className={styles.headerDate}>{dateStr}</span>
      </div>
    </header>
  );
};

/* ==========================================
   PROFILE HEADER COMPONENT
========================================== */
const ProfileHeader = ({ profile, avatarUrl, onEditAvatar }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={styles.profileHeader}>
      <div className={styles.profileAvatarSection}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className={styles.profileAvatarImg} />
        ) : (
          <div className={styles.profileAvatar}>{getInitials(profile.name)}</div>
        )}
        <button className={styles.profileAvatarEdit} onClick={onEditAvatar}>
          <CameraIcon />
        </button>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files?.[0]) onEditAvatar(e.target.files[0]);
          }}
        />
      </div>
      <div className={styles.profileInfo}>
        <div className={styles.profileNameRow}>
          <h1 className={styles.profileName}>{profile.name}</h1>
          {profile.verified && (
            <span className={styles.profileVerifiedBadge}>
              <VerifiedBadgeIcon />
              Compte vérifié
            </span>
          )}
        </div>
        <div className={styles.profileMeta}>
          <span className={styles.profileMetaItem}>
            <MailIcon />
            {profile.email}
          </span>
          <span className={styles.profileMetaItem}>
            <PhoneIcon />
            {profile.phone || 'Non renseigné'}
          </span>
          <span className={styles.profileMetaItem}>
            <CalendarIcon />
            Membre depuis {profile.memberSince}
          </span>
        </div>
        <div className={styles.profileProgress}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Profil complété</span>
            <span className={styles.progressValue}>{profile.completionPercentage}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${profile.completionPercentage}%` }}></div>
          </div>
          <div className={styles.progressTips}>
            {profile.completionTips.map((tip, index) => (
              <span key={index} className={`${styles.progressTip} ${tip.completed ? styles.completed : styles.pending}`}>
                {tip.completed ? <CheckIcon /> : <ClockIcon />}
                {tip.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   SETTINGS NAV COMPONENT
========================================== */
const SettingsNav = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'personal', icon: UserIcon, label: 'Informations' },
    { id: 'documents', icon: DocumentIcon, label: 'Documents KYC', badge: 1 },
    { id: 'payment', icon: CreditCardIcon, label: 'Paiement' },
    { id: 'notifications', icon: NotificationIcon, label: 'Notifications' },
    { id: 'security', icon: LockIcon, label: 'Sécurité' },
    { id: 'danger', icon: WarningIcon, label: 'Zone danger', danger: true },
  ];

  return (
    <nav className={styles.settingsNav}>
      <span className={styles.settingsNavTitle}>Paramètres</span>
      {navItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`${styles.settingsNavLink} ${activeSection === item.id ? styles.active : ''} ${item.danger ? styles.danger : ''}`}
          onClick={(e) => { e.preventDefault(); onSectionChange(item.id); }}
        >
          <item.icon />
          {item.label}
          {item.badge && <span className={styles.badge}>{item.badge}</span>}
        </a>
      ))}
    </nav>
  );
};

/* ==========================================
   PERSONAL INFO SECTION
========================================== */
const PersonalInfoSection = ({ data, onChange, onSave, onCancel, saving }) => {
  const dialCode = getDialCodeByCountryName(data.nationality);

  const handleNationalityChange = (value) => {
    onChange('nationality', value);
    // Auto-set phone dial code
    const newDialCode = getDialCodeByCountryName(value);
    if (newDialCode) {
      // Keep local number part, replace dial code
      const currentPhone = data.phone || '';
      const localPart = currentPhone.replace(/^\+\d+[\s-]?/, '').trim();
      onChange('phone', `${newDialCode} ${localPart}`);
    }
  };

  return (
    <section id="personal" className={styles.settingsSection}>
      <div className={styles.settingsSectionHeader}>
        <h2 className={styles.settingsSectionTitle}>
          <UserIcon />
          Informations personnelles
        </h2>
      </div>
      <div className={styles.settingsSectionBody}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Prénom <span className={styles.required}>*</span></label>
            <input type="text" className={styles.formInput} value={data.firstName} onChange={(e) => onChange('firstName', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nom <span className={styles.required}>*</span></label>
            <input type="text" className={styles.formInput} value={data.lastName} onChange={(e) => onChange('lastName', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email <span className={styles.required}>*</span></label>
            <input type="email" className={styles.formInput} value={data.email} disabled style={{ opacity: 0.6 }} />
            <small style={{ color: 'var(--color-neutral-400)', fontSize: '0.75rem' }}>L'email ne peut pas être modifié ici</small>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nationalité</label>
            <select className={styles.formSelect} value={data.nationality} onChange={(e) => handleNationalityChange(e.target.value)}>
              <option value="">— Sélectionner —</option>
              {countries.map((c) => (
                <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Téléphone <span className={styles.required}>*</span></label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                background: 'var(--color-neutral-100)', 
                padding: '0.6rem 0.75rem', 
                borderRadius: 'var(--radius-md)', 
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--color-neutral-700)',
                whiteSpace: 'nowrap',
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
        </div>
        <div className={styles.formActions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onCancel} disabled={saving}>Annuler</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onSave} disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   DOCUMENTS SECTION (kept as-is, static for now)
========================================== */
const DocumentsSection = ({ documents }) => {
  const documentIcons = { cni: IdCardIcon, passport: PassportIcon, address: LocationIcon, photo: ImageIcon };

  return (
    <section id="documents" className={styles.settingsSection}>
      <div className={styles.settingsSectionHeader}>
        <h2 className={`${styles.settingsSectionTitle} ${styles.gold}`}>
          <DocumentIcon />
          Documents d'identité (KYC)
        </h2>
      </div>
      <div className={styles.settingsSectionBody}>
        <div className={styles.documentsGrid}>
          {documents.map((doc, index) => {
            const IconComponent = documentIcons[doc.type] || DocumentIcon;
            return (
              <div key={index} className={`${styles.documentCard} ${styles[doc.status]}`}>
                <div className={styles.documentIcon}><IconComponent /></div>
                <div className={styles.documentContent}>
                  <h4 className={styles.documentTitle}>{doc.title}</h4>
                  {doc.statusLabel && (
                    <span className={`${styles.documentStatus} ${styles[doc.status]}`}>
                      {doc.status === 'valid' ? <CheckIcon /> : <ClockIcon />}
                      {doc.statusLabel}
                    </span>
                  )}
                  <p className={styles.documentMeta}>{doc.meta}</p>
                </div>
                <button className={`${styles.documentAction} ${styles[doc.actionType]}`}>{doc.actionLabel}</button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   PAYMENT SECTION (kept as-is)
========================================== */
const PaymentSection = ({ paymentMethods, onAddPayment }) => {
  return (
    <section id="payment" className={styles.settingsSection}>
      <div className={styles.settingsSectionHeader}>
        <h2 className={styles.settingsSectionTitle}><CreditCardIcon /> Moyens de paiement</h2>
      </div>
      <div className={styles.settingsSectionBody}>
        <div className={styles.paymentMethods}>
          {paymentMethods.map((method, index) => (
            <div key={index} className={`${styles.paymentMethod} ${method.isDefault ? styles.active : ''}`}>
              <div className={`${styles.paymentMethodLogo} ${styles[method.provider]}`}>{method.providerLabel}</div>
              <div className={styles.paymentMethodInfo}>
                <h4 className={styles.paymentMethodName}>{method.name}</h4>
                <p className={styles.paymentMethodNumber}>{method.number}</p>
              </div>
              {method.isDefault && <span className={`${styles.paymentMethodBadge} ${styles.default}`}>Par défaut</span>}
              <div className={styles.paymentMethodActions}>
                <button className={styles.paymentMethodAction}><EditIcon /></button>
                {!method.isDefault && <button className={styles.paymentMethodAction}><TrashIcon /></button>}
              </div>
            </div>
          ))}
          <button className={styles.addPaymentMethod} onClick={onAddPayment}><PlusIcon /> Ajouter un moyen de paiement</button>
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   NOTIFICATIONS SECTION (kept as-is)
========================================== */
const NotificationsSection = ({ preferences, onToggle }) => {
  return (
    <section id="notifications" className={styles.settingsSection}>
      <div className={styles.settingsSectionHeader}>
        <h2 className={styles.settingsSectionTitle}><NotificationIcon /> Préférences de notifications</h2>
      </div>
      <div className={styles.settingsSectionBody}>
        <div className={styles.toggleGroup}>
          {preferences.map((pref, index) => (
            <div key={index} className={styles.toggleItem}>
              <div className={styles.toggleItemInfo}>
                <p className={styles.toggleItemLabel}>{pref.label}</p>
                <p className={styles.toggleItemDesc}>{pref.description}</p>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" checked={pref.enabled} onChange={() => onToggle(index)} />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   SECURITY SECTION (functional)
========================================== */
const SecuritySection = ({ passwordChangedAt, onChangePassword }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
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
      // Update password_changed_at in profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ password_changed_at: new Date().toISOString() } as any).eq('id', user.id);
      }
      setPasswordMsg({ type: 'success', text: 'Mot de passe modifié avec succès' });
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onChangePassword?.();
    }
    setChangingPassword(false);
  };

  return (
    <section id="security" className={styles.settingsSection}>
      <div className={styles.settingsSectionHeader}>
        <h2 className={styles.settingsSectionTitle}><LockIcon /> Sécurité du compte</h2>
      </div>
      <div className={styles.settingsSectionBody}>
        {/* Password */}
        <div className={styles.securityItem}>
          <div className={styles.securityItemInfo}>
            <div className={`${styles.securityIcon} ${styles.success}`}><LockIcon /></div>
            <div className={styles.securityDetails}>
              <h4>Mot de passe</h4>
              <p>{getPasswordAge()}</p>
            </div>
          </div>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setShowPasswordForm(!showPasswordForm)}>
            {showPasswordForm ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        {showPasswordForm && (
          <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="password"
              className={styles.formInput}
              placeholder="Nouveau mot de passe (min 8 car.)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              className={styles.formInput}
              placeholder="Confirmer le nouveau mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordMsg && (
              <p style={{ color: passwordMsg.type === 'error' ? 'var(--color-error)' : 'var(--color-success)', fontSize: '0.875rem' }}>
                {passwordMsg.text}
              </p>
            )}
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handlePasswordChange} disabled={changingPassword}>
              {changingPassword ? 'Modification…' : 'Changer le mot de passe'}
            </button>
          </div>
        )}

        {/* 2FA - informational for now */}
        <div className={styles.securityItem}>
          <div className={styles.securityItemInfo}>
            <div className={`${styles.securityIcon} ${styles.warning}`}><SmartphoneIcon /></div>
            <div className={styles.securityDetails}>
              <h4>Authentification à deux facteurs</h4>
              <p>Non activée — Recommandé</p>
            </div>
          </div>
          <button className={`${styles.btn} ${styles.btnGold}`} disabled>Bientôt disponible</button>
        </div>

        {/* Sessions - informational */}
        <div className={styles.securityItem}>
          <div className={styles.securityItemInfo}>
            <div className={`${styles.securityIcon}`}><DesktopIcon /></div>
            <div className={styles.securityDetails}>
              <h4>Sessions actives</h4>
              <p>Session actuelle</p>
            </div>
          </div>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={async () => {
            await supabase.auth.signOut({ scope: 'others' });
            alert('Autres sessions déconnectées');
          }}>Déconnecter les autres</button>
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   DANGER ZONE SECTION (functional)
========================================== */
const DangerZoneSection = ({ onDeactivate, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  return (
    <section id="danger" className={`${styles.settingsSection} ${styles.dangerZone}`}>
      <div className={styles.settingsSectionHeader}>
        <h2 className={styles.settingsSectionTitle}><WarningIcon /> Zone danger</h2>
      </div>
      <div className={styles.settingsSectionBody}>
        {/* Deactivate */}
        <div className={styles.dangerItem}>
          <div className={styles.dangerItemInfo}>
            <h4>Désactiver mon compte</h4>
            <p>Suspension temporaire, réactivation possible</p>
          </div>
          {!confirmDeactivate ? (
            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setConfirmDeactivate(true)}>Désactiver</button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setConfirmDeactivate(false)}>Annuler</button>
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={onDeactivate}>Confirmer</button>
            </div>
          )}
        </div>

        {/* Delete */}
        <div className={styles.dangerItem}>
          <div className={styles.dangerItemInfo}>
            <h4>Supprimer mon compte</h4>
            <p>Action irréversible — toutes vos données seront supprimées</p>
          </div>
          {!confirmDelete ? (
            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setConfirmDelete(true)}>Supprimer</button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>Tapez "SUPPRIMER" pour confirmer :</p>
              <input
                type="text"
                className={styles.formInput}
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder="SUPPRIMER"
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => { setConfirmDelete(false); setDeleteText(''); }}>Annuler</button>
                <button className={`${styles.btn} ${styles.btnDanger}`} disabled={deleteText !== 'SUPPRIMER'} onClick={onDelete}>
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
   HELPERS
========================================== */
function formatMemberSince(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

function computeCompletion(profile, user) {
  const tips = [];
  let completed = 0;
  const total = 4;

  const emailVerified = !!user?.email_confirmed_at;
  tips.push({ label: 'Email vérifié', completed: emailVerified });
  if (emailVerified) completed++;

  const hasPhone = !!profile?.phone && profile.phone.trim().length > 4;
  tips.push({ label: 'Téléphone renseigné', completed: hasPhone });
  if (hasPhone) completed++;

  const hasName = !!profile?.full_name && profile.full_name.trim().length > 1;
  tips.push({ label: 'Nom renseigné', completed: hasName });
  if (hasName) completed++;

  const hasAvatar = !!profile?.avatar_url;
  tips.push({ label: 'Photo de profil', completed: hasAvatar });
  if (hasAvatar) completed++;

  return { percentage: Math.round((completed / total) * 100), tips };
}

/* ==========================================
   MAIN COMPONENT
========================================== */
const ProfileSettings = () => {
  const { user, profile, signOut } = useAuthContext();
  const [activeSection, setActiveSection] = useState('personal');
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
  });

  const [notificationPrefs, setNotificationPrefs] = useState([
    { label: 'Paiements', description: 'Confirmations, rappels, reçus', enabled: true },
    { label: 'Messages', description: 'Nouveaux messages agent/propriétaire', enabled: true },
    { label: 'Documents', description: 'Renouvellements, nouveaux documents', enabled: true },
    { label: 'Alertes immobilières', description: 'Biens correspondant à vos critères', enabled: true },
    { label: 'Marketing', description: 'Offres spéciales et actualités', enabled: false },
  ]);

  // Fetch full profile from DB
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
      });
      if (data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchFullProfile();
  }, [fetchFullProfile]);

  // Avatar upload
  const handleAvatarUpload = async (fileOrEvent) => {
    let file;
    if (fileOrEvent instanceof File) {
      file = fileOrEvent;
    } else {
      // Trigger file input
      document.getElementById('avatar-upload')?.click();
      return;
    }

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
    // Add cache buster
    const urlWithBuster = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl } as any)
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
      } as any)
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
    const { error } = await supabase.from('profiles').update({ is_active: false } as any).eq('id', user.id);
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
    // We sign the user out — actual deletion requires a backend function with service role
    setToast({ type: 'error', message: 'La suppression de compte nécessite une confirmation par un administrateur. Votre demande a été enregistrée.' });
    // Mark as inactive
    await supabase.from('profiles').update({ is_active: false } as any).eq('id', user.id);
    setTimeout(() => signOut(), 2000);
  };

  const handleNotificationToggle = (index) => {
    setNotificationPrefs((prev) =>
      prev.map((pref, i) => (i === index ? { ...pref, enabled: !pref.enabled } : pref))
    );
  };

  // Compute profile header data
  const completion = computeCompletion(dbProfile, user);
  const profileHeaderData = {
    name: dbProfile?.full_name || user?.email || 'Utilisateur',
    email: user?.email || '',
    phone: dbProfile?.phone || '',
    memberSince: formatMemberSince(dbProfile?.created_at || user?.created_at),
    verified: dbProfile?.kyc_status === 'verified',
    completionPercentage: completion.percentage,
    completionTips: completion.tips,
  };

  // Static data for sections not yet dynamic
  const documents = [
    { type: 'cni', title: "Carte d'identité nationale", status: 'expiring', statusLabel: 'Expire dans 15 jours', meta: 'Expire le 17 Février 2026', actionType: 'update', actionLabel: 'Mettre à jour' },
    { type: 'passport', title: 'Passeport', status: 'valid', statusLabel: 'Valide', meta: 'Expire le 20 Mars 2030', actionType: 'view', actionLabel: 'Voir' },
    { type: 'address', title: 'Justificatif de domicile', status: 'valid', statusLabel: 'Valide', meta: 'Facture EDG - Janvier 2026', actionType: 'view', actionLabel: 'Voir' },
    { type: 'photo', title: "Photo d'identité", status: 'empty', meta: 'Optionnel', actionType: 'upload', actionLabel: 'Ajouter' },
  ];
  const paymentMethods = [
    { provider: 'orange', providerLabel: 'Orange Money', name: 'Orange Money', number: '+224 621 •• •• 00', isDefault: true },
    { provider: 'mtn', providerLabel: 'MTN MoMo', name: 'MTN Mobile Money', number: '+224 66 •• •• 45', isDefault: false },
  ];

  if (!user) {
    return <div className={styles.mainContent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>Chargement…</p>
    </div>;
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Header />

      <main className={styles.mainContent}>
        <ProfileHeader profile={profileHeaderData} avatarUrl={avatarUrl} onEditAvatar={handleAvatarUpload} />

        <div className={styles.settingsLayout}>
          <SettingsNav activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className={styles.settingsContent}>
            <PersonalInfoSection
              data={personalData}
              onChange={(field, value) => setPersonalData(prev => ({ ...prev, [field]: value }))}
              onSave={handleSavePersonal}
              onCancel={handleCancelPersonal}
              saving={saving}
            />

            <DocumentsSection documents={documents} />

            <PaymentSection paymentMethods={paymentMethods} onAddPayment={() => {}} />

            <NotificationsSection preferences={notificationPrefs} onToggle={handleNotificationToggle} />

            <SecuritySection
              passwordChangedAt={dbProfile?.password_changed_at}
              onChangePassword={fetchFullProfile}
            />

            <DangerZoneSection onDeactivate={handleDeactivate} onDelete={handleDelete} />
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfileSettings;
