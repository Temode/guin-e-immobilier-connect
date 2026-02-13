import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { usePropertyContext } from '../../context/PropertyContext';
import { useAuthContext } from '@/context/AuthContext';
import UserProfileMenu from '../shared/UserProfileMenu';
import {
  Check,
  ArrowRight,
  Search,
  CreditCard,
  BarChart3,
  PenTool,
  Globe,
  MessageCircle,
  MapPin,
  Lock,
  DollarSign,
  FileText,
  ShieldCheck,
  Zap,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Heart,
  Star,
  Image,
  Home as HomeIcon,
  Maximize2,
  Snowflake,
  Zap as BoltIcon,
  Car,
  Sofa,
  CloudSun
} from 'lucide-react';

/* ==========================================
   VERIFIED BADGE ICON COMPONENT
========================================== */
const VerifiedBadgeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

/* ==========================================
   PROPERTY CARD COMPONENT (Style SearchProperty)
========================================== */
interface PropertyFeature {
  type: string;
  label: string;
}

interface PropertyBadge {
  type: 'new' | 'premium' | 'verified';
  label: string;
}

interface PropertyAgent {
  name: string;
  initials: string;
  verified: boolean;
}

interface Property {
  id: number;
  image: string;
  title: string;
  price: number;
  location: string;
  photosCount: number;
  premium: boolean;
  badges: PropertyBadge[];
  features: PropertyFeature[];
  agent: PropertyAgent;
  isFavorite?: boolean;
}

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle: (id: number) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onFavoriteToggle }) => {
  const featureIcons: Record<string, React.FC<{ className?: string }>> = {
    rooms: HomeIcon,
    area: Maximize2,
    ac: Snowflake,
    generator: BoltIcon,
    parking: Car,
    furnished: Sofa,
    terrace: CloudSun,
    balcony: CloudSun,
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <article className={`${styles.propertyCard} ${property.premium ? styles.premium : ''}`}>
      <div className={styles.propertyImage}>
        <img src={property.image} alt={property.title} />
        {property.badges && property.badges.length > 0 && (
          <div className={styles.propertyBadges}>
            {property.badges.map((badge, index) => (
              <span key={index} className={`${styles.propertyBadge} ${styles[badge.type]}`}>
                {badge.type === 'premium' && <Star className={styles.starIcon} />}
                {badge.label}
              </span>
            ))}
          </div>
        )}
        <button
          className={`${styles.propertyFavorite} ${property.isFavorite ? styles.active : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onFavoriteToggle(property.id);
          }}
        >
          <Heart className={styles.heartIcon} fill={property.isFavorite ? 'currentColor' : 'none'} />
        </button>
        <span className={styles.propertyPhotosCount}>
          <Image className={styles.imageIcon} />
          {property.photosCount}
        </span>
      </div>
      <div className={styles.propertyContent}>
        <p className={styles.propertyPrice}>
          {formatPrice(property.price)} <span>GNF/mois</span>
        </p>
        <h3 className={styles.propertyTitle}>{property.title}</h3>
        <p className={styles.propertyLocation}>
          <MapPin className={styles.mapPinIcon} />
          {property.location}
        </p>
        <div className={styles.propertyFeatures}>
          {property.features.map((feature, index) => {
            const IconComponent = featureIcons[feature.type] || HomeIcon;
            return (
              <span key={index} className={styles.propertyFeature}>
                <IconComponent className={styles.featureIcon} />
                {feature.label}
              </span>
            );
          })}
        </div>
        <div className={styles.propertyFooter}>
          <div className={styles.propertyAgent}>
            <div className={styles.propertyAgentAvatar}>{property.agent.initials}</div>
            <div className={styles.propertyAgentInfo}>
              <span className={styles.propertyAgentName}>{property.agent.name}</span>
              {property.agent.verified && (
                <span className={styles.propertyAgentVerified}>
                  <VerifiedBadgeIcon className={styles.verifiedIcon} />
                  Vérifié
                </span>
              )}
            </div>
          </div>
          <button className={styles.propertyContactBtn}>Contacter</button>
        </div>
      </div>
    </article>
  );
};

const Home: React.FC = () => {
  const { state } = usePropertyContext();
  const { user } = useAuthContext();

  // Données des propriétés identiques à SearchProperty
  const [favorites, setFavorites] = useState<number[]>([1, 5]);

  const properties: Property[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
      title: 'Bel appartement F3 avec vue panoramique',
      price: 2500000,
      location: 'Kipé, Ratoma',
      photosCount: 12,
      premium: true,
      badges: [{ type: 'premium', label: 'Premium' }],
      features: [
        { type: 'rooms', label: '3 pièces' },
        { type: 'area', label: '85 m²' },
        { type: 'ac', label: 'Climatisé' },
      ],
      agent: { name: 'Abdoulaye D.', initials: 'AD', verified: true },
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
      title: 'Appartement F2 moderne et lumineux',
      price: 1800000,
      location: 'Nongo, Ratoma',
      photosCount: 8,
      premium: false,
      badges: [{ type: 'new', label: 'Nouveau' }],
      features: [
        { type: 'rooms', label: '2 pièces' },
        { type: 'area', label: '60 m²' },
        { type: 'generator', label: 'Groupe élec.' },
      ],
      agent: { name: 'Fatoumata K.', initials: 'FK', verified: true },
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
      title: 'Villa F4 avec jardin et parking',
      price: 3000000,
      location: 'Lambanyi, Ratoma',
      photosCount: 15,
      premium: false,
      badges: [{ type: 'verified', label: 'Vérifié' }],
      features: [
        { type: 'rooms', label: '4 pièces' },
        { type: 'area', label: '120 m²' },
        { type: 'parking', label: 'Parking' },
      ],
      agent: { name: 'Ibrahima B.', initials: 'IB', verified: true },
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
      title: 'Studio meublé tout équipé',
      price: 1200000,
      location: 'Cosa, Ratoma',
      photosCount: 6,
      premium: false,
      badges: [],
      features: [
        { type: 'rooms', label: '1 pièce' },
        { type: 'area', label: '30 m²' },
        { type: 'furnished', label: 'Meublé' },
      ],
      agent: { name: 'Mariama S.', initials: 'MS', verified: true },
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
      title: 'Appartement F3 de standing avec terrasse',
      price: 2800000,
      location: 'Taouyah, Ratoma',
      photosCount: 18,
      premium: true,
      badges: [
        { type: 'new', label: 'Nouveau' },
        { type: 'premium', label: 'Premium' },
      ],
      features: [
        { type: 'rooms', label: '3 pièces' },
        { type: 'area', label: '95 m²' },
        { type: 'terrace', label: 'Terrasse' },
      ],
      agent: { name: 'Abdoulaye D.', initials: 'AD', verified: true },
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
      title: 'Appartement F2 rénové avec balcon',
      price: 1500000,
      location: 'Koloma, Ratoma',
      photosCount: 10,
      premium: false,
      badges: [],
      features: [
        { type: 'rooms', label: '2 pièces' },
        { type: 'area', label: '55 m²' },
        { type: 'balcony', label: 'Balcon' },
      ],
      agent: { name: 'Oumar C.', initials: 'OC', verified: true },
    },
  ];

  const propertiesWithFavorites = properties.map((p) => ({
    ...p,
    isFavorite: favorites.includes(p.id),
  }));

  const handleFavoriteToggle = (propertyId: number) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const features = state.features.length > 0 ? state.features : [
    {
      id: 1,
      title: "100% Vérifiés KYC",
      description: "Chaque utilisateur passe une vérification biométrique stricte. Fini les faux profils et les arnaques. Vous savez exactement avec qui vous traitez.",
      icon: Lock
    },
    {
      id: 2,
      title: "Paiements Automatisés",
      description: "Les loyers sont prélevés automatiquement chaque mois et divisés entre agent et propriétaire. Plus de retards, plus de courses pour récupérer l'argent.",
      icon: CreditCard
    },
    {
      id: 3,
      title: "Tableaux de Bord Clairs",
      description: "Suivez vos revenus, vos locataires, vos paiements en temps réel. Tout est transparent et accessible depuis votre téléphone ou ordinateur.",
      icon: BarChart3
    },
    {
      id: 4,
      title: "Contrats Automatiques",
      description: "Générez des contrats de bail professionnels en quelques clics. Signature électronique incluse. Tout est légal et archivé.",
      icon: PenTool
    },
    {
      id: 5,
      title: "Gestion Diaspora",
      description: "Vous êtes à l'étranger ? Nous gérons vos biens en Guinée : recherche de locataires, paiements, communications. Vous suivez tout à distance.",
      icon: Globe
    },
    {
      id: 6,
      title: "Messagerie Intégrée",
      description: "Communiquez directement dans la plateforme. Partagez photos, documents, dates de visite. Tout l'historique est sauvegardé.",
      icon: MessageCircle
    }
  ];

  const trustPoints = state.trustPoints.length > 0 ? state.trustPoints : [
    {
      id: 1,
      title: "Vérification Biométrique",
      description: "Selfie + scan d'identité obligatoire pour tous. Aucune exception.",
      icon: Lock
    },
    {
      id: 2,
      title: "Transparence Financière",
      description: "Vous voyez chaque transaction, chaque commission, en temps réel.",
      icon: DollarSign
    },
    {
      id: 3,
      title: "Contrats Légaux",
      description: "Tous nos contrats sont conformes aux lois guinéennes.",
      icon: FileText
    },
    {
      id: 4,
      title: "Support Client Réactif",
      description: "Une équipe dédiée pour résoudre vos problèmes rapidement.",
      icon: ShieldCheck
    }
  ];

  const trustVisualCards = state.trustVisualCards.length > 0 ? state.trustVisualCards : [
    {
      id: 1,
      number: "100%",
      label: "Vérifiés",
      icon: Lock
    },
    {
      id: 2,
      number: "24/7",
      label: "Support",
      icon: Zap
    },
    {
      id: 3,
      number: "0%",
      label: "Frais cachés",
      icon: DollarSign
    },
    {
      id: 4,
      number: "Real-time",
      label: "Analytics",
      icon: BarChart3
    }
  ];

  const footerLinks = state.footerLinks.platform.length > 0 ? state.footerLinks : {
    platform: [
      { id: 1, text: "Rechercher", href: "#" },
      { id: 2, text: "À Louer", href: "#" },
      { id: 3, text: "À Vendre", href: "#" },
      { id: 4, text: "Comment ça marche", href: "#" }
    ],
    company: [
      { id: 1, text: "À propos", href: "#" },
      { id: 2, text: "Tarifs", href: "#" },
      { id: 3, text: "Carrières", href: "#" },
      { id: 4, text: "Blog", href: "#" }
    ],
    support: [
      { id: 1, text: "Centre d'aide", href: "#" },
      { id: 2, text: "Contact", href: "#" },
      { id: 3, text: "CGU", href: "#" },
      { id: 4, text: "Confidentialité", href: "#" }
    ]
  };

  // États pour le formulaire de recherche
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: 'all',
    budget: 'all'
  });

  // État pour les onglets de recherche
  const [activeTab, setActiveTab] = useState('rent');

  // État pour les données de statistiques
  const stats = state.stats.length > 0 ? state.stats : [
    { id: 1, number: "2,500+", label: "Biens disponibles" },
    { id: 2, number: "850+", label: "Agents vérifiés" },
    { id: 3, number: "100%", label: "Sécurisé KYC" }
  ];

  // Fonction pour gérer les changements dans le formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recherche soumise:', searchData);
  };

  return (
    <div className={styles.homePage}>
      {/* NAVIGATION */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <a href="/" className={styles.logo}>
            <span className={styles.logoIcon}>{/* A venir */}</span>
            <span>ImmoGuinée</span>
          </a>
          <ul className={styles.navLinks}>
            <li><a href="#" className={styles.navLink}>Rechercher</a></li>
            <li><a href="#" className={styles.navLink}>À Louer</a></li>
            <li><a href="#" className={styles.navLink}>À Vendre</a></li>
            <li><a href="#" className={styles.navLink}>Comment ça marche</a></li>
          </ul>
          <div className={styles.navCta}>
            {user ? (
              <UserProfileMenu />
            ) : (
              <>
                <Link to="/auth" className={`${styles.btn} ${styles.btnOutline}`}>
                  Connexion
                </Link>
                <Link to="/auth" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Inscription Gratuite
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <Check className={styles.checkIcon} /> Plateforme 100% sécurisée et vérifiée
            </div>
            <h1 className={styles.heroTitle}>
              Trouvez la <span className={styles.highlight}>maison parfaite</span> en Guinée
            </h1>
            <p className={styles.heroDescription}>
              La première plateforme immobilière de confiance en Guinée. Des milliers de biens vérifiés, 
              des paiements sécurisés, et une transparence totale pour locataires, propriétaires et agents.
            </p>
            <div className={styles.heroCta}>
              <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
                Commencer Maintenant
                <ArrowRight className={styles.arrowIcon} />
              </button>
              <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnLg}`}>
                Voir les Biens
              </button>
            </div>

            <div className={styles.heroStats}>
              {stats.map(stat => (
                <div key={stat.id} className={styles.stat}>
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroImage}>
            <div className={styles.heroImageMain}>
              {/* Photo 1 - Grande à gauche */}
              <div className={`${styles.heroPhoto} ${styles.heroPhoto1}`}>
                <div className={styles.heroPhotoOverlay}>
                  <div className={styles.heroPhotoOverlayIcon}>{/* A venir si utile */}</div>
                  <div className={styles.heroPhotoOverlayText}>Villas Modernes</div>
                </div>
                <div className={`${styles.heroPhotoGlass} ${styles.glass1}`}>2.5M GNF/mois</div>
              </div>
              
              {/* Photo 2 - Petite en haut à droite */}
              <div className={`${styles.heroPhoto} ${styles.heroPhoto2}`}>
                <div className={styles.heroPhotoOverlay}>
                  <div className={styles.heroPhotoOverlayIcon}>{/* A venir si utile */}</div>
                  <div className={styles.heroPhotoOverlayText}>Appartements</div>
                </div>
              </div>
              
              {/* Photo 3 - Petite en bas à droite */}
              <div className={`${styles.heroPhoto} ${styles.heroPhoto3}`}>
                <div className={styles.heroPhotoOverlay}>
                  <div className={styles.heroPhotoOverlayIcon}>{/* A venir si utile */}</div>
                  <div className={styles.heroPhotoOverlayText}>Studios</div>
                </div>
                <div className={`${styles.heroPhotoGlass} ${styles.glass2}`}>
                  <Check className={styles.checkIcon} /> Vérifié KYC
                </div>
              </div>
            </div>
            
            {/* Floating cards */}
            <div className={`${styles.floatingCard} ${styles.floatingCard1}`}>
              <div className={styles.cardIcon}>
                <Check className={styles.checkIcon} />
              </div>
              <div className={styles.cardTitle}>Vérification KYC</div>
              <div className={styles.cardText}>Tous nos utilisateurs sont vérifiés</div>
            </div>
            <div className={`${styles.floatingCard} ${styles.floatingCard2}`}>
              <div className={styles.cardIcon}>
                <CreditCard className={styles.creditCardIcon} />
              </div>
              <div className={styles.cardTitle}>Paiements Automatiques</div>
              <div className={styles.cardText}>Loyers prélevés chaque mois</div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchCard}>
            <div className={styles.searchTabs}>
              <button
                className={`${styles.searchTab} ${activeTab === 'rent' ? styles.active : ''}`}
                onClick={() => setActiveTab('rent')}
              >
                À Louer
              </button>
              <button
                className={`${styles.searchTab} ${activeTab === 'buy' ? styles.active : ''}`}
                onClick={() => setActiveTab('buy')}
              >
                À Vendre
              </button>
            </div>
            <form className={styles.searchForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Localisation</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Ex: Kaloum, Conakry"
                  name="location"
                  value={searchData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Type de bien</label>
                <select
                  className={styles.formSelect}
                  name="propertyType"
                  value={searchData.propertyType}
                  onChange={handleInputChange}
                >
                  <option value="all">Tous les types</option>
                  <option value="house">Maison</option>
                  <option value="apartment">Appartement</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Budget max</label>
                <select
                  className={styles.formSelect}
                  name="budget"
                  value={searchData.budget}
                  onChange={handleInputChange}
                >
                  <option value="all">Tous les prix</option>
                  <option value="under_1m">Moins de 1M GNF</option>
                  <option value="1m_to_3m">1M - 3M GNF</option>
                  <option value="3m_to_5m">3M - 5M GNF</option>
                  <option value="over_5m">Plus de 5M GNF</option>
                </select>
              </div>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
                <Search className={styles.searchIcon} /> Rechercher
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Pourquoi nous choisir</span>
            <h2 className={styles.sectionTitle}>Une plateforme pensée pour vous</h2>
            <p className={styles.sectionDescription}>
              Nous avons créé la première plateforme immobilière qui résout vraiment les problèmes 
              des Guinéens, avec transparence et sécurité au cœur de tout.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map(feature => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.id} className={styles.featureCard}>
                  <div className={styles.featureIconBox}>
                    <IconComponent className={styles.icon} />
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROPERTIES SHOWCASE - Style SearchProperty */}
      <section className={styles.properties}>
        <div className={styles.propertiesContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Biens en vedette</span>
            <h2 className={styles.sectionTitle}>Découvrez nos meilleures offres</h2>
            <p className={styles.sectionDescription}>
              Des propriétés vérifiées dans toute la Guinée, des agents de confiance, 
              et des prix transparents.
            </p>
          </div>

          <div className={styles.propertiesGrid}>
            {propertiesWithFavorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
            <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
              Voir Tous les Biens
              <ArrowRight className={styles.arrowIcon} />
            </button>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className={styles.trust}>
        <div className={styles.trustContainer}>
          <div className={styles.trustContent}>
            <h2>La confiance avant tout</h2>
            <p>
              Nous avons construit cette plateforme avec un seul objectif : créer un environnement 
              où locataires, propriétaires et agents peuvent faire confiance.
            </p>

            <div className={styles.trustPoints}>
              {trustPoints.map(point => {
                const IconComponent = point.icon;
                return (
                  <div key={point.id} className={styles.trustPoint}>
                    <span className={styles.trustPointIcon}>
                      <IconComponent className={styles.icon} />
                    </span>
                    <div className={styles.trustPointText}>
                      <h4>{point.title}</h4>
                      <p>{point.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.trustVisual}>
            <div className={styles.trustVisualGrid}>
              {trustVisualCards.map(card => {
                const IconComponent = card.icon;
                return (
                  <div key={card.id} className={`${styles.trustVisualCard} ${styles[`trustCard${card.id}`]}`}>
                    <div className={styles.trustVisualIcon}>
                      <IconComponent className={styles.icon} />
                    </div>
                    <div className={styles.trustVisualNumber}>{card.number}</div>
                    <div className={styles.trustVisualLabel}>{card.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <h2>Prêt à trouver votre prochaine maison ?</h2>
          <p>
            Rejoignez les milliers de Guinéens qui ont déjà trouvé leur bonheur sur notre plateforme.
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/auth" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
              Créer un Compte Gratuit
              <ArrowRight className={styles.arrowIcon} />
            </Link>
            <Link to="/auth" className={`${styles.btn} ${styles.btnOutline} ${styles.btnLg}`}>
              Publier un Bien
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <h3>🏠 ImmoGuinée</h3>
              <p>
                La première plateforme immobilière de confiance en Guinée. 
                Créée avec excellence et intention.
              </p>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>
                  <Facebook className={styles.facebookIcon} />
                </a>
                <a href="#" className={styles.socialLink}>
                  <Twitter className={styles.twitterIcon} />
                </a>
                <a href="#" className={styles.socialLink}>
                  <Linkedin className={styles.linkedinIcon} />
                </a>
                <a href="#" className={styles.socialLink}>
                  <Instagram className={styles.instagramIcon} />
                </a>
              </div>
            </div>

            <div className={styles.footerColumn}>
              <h4>Plateforme</h4>
              <ul className={styles.footerLinks}>
                {footerLinks.platform.map(link => (
                  <li key={link.id}><a href={link.href}>{link.text}</a></li>
                ))}
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4>Entreprise</h4>
              <ul className={styles.footerLinks}>
                {footerLinks.company.map(link => (
                  <li key={link.id}><a href={link.href}>{link.text}</a></li>
                ))}
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4>Support</h4>
              <ul className={styles.footerLinks}>
                {footerLinks.support.map(link => (
                  <li key={link.id}><a href={link.href}>{link.text}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© 2026 ImmoGuinée. Tous droits réservés. Conçu avec excellence • Bi idhnillah</p>
            <p>Conakry, Guinée</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;