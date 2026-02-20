import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Share2, Heart, MapPin, BedDouble, Bath, Maximize2,
  Sofa, MessageCircle, Phone, CheckCircle, Image, ChevronLeft,
  ChevronRight, X
} from 'lucide-react';
import { getPropertyById, type PropertyData } from '@/services/propertyService';
import { supabase } from '@/integrations/supabase/client';
import { getOrCreateConversation } from '@/services/messagingService';
import styles from './PropertyDetail.module.css';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [owner, setOwner] = useState<{ full_name: string | null; phone: string | null; avatar_url: string | null; id?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showShareToast, setShowShareToast] = useState(false);
  const [contactingAgent, setContactingAgent] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const { data, error: err } = await getPropertyById(id);
      if (err || !data) {
        setError('Bien introuvable');
        setLoading(false);
        return;
      }
      setProperty(data as unknown as PropertyData);

      // Fetch owner profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone, avatar_url, id')
        .eq('id', (data as any).owner_id)
        .single();
      if (profile) setOwner(profile);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className={styles.page}><div className={styles.loading}>Chargement...</div></div>;
  if (error || !property) return (
    <div className={styles.page}>
      <div className={styles.error}>
        <h2>{error || 'Bien introuvable'}</h2>
        <button className={styles.btnPrimary} onClick={() => navigate(-1)}>Retour</button>
      </div>
    </div>
  );

  const images = (property.images as string[]) || [];
  const amenities = (property.amenities as string[]) || [];
  const formatPrice = (p: number) => p.toLocaleString('fr-FR');
  const ownerInitials = owner?.full_name
    ? owner.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleContactOwner = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      navigate('/auth');
      return;
    }
    if (!owner?.id) return;
    setContactingAgent(true);
    setContactingAgent(false);
    navigate('/dashboard-locataire/messages', { state: { agentId: owner.id } });
  };

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft /> Retour
        </button>
        <div className={styles.topActions}>
          <button className={styles.iconBtn} onClick={handleShare} title="Partager">
            <Share2 />
          </button>
          <button className={styles.iconBtn} title="Favoris">
            <Heart />
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className={styles.gallery}>
        {images.length > 0 ? (
          <div className={styles.galleryGrid}>
            <div className={styles.galleryMain} onClick={() => openLightbox(0)}>
              <img src={images[0]} alt={property.title} />
            </div>
            <div className={styles.gallerySide}>
              {images.slice(1, 3).map((img, i) => (
                <div key={i} onClick={() => openLightbox(i + 1)}>
                  <img src={img} alt={`Photo ${i + 2}`} />
                  {i === 1 && images.length > 3 && (
                    <div className={styles.galleryOverlay} onClick={(e) => { e.stopPropagation(); openLightbox(3); }}>
                      <Image /> +{images.length - 3} photos
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.noImages}>
            <Image />
            <span>Aucune photo disponible</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.mainInfo}>
          {/* Badges */}
          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles.badgeType}`}>{property.type}</span>
            <span className={`${styles.badge} ${styles.badgeTransaction}`}>
              {property.transaction_type === 'location' ? 'Location' : 'Vente'}
            </span>
            {property.furnished && <span className={`${styles.badge} ${styles.badgeFurnished}`}>Meublé</span>}
            <span className={`${styles.badge} ${styles.badgeStatus}`}>{property.status}</span>
          </div>

          {/* Title & Price */}
          <h1 className={styles.title}>{property.title}</h1>
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(property.price)}</span>
            <span className={styles.currency}>{property.currency || 'GNF'}</span>
            {property.transaction_type === 'location' && <span className={styles.perMonth}>/mois</span>}
          </div>

          {/* Location */}
          <div className={styles.location}>
            <MapPin />
            {[property.quartier, property.commune, property.city].filter(Boolean).join(', ')}
          </div>

          {/* Description */}
          {property.description && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Description</h2>
              <p className={styles.description}>{property.description}</p>
            </div>
          )}

          {/* Characteristics */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Caractéristiques</h2>
            <div className={styles.characteristics}>
              {property.bedrooms != null && (
                <div className={styles.charItem}>
                  <div className={styles.charIcon}><BedDouble /></div>
                  <div>
                    <div className={styles.charLabel}>Chambres</div>
                    <div className={styles.charValue}>{property.bedrooms}</div>
                  </div>
                </div>
              )}
              {property.bathrooms != null && (
                <div className={styles.charItem}>
                  <div className={styles.charIcon}><Bath /></div>
                  <div>
                    <div className={styles.charLabel}>Salles de bain</div>
                    <div className={styles.charValue}>{property.bathrooms}</div>
                  </div>
                </div>
              )}
              {property.area != null && (
                <div className={styles.charItem}>
                  <div className={styles.charIcon}><Maximize2 /></div>
                  <div>
                    <div className={styles.charLabel}>Surface</div>
                    <div className={styles.charValue}>{property.area} m²</div>
                  </div>
                </div>
              )}
              {property.furnished && (
                <div className={styles.charItem}>
                  <div className={styles.charIcon}><Sofa /></div>
                  <div>
                    <div className={styles.charLabel}>Ameublement</div>
                    <div className={styles.charValue}>Meublé</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Équipements</h2>
              <div className={styles.amenities}>
                {amenities.map((a, i) => (
                  <span key={i} className={styles.amenityBadge}>
                    <CheckCircle /> {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Agent card */}
          <div className={styles.agentCard}>
            <div className={styles.agentAvatar}>{ownerInitials}</div>
            <div className={styles.agentName}>{owner?.full_name || 'Propriétaire'}</div>
            <div className={styles.agentVerified}>
              <CheckCircle /> Vérifié
            </div>
            <div className={styles.agentActions}>
              <button className={styles.btnPrimary} onClick={handleContactOwner} disabled={contactingAgent}>
                <MessageCircle /> {contactingAgent ? 'Ouverture...' : 'Contacter'}
              </button>
              {owner?.phone && (
                <button className={styles.btnOutline} onClick={() => window.open(`tel:${owner.phone}`)}>
                  <Phone /> Appeler
                </button>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className={styles.quickInfo}>
            <h3 className={styles.sectionTitle}>Informations</h3>
            <div className={styles.quickInfoList}>
              <div className={styles.quickInfoItem}>
                <span className={styles.quickInfoLabel}>Type</span>
                <span className={styles.quickInfoValue}>{property.type}</span>
              </div>
              <div className={styles.quickInfoItem}>
                <span className={styles.quickInfoLabel}>Transaction</span>
                <span className={styles.quickInfoValue}>{property.transaction_type === 'location' ? 'Location' : 'Vente'}</span>
              </div>
              <div className={styles.quickInfoItem}>
                <span className={styles.quickInfoLabel}>Ville</span>
                <span className={styles.quickInfoValue}>{property.city}</span>
              </div>
              {property.commune && (
                <div className={styles.quickInfoItem}>
                  <span className={styles.quickInfoLabel}>Commune</span>
                  <span className={styles.quickInfoValue}>{property.commune}</span>
                </div>
              )}
              {property.created_at && (
                <div className={styles.quickInfoItem}>
                  <span className={styles.quickInfoLabel}>Publié le</span>
                  <span className={styles.quickInfoValue}>
                    {new Date(property.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div className={styles.lightbox} onClick={() => setLightboxOpen(false)}>
          <button className={styles.lightboxClose} onClick={() => setLightboxOpen(false)}>
            <X />
          </button>
          <img
            className={styles.lightboxImg}
            src={images[lightboxIndex]}
            alt={`Photo ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + images.length) % images.length); }}
              >
                <ChevronLeft />
              </button>
              <button
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % images.length); }}
              >
                <ChevronRight />
              </button>
              <div className={styles.lightboxCounter}>
                {lightboxIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Share toast */}
      {showShareToast && (
        <div className={styles.shareToast}>Lien copié dans le presse-papier !</div>
      )}
    </div>
  );
};

export default PropertyDetail;
