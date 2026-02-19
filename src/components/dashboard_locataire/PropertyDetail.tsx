// @ts-nocheck
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './PropertyDetail.module.css';

/* ==========================================
   ICONS COMPONENTS
========================================== */
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const StarEmptyIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const VerifiedBadgeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ExpandIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const AcIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ParkingIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const BoltIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const FurnishedIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TerraceIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const HeartIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  filled ? (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  ) : (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
);

const ShareIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

/* ==========================================
   TYPES
========================================== */
interface PropertyFeature {
  type: string;
  label: string;
}

interface PropertyBadge {
  type: string;
  label: string;
}

interface PropertyAgent {
  id: string;
  name: string;
  initials: string;
  verified: boolean;
  rating: number;
  reviews: number;
}

interface Property {
  id: string;
  image: string;
  title: string;
  price: number;
  location: string;
  photosCount: number;
  description: string;
  features: PropertyFeature[];
  agent: PropertyAgent;
  badges: PropertyBadge[];
}

/* ==========================================
   MOCK DATA
========================================== */
const mockProperties: Record<string, Property> = {
  '1': {
    id: '1',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    title: 'Bel appartement F3 avec vue panoramique',
    price: 2500000,
    location: 'Kip\u00e9, Ratoma',
    photosCount: 12,
    description: "Magnifique appartement de 3 pi\u00e8ces situ\u00e9 au c\u0153ur de Kip\u00e9, dans le quartier r\u00e9sidentiel de Ratoma. Cet appartement lumineux offre une vue panoramique exceptionnelle sur la ville. Enti\u00e8rement r\u00e9nov\u00e9 avec des mat\u00e9riaux de qualit\u00e9, il dispose d'un grand s\u00e9jour, de deux chambres spacieuses, d'une cuisine \u00e9quip\u00e9e et d'une salle de bain moderne. La climatisation est install\u00e9e dans toutes les pi\u00e8ces. L'immeuble b\u00e9n\u00e9ficie d'un gardien 24h/24, d'un parking s\u00e9curis\u00e9 et d'un groupe \u00e9lectrog\u00e8ne. Proximit\u00e9 imm\u00e9diate des commerces, \u00e9coles et transports en commun.",
    features: [
      { type: 'rooms', label: '3 pi\u00e8ces' },
      { type: 'area', label: '85 m\u00b2' },
      { type: 'ac', label: 'Climatis\u00e9' },
      { type: 'parking', label: 'Parking' },
    ],
    agent: { id: 'agent-1', name: 'Abdoulaye Diallo', initials: 'AD', verified: true, rating: 4.8, reviews: 47 },
    badges: [{ type: 'premium', label: 'Premium' }],
  },
  '2': {
    id: '2',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
    title: 'Appartement F2 moderne et lumineux',
    price: 1800000,
    location: 'Nongo, Ratoma',
    photosCount: 8,
    description: "Bel appartement F2 enti\u00e8rement r\u00e9nov\u00e9 dans un immeuble s\u00e9curis\u00e9 \u00e0 Nongo. L'appartement comprend un s\u00e9jour spacieux, une chambre avec placard int\u00e9gr\u00e9, une cuisine am\u00e9nag\u00e9e et une salle d'eau. Le groupe \u00e9lectrog\u00e8ne assure une alimentation continue en \u00e9lectricit\u00e9. Quartier calme et r\u00e9sidentiel, \u00e0 proximit\u00e9 des principaux axes routiers.",
    features: [
      { type: 'rooms', label: '2 pi\u00e8ces' },
      { type: 'area', label: '60 m\u00b2' },
      { type: 'generator', label: 'Groupe \u00e9lec.' },
      { type: 'parking', label: 'Parking' },
    ],
    agent: { id: 'agent-2', name: 'Fatoumata Kamara', initials: 'FK', verified: true, rating: 4.6, reviews: 32 },
    badges: [{ type: 'new', label: 'Nouveau' }],
  },
  '3': {
    id: '3',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
    title: 'Villa F4 avec jardin et parking',
    price: 3000000,
    location: 'Lambanyi, Ratoma',
    photosCount: 15,
    description: "Superbe villa de 4 pi\u00e8ces avec un magnifique jardin arbor\u00e9 \u00e0 Lambanyi. Cette propri\u00e9t\u00e9 dispose d'un grand salon, de trois chambres, d'une cuisine \u00e9quip\u00e9e, de deux salles de bain et d'un parking priv\u00e9 pour deux v\u00e9hicules. Le jardin offre un espace de d\u00e9tente agr\u00e9able. S\u00e9curit\u00e9 assur\u00e9e par un gardien et un syst\u00e8me de vid\u00e9osurveillance.",
    features: [
      { type: 'rooms', label: '4 pi\u00e8ces' },
      { type: 'area', label: '120 m\u00b2' },
      { type: 'parking', label: 'Parking' },
      { type: 'terrace', label: 'Jardin' },
    ],
    agent: { id: 'agent-3', name: 'Ibrahima Barry', initials: 'IB', verified: true, rating: 4.9, reviews: 63 },
    badges: [{ type: 'verified', label: 'V\u00e9rifi\u00e9' }],
  },
  '4': {
    id: '4',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
    title: 'Studio meubl\u00e9 tout \u00e9quip\u00e9',
    price: 1200000,
    location: 'Cosa, Ratoma',
    photosCount: 6,
    description: "Studio enti\u00e8rement meubl\u00e9 et \u00e9quip\u00e9, id\u00e9al pour une personne seule ou un jeune couple. Comprend une pi\u00e8ce principale avec coin salon et coin nuit, une kitchenette \u00e9quip\u00e9e et une salle d'eau. Meubles modernes et \u00e9lectrom\u00e9nager inclus. Situ\u00e9 dans un quartier dynamique de Cosa avec acc\u00e8s facile aux transports.",
    features: [
      { type: 'rooms', label: '1 pi\u00e8ce' },
      { type: 'area', label: '30 m\u00b2' },
      { type: 'furnished', label: 'Meubl\u00e9' },
      { type: 'ac', label: 'Climatis\u00e9' },
    ],
    agent: { id: 'agent-4', name: 'Mariama Sylla', initials: 'MS', verified: true, rating: 4.5, reviews: 21 },
    badges: [],
  },
  '5': {
    id: '5',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
    title: 'Appartement F3 de standing avec terrasse',
    price: 2800000,
    location: 'Taouyah, Ratoma',
    photosCount: 18,
    description: "Appartement haut de gamme de 3 pi\u00e8ces avec une grande terrasse offrant une vue imprenable. Finitions de standing, cuisine am\u00e9ricaine \u00e9quip\u00e9e, deux chambres avec salle de bain priv\u00e9e, grand salon lumineux. L'immeuble dispose d'un ascenseur, d'un parking souterrain et d'un espace fitness. Quartier prestigieux de Taouyah.",
    features: [
      { type: 'rooms', label: '3 pi\u00e8ces' },
      { type: 'area', label: '95 m\u00b2' },
      { type: 'terrace', label: 'Terrasse' },
      { type: 'ac', label: 'Climatis\u00e9' },
    ],
    agent: { id: 'agent-1', name: 'Abdoulaye Diallo', initials: 'AD', verified: true, rating: 4.8, reviews: 47 },
    badges: [
      { type: 'new', label: 'Nouveau' },
      { type: 'premium', label: 'Premium' },
    ],
  },
  '6': {
    id: '6',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
    title: 'Appartement F2 r\u00e9nov\u00e9 avec balcon',
    price: 1500000,
    location: 'Koloma, Ratoma',
    photosCount: 10,
    description: "Charmant appartement F2 r\u00e9cemment r\u00e9nov\u00e9, situ\u00e9 au 3\u00e8me \u00e9tage avec balcon. L'appartement offre un s\u00e9jour confortable, une chambre avec rangements, une cuisine fonctionnelle et une salle de bain carrel\u00e9e. Le balcon permet de profiter de la lumi\u00e8re naturelle et de l'air frais. Quartier calme de Koloma, proche des commodit\u00e9s.",
    features: [
      { type: 'rooms', label: '2 pi\u00e8ces' },
      { type: 'area', label: '55 m\u00b2' },
      { type: 'terrace', label: 'Balcon' },
      { type: 'generator', label: 'Groupe \u00e9lec.' },
    ],
    agent: { id: 'agent-5', name: 'Oumar Camara', initials: 'OC', verified: true, rating: 4.4, reviews: 18 },
    badges: [],
  },
};

/* ==========================================
   FEATURE ICON MAP
========================================== */
const featureIcons: Record<string, React.FC<{ className?: string }>> = {
  rooms: HomeIcon,
  area: ExpandIcon,
  ac: AcIcon,
  generator: BoltIcon,
  parking: ParkingIcon,
  furnished: FurnishedIcon,
  terrace: TerraceIcon,
  balcony: TerraceIcon,
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Get property from location state or fallback to mock data
  const locationState = location.state as Property | null;
  const property: Property | undefined = locationState || (id ? mockProperties[id] : undefined);

  if (!property) {
    return (
      <div className={styles.notFound}>
        <h2>Bien introuvable</h2>
        <p>Le bien que vous recherchez n'existe pas ou a \u00e9t\u00e9 retir\u00e9.</p>
        <button
          className={styles.backBtnLarge}
          onClick={() => navigate('/dashboard-locataire/recherche')}
        >
          <ArrowLeftIcon />
          Retourner \u00e0 la recherche
        </button>
      </div>
    );
  }

  // Generate thumbnail images (simulated gallery from the single image)
  const galleryImages = [
    property.image,
    property.image.replace('w=600', 'w=601'),
    property.image.replace('w=600', 'w=602'),
    property.image.replace('w=600', 'w=603'),
    property.image.replace('w=600', 'w=604'),
  ];

  const handleContactAgent = () => {
    navigate('/dashboard-locataire/messages', {
      state: {
        agentId: property.agent.id,
        agentName: property.agent.name,
        agentInitials: property.agent.initials,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location,
        propertyPrice: property.price,
      },
    });
  };

  const handleGoBack = () => {
    navigate('/dashboard-locataire/recherche');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} className={styles.starFilled} />);
      } else {
        stars.push(<StarEmptyIcon key={i} className={styles.starEmpty} />);
      }
    }
    return stars;
  };

  return (
    <div className={styles.propertyDetailPage}>
      {/* Back Button */}
      <button className={styles.backBtn} onClick={handleGoBack}>
        <ArrowLeftIcon />
        Retour aux r\u00e9sultats
      </button>

      {/* Main Content Layout */}
      <div className={styles.contentLayout}>
        {/* Left Column - Property Details */}
        <div className={styles.mainColumn}>
          {/* Image Gallery Section */}
          <section className={styles.gallerySection}>
            <div className={styles.mainImageWrapper}>
              <img
                src={galleryImages[selectedImageIndex]}
                alt={property.title}
                className={styles.mainImage}
              />
              {property.badges && property.badges.length > 0 && (
                <div className={styles.imageBadges}>
                  {property.badges.map((badge, index) => (
                    <span key={index} className={`${styles.badge} ${styles[badge.type]}`}>
                      {badge.type === 'premium' && <StarIcon />}
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}
              <div className={styles.imageActions}>
                <button
                  className={`${styles.imageActionBtn} ${isFavorite ? styles.favoriteActive : ''}`}
                  onClick={() => setIsFavorite(!isFavorite)}
                  title="Ajouter aux favoris"
                >
                  <HeartIcon filled={isFavorite} />
                </button>
                <button className={styles.imageActionBtn} title="Partager">
                  <ShareIcon />
                </button>
              </div>
              <span className={styles.photoCount}>
                <ImageIcon />
                {property.photosCount} photos
              </span>
              {/* Navigation arrows */}
              <button
                className={`${styles.galleryNav} ${styles.galleryNavPrev}`}
                onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
              >
                <ChevronLeftIcon />
              </button>
              <button
                className={`${styles.galleryNav} ${styles.galleryNavNext}`}
                onClick={() => setSelectedImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
              >
                <ChevronRightIcon />
              </button>
            </div>
            <div className={styles.thumbnailStrip}>
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnail} ${index === selectedImageIndex ? styles.active : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={img} alt={`Vue ${index + 1}`} />
                </button>
              ))}
            </div>
          </section>

          {/* Property Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.priceRow}>
              <p className={styles.price}>
                {property.price.toLocaleString('fr-GN')} <span>GNF/mois</span>
              </p>
            </div>
            <h1 className={styles.title}>{property.title}</h1>
            <p className={styles.location}>
              <LocationIcon />
              {property.location}
            </p>

            {/* Features Grid */}
            <div className={styles.featuresGrid}>
              {property.features.map((feature, index) => {
                const IconComponent = featureIcons[feature.type] || HomeIcon;
                return (
                  <div key={index} className={styles.featurePill}>
                    <IconComponent className={styles.featureIcon} />
                    <span>{feature.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Description Section */}
          <section className={styles.descriptionSection}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.descriptionText}>{property.description}</p>
          </section>

          {/* Map Section Placeholder */}
          <section className={styles.mapSection}>
            <h2 className={styles.sectionTitle}>Localisation</h2>
            <div className={styles.mapPlaceholder}>
              <MapPinIcon className={styles.mapPlaceholderIcon} />
              <p>{property.location}</p>
              <span>La carte interactive sera bient\u00f4t disponible</span>
            </div>
          </section>

          {/* Similar Properties Placeholder */}
          <section className={styles.similarSection}>
            <h2 className={styles.sectionTitle}>Biens similaires</h2>
            <div className={styles.similarPlaceholder}>
              <HomeIcon className={styles.similarPlaceholderIcon} />
              <p>Les biens similaires seront affich\u00e9s ici prochainement</p>
            </div>
          </section>
        </div>

        {/* Right Column - Agent Card */}
        <aside className={styles.sideColumn}>
          <div className={styles.agentCard}>
            <div className={styles.agentHeader}>
              <div className={styles.agentAvatar}>
                <span>{property.agent.initials}</span>
              </div>
              <div className={styles.agentInfo}>
                <h3 className={styles.agentName}>
                  {property.agent.name}
                  {property.agent.verified && (
                    <span className={styles.verifiedBadge}>
                      <VerifiedBadgeIcon />
                      V\u00e9rifi\u00e9
                    </span>
                  )}
                </h3>
                <p className={styles.agentRole}>Agent immobilier</p>
              </div>
            </div>

            <div className={styles.agentRating}>
              <div className={styles.starsRow}>
                {renderStars(property.agent.rating)}
              </div>
              <span className={styles.ratingValue}>{property.agent.rating}</span>
              <span className={styles.reviewCount}>({property.agent.reviews} avis)</span>
            </div>

            <div className={styles.responseTime}>
              <ClockIcon className={styles.responseTimeIcon} />
              <span>R\u00e9pond g\u00e9n\u00e9ralement en moins de 2h</span>
            </div>

            <div className={styles.agentActions}>
              <button className={styles.contactBtn} onClick={handleContactAgent}>
                <MessageIcon />
                Envoyer un message
              </button>
              <button className={styles.callBtn}>
                <PhoneIcon />
                Appeler
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PropertyDetail;
