import { useState } from 'react';
import styles from './AgentSettings.module.css';

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

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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

/* ==========================================
   TOP BAR COMPONENT
========================================== */
const TopBar = () => (
  <header className={styles.topBar}>
    <div className={styles.topBarLeft}>
      <div className={styles.pageContext}>
        <span className={styles.pageDate}>Mardi 4 février 2025</span>
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

/* ==========================================
   SETTINGS NAVIGATION COMPONENT
========================================== */
const SettingsNav = ({ activeSection, onSectionChange }) => {
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
                onSectionChange(item.id);
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
   PROFILE SECTION COMPONENT
========================================== */
const ProfileSection = ({ profile }) => (
  <section id="profile" className={styles.settingsSection}>
    <div className={styles.settingsSectionHeader}>
      <div className={styles.settingsSectionTitle}>
        <div className={`${styles.sectionIcon} ${styles.primary}`}>
          <UserIcon />
        </div>
        <h2>Profil public</h2>
      </div>
      <a href="#" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
        <EyeIcon />
        Voir mon profil
      </a>
    </div>
    <div className={styles.settingsSectionBody}>
      <div className={styles.profilePublic}>
        <div className={styles.profileAvatarSection}>
          <div className={styles.profileAvatarLarge}>
            {profile.initials}
            <button className={styles.profileAvatarEdit} title="Modifier la photo">
              <CameraIcon />
            </button>
          </div>
          <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
            Changer la photo
          </button>
        </div>
        <div className={styles.profileInfoSection}>
          <div className={styles.profileNameRow}>
            <h3>{profile.name}</h3>
            <span className={styles.verifiedBadge}>
              <BadgeCheckIcon />
              Agent Certifié
            </span>
          </div>
          <p className={styles.profileLocation}>
            <LocationIcon />
            {profile.location}
          </p>
          <div className={styles.profileBio}>
            <p className={styles.profileBioLabel}>Biographie</p>
            <p className={styles.profileBioText}>{profile.bio}</p>
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

/* ==========================================
   INFORMATIONS SECTION COMPONENT
========================================== */
const InformationsSection = ({ data }) => (
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
      <form>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Prénom</label>
            <input type="text" className={styles.formInput} defaultValue={data.firstName} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nom</label>
            <input type="text" className={styles.formInput} defaultValue={data.lastName} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <input type="email" className={styles.formInput} defaultValue={data.email} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Téléphone</label>
            <input type="tel" className={styles.formInput} defaultValue={data.phone} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Quartier</label>
            <input type="text" className={styles.formInput} defaultValue={data.neighborhood} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Ville</label>
            <input type="text" className={styles.formInput} defaultValue={data.city} disabled />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.formLabel}>Biographie</label>
            <textarea className={`${styles.formInput} ${styles.formTextarea}`} defaultValue={data.bio} />
            <span className={styles.formHelp}>Cette description sera visible sur votre profil public.</span>
          </div>
        </div>
        <div className={styles.formActions}>
          <button type="button" className={`${styles.btn} ${styles.btnSecondary}`}>Annuler</button>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Enregistrer</button>
        </div>
      </form>
    </div>
  </section>
);

/* ==========================================
   KYC SECTION COMPONENT
========================================== */
const KYCSection = ({ kyc }) => (
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
      <div className={`${styles.kycStatusCard} ${styles[kyc.status]}`}>
        <div className={`${styles.kycStatusIcon} ${styles[kyc.status]}`}>
          <CheckIcon />
        </div>
        <div className={styles.kycStatusInfo}>
          <h4>{kyc.title}</h4>
          <p>{kyc.description}</p>
        </div>
      </div>
      <div className={styles.kycItems}>
        {kyc.items.map((item, index) => (
          <div key={index} className={styles.kycItem}>
            <div className={`${styles.kycItemIcon} ${styles.verified}`}>
              <CheckIcon />
            </div>
            <div className={styles.kycItemInfo}>
              <h5>{item.title}</h5>
              <p>{item.subtitle}</p>
            </div>
            <span className={styles.kycItemStatus}>{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ==========================================
   SUBSCRIPTION SECTION COMPONENT
========================================== */
const SubscriptionSection = ({ subscription }) => (
  <section id="subscription" className={styles.settingsSection}>
    <div className={styles.settingsSectionHeader}>
      <div className={styles.settingsSectionTitle}>
        <div className={`${styles.sectionIcon} ${styles.gold}`}>
          <SparklesIcon />
        </div>
        <h2>Abonnement</h2>
      </div>
      <a href="#" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>
        Historique des factures
      </a>
    </div>
    <div className={styles.settingsSectionBody}>
      <div className={styles.subscriptionCurrent}>
        <div className={styles.subscriptionInfo}>
          <h4>
            Plan actuel
            <span className={styles.planBadge}>{subscription.plan}</span>
          </h4>
          <p>Prochain renouvellement : {subscription.renewalDate}</p>
        </div>
        <div className={styles.subscriptionPrice}>
          <div className={styles.amount}>{subscription.price}</div>
          <div className={styles.period}>{subscription.period}</div>
        </div>
      </div>

      <div className={styles.subscriptionFeatures}>
        {subscription.features.map((feature, index) => (
          <div key={index} className={styles.subscriptionFeature}>
            <CheckIcon />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className={styles.upgradeBanner}>
        <div className={styles.upgradeBannerContent}>
          <h4>
            <SparklesIcon />
            Passez au Plan Pro
          </h4>
          <p>Commission réduite à 3-4% • 10 mises en avant/mois • Support prioritaire</p>
        </div>
        <button className={styles.upgradeBtn}>Voir les avantages</button>
      </div>
    </div>
  </section>
);

/* ==========================================
   WALLET SECTION COMPONENT
========================================== */
const WalletSection = ({ wallet }) => (
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
          <div className={styles.walletBalanceAmount}>{wallet.balance}</div>
          <p className={styles.walletBalanceNote}>
            Commission au retrait (Plan Basic) : <strong>{wallet.commissionRate}</strong><br />
            Vous recevrez : <strong>{wallet.netAmount}</strong>
          </p>
        </div>
        <button className={`${styles.btn} ${styles.btnGold}`}>
          <PlusIcon />
          Retirer les fonds
        </button>
      </div>

      <div className={styles.walletHistory}>
        <div className={styles.walletHistoryHeader}>
          <h5>Historique récent</h5>
          <a href="#" className={`${styles.btn} ${styles.btnGhost} ${styles.btnXs}`}>Voir tout</a>
        </div>
        <div className={styles.walletHistoryList}>
          {wallet.history.map((item, index) => (
            <div key={index} className={styles.walletHistoryItem}>
              <div className={`${styles.walletHistoryIcon} ${styles[item.type]}`}>
                {item.type === 'income' ? <PlusIcon /> : <MinusIcon />}
              </div>
              <div className={styles.walletHistoryDetails}>
                <h6>{item.title}</h6>
                <p>{item.date}</p>
              </div>
              <span className={`${styles.walletHistoryAmount} ${styles[item.type]}`}>
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ==========================================
   SECURITY SECTION COMPONENT
========================================== */
const SecuritySection = ({ security }) => (
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
      {security.items.map((item, index) => (
        <div key={index} className={styles.securityItem}>
          <div className={styles.securityItemInfo}>
            <div className={styles.securityItemIcon}>
              <item.icon />
            </div>
            <div className={styles.securityItemDetails}>
              <h5>{item.title}</h5>
              <p>{item.description}</p>
            </div>
          </div>
          <button className={`${styles.btn} ${item.primary ? styles.btnPrimary : styles.btnSecondary} ${styles.btnSm}`}>
            {item.action}
          </button>
        </div>
      ))}
    </div>
  </section>
);

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
   DANGER ZONE SECTION COMPONENT
========================================== */
const DangerZoneSection = () => (
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
      <div className={styles.dangerItem}>
        <div className={styles.dangerItemInfo}>
          <h5>Désactiver le compte</h5>
          <p>Votre compte sera masqué mais vos données seront conservées.</p>
        </div>
        <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>Désactiver</button>
      </div>
      <div className={styles.dangerItem}>
        <div className={styles.dangerItemInfo}>
          <h5>Supprimer le compte</h5>
          <p>Cette action est irréversible. Toutes vos données seront supprimées.</p>
        </div>
        <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}>Supprimer</button>
      </div>
    </div>
  </section>
);

/* ==========================================
   MAIN COMPONENT
========================================== */
const AgentSettings = () => {
  const [activeSection, setActiveSection] = useState('profile');
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

  const handleNotificationToggle = (groupIndex, itemIndex, checked) => {
    setNotificationSettings((prev) => {
      const newGroups = [...prev.groups];
      newGroups[groupIndex].items[itemIndex].enabled = checked;
      return { ...prev, groups: newGroups };
    });
  };

  // Mock Data
  const mockData = {
    profile: {
      name: 'Abdoulaye Diallo',
      initials: 'AD',
      location: 'Kipé, Ratoma, Conakry',
      bio: "Agent immobilier passionné avec 5 ans d'expérience sur le marché guinéen. Spécialisé dans les locations résidentielles à Conakry. Je m'engage à vous trouver le logement idéal avec transparence et professionnalisme.",
      stats: [
        { value: '4.8', icon: true, label: '47 avis' },
        { value: '89%', label: 'Taux réponse' },
        { value: '156', label: 'Biens loués' },
        { value: '2h', label: 'Temps réponse' },
      ],
    },
    informations: {
      firstName: 'Abdoulaye',
      lastName: 'Diallo',
      email: 'abdoulaye.diallo@email.com',
      phone: '+224 620 12 34 56',
      neighborhood: 'Kipé',
      city: 'Conakry',
      bio: "Agent immobilier passionné avec 5 ans d'expérience sur le marché guinéen. Spécialisé dans les locations résidentielles à Conakry.",
    },
    kyc: {
      status: 'verified',
      title: 'Votre identité est vérifiée',
      description: 'Votre profil bénéficie du badge "Agent Certifié" et inspire confiance aux clients.',
      items: [
        { title: "Pièce d'identité", subtitle: "Carte nationale d'identité", date: 'Vérifié le 15 Jan 2025' },
        { title: 'Certificat de résidence', subtitle: 'Document officiel', date: 'Vérifié le 15 Jan 2025' },
        { title: 'Vérification faciale', subtitle: "Selfie comparé à la pièce d'identité", date: 'Vérifié le 15 Jan 2025' },
      ],
    },
    subscription: {
      plan: 'BASIC',
      renewalDate: '1er Mars 2025',
      price: '50,000 GNF',
      period: 'par mois',
      features: ['Biens illimités', '2 mises en avant/mois', 'Commission : 5-6%'],
    },
    wallet: {
      balance: '3,450,000 GNF',
      commissionRate: '5%',
      netAmount: '3,277,500 GNF',
      history: [
        { type: 'income', title: 'Commission - Location F3 Kipé', date: 'Hier à 14:32', amount: '+200,000 GNF' },
        { type: 'income', title: 'Commission - Location Studio Nongo', date: '3 février 2025', amount: '+150,000 GNF' },
        { type: 'expense', title: 'Retrait Orange Money', date: '1 février 2025', amount: '-1,000,000 GNF' },
        { type: 'income', title: 'Commission - Location Villa Lambanyi', date: '28 janvier 2025', amount: '+480,000 GNF' },
      ],
    },
    security: {
      items: [
        { icon: KeyIcon, title: 'Mot de passe', description: 'Dernière modification : il y a 3 mois', action: 'Modifier', primary: false },
        { icon: DeviceIcon, title: 'Authentification à deux facteurs (2FA)', description: 'Non activée - Recommandé pour plus de sécurité', action: 'Activer', primary: true },
        { icon: DesktopIcon, title: 'Sessions actives', description: '2 appareils connectés', action: 'Gérer', primary: false },
      ],
    },
  };

  return (
    <>
      <TopBar />

      <div className={styles.pageContent}>
        <div className={styles.settingsLayout}>
          <SettingsNav activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className={styles.settingsContent}>
            <ProfileSection profile={mockData.profile} />
            <InformationsSection data={mockData.informations} />
            <KYCSection kyc={mockData.kyc} />
            <SubscriptionSection subscription={mockData.subscription} />
            <WalletSection wallet={mockData.wallet} />
            <SecuritySection security={mockData.security} />
            <NotificationsSection
              notifications={notificationSettings}
              onToggle={handleNotificationToggle}
            />
            <DangerZoneSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentSettings;