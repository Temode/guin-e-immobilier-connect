import { useState, useRef } from 'react';
import styles from './PropertyForm.module.css';
import {
  createProperty,
  updateProperty,
  uploadPropertyImage,
  guineaCities,
  propertyTypes,
  transactionTypes,
  amenitiesList,
  type PropertyData,
} from '@/services/propertyService';

interface PropertyFormProps {
  onClose: () => void;
  onSaved: () => void;
  editProperty?: PropertyData | null;
}

const PropertyForm = ({ onClose, onSaved, editProperty }: PropertyFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: editProperty?.title || '',
    description: editProperty?.description || '',
    type: editProperty?.type || 'appartement',
    transaction_type: editProperty?.transaction_type || 'location',
    price: editProperty?.price?.toString() || '',
    currency: editProperty?.currency || 'GNF',
    city: editProperty?.city || 'Conakry',
    commune: editProperty?.commune || '',
    quartier: editProperty?.quartier || '',
    address: editProperty?.address || '',
    bedrooms: editProperty?.bedrooms?.toString() || '',
    bathrooms: editProperty?.bathrooms?.toString() || '',
    area: editProperty?.area?.toString() || '',
    furnished: editProperty?.furnished || false,
    amenities: (editProperty?.amenities as string[]) || [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>(
    (editProperty?.images as string[]) || []
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = 10 - imagePreviews.length;
    const newFiles = Array.from(files).slice(0, remaining);

    newFiles.forEach((file) => {
      // Compress: skip files > 2MB raw, we'll handle on upload
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
      setImageFiles((prev) => [...prev, file]);
    });

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    // Only remove from files if it's a new upload (not existing URL)
    const existingCount = (editProperty?.images as string[])?.length || 0;
    if (index >= existingCount) {
      setImageFiles((prev) => prev.filter((_, i) => i !== index - existingCount));
    }
  };

  const [savingLabel, setSavingLabel] = useState('');

  const handleSubmit = async (asDraft: boolean) => {
    if (saving) return; // Prevent double submission
    setError('');
    if (!form.title.trim()) return setError('Le titre est requis');
    if (!form.price || Number(form.price) <= 0) return setError('Le prix est requis');
    if (!form.city) return setError('La ville est requise');

    setSaving(true);
    setSavingLabel(asDraft ? 'Enregistrement du brouillon…' : 'Création du bien…');
    try {
      // Prepare property data
      const propertyPayload: any = {
        title: form.title,
        description: form.description || null,
        type: form.type,
        transaction_type: form.transaction_type,
        price: Number(form.price),
        currency: form.currency,
        city: form.city,
        commune: form.commune || null,
        quartier: form.quartier || null,
        address: form.address || null,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        area: form.area ? Number(form.area) : null,
        furnished: form.furnished,
        amenities: form.amenities,
        status: asDraft ? 'draft' : 'available',
        published_at: asDraft ? null : new Date().toISOString(),
      };

      let savedProperty: any;

      if (editProperty?.id) {
        const { data, error: updateErr } = await updateProperty(editProperty.id, propertyPayload);
        if (updateErr) throw updateErr;
        savedProperty = data;
      } else {
        const { data, error: createErr } = await createProperty(propertyPayload);
        if (createErr) throw createErr;
        savedProperty = data;
      }

      // Upload new images
      if (imageFiles.length > 0 && savedProperty) {
        setSavingLabel('Upload des images…');
        const existingImages = (editProperty?.images as string[]) || [];
        const uploadedUrls: string[] = [...existingImages];

        // Upload all images concurrently for speed
        const uploadPromises = imageFiles.map(async (file) => {
          try {
            const { data: url, error: uploadErr } = await uploadPropertyImage(file, savedProperty.id);
            if (uploadErr) {
              console.error('Image upload error:', uploadErr);
              return null;
            }
            return url;
          } catch {
            return null;
          }
        });

        const results = await Promise.all(uploadPromises);
        results.forEach((url) => { if (url) uploadedUrls.push(url); });

        setSavingLabel('Finalisation…');
        await updateProperty(savedProperty.id, { images: uploadedUrls });
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
      setSavingLabel('');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{editProperty ? 'Modifier le bien' : 'Ajouter un bien'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {/* Informations générales */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Informations générales</div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label>Titre *</label>
              <input
                type="text"
                placeholder="Ex: Bel appartement F3 lumineux"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Type de bien *</label>
                <select value={form.type} onChange={(e) => handleChange('type', e.target.value)}>
                  {propertyTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Type de transaction *</label>
                <select value={form.transaction_type} onChange={(e) => handleChange('transaction_type', e.target.value)}>
                  {transactionTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Prix *</label>
                <input
                  type="number"
                  placeholder="Ex: 2500000"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label>Devise</label>
                <select value={form.currency} onChange={(e) => handleChange('currency', e.target.value)}>
                  <option value="GNF">GNF (Franc Guinéen)</option>
                  <option value="USD">USD (Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label>Description</label>
              <textarea
                placeholder="Décrivez le bien en détail..."
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
          </div>

          {/* Localisation */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Localisation</div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Ville *</label>
                <select value={form.city} onChange={(e) => handleChange('city', e.target.value)}>
                  {guineaCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Commune</label>
                <input
                  type="text"
                  placeholder="Ex: Ratoma"
                  value={form.commune}
                  onChange={(e) => handleChange('commune', e.target.value)}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Quartier</label>
                <input
                  type="text"
                  placeholder="Ex: Kipé"
                  value={form.quartier}
                  onChange={(e) => handleChange('quartier', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label>Adresse</label>
                <input
                  type="text"
                  placeholder="Adresse complète"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Caractéristiques */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Caractéristiques</div>
            <div className={styles.row3}>
              <div className={styles.field}>
                <label>Chambres</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.bedrooms}
                  onChange={(e) => handleChange('bedrooms', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label>Salles de bain</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.bathrooms}
                  onChange={(e) => handleChange('bathrooms', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label>Surface (m²)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.area}
                  onChange={(e) => handleChange('area', e.target.value)}
                />
              </div>
            </div>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="furnished"
                checked={form.furnished}
                onChange={(e) => handleChange('furnished', e.target.checked)}
              />
              <label htmlFor="furnished">Meublé</label>
            </div>
          </div>

          {/* Équipements */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Équipements</div>
            <div className={styles.amenitiesGrid}>
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  className={`${styles.amenityChip} ${form.amenities.includes(amenity) ? styles.selected : ''}`}
                  onClick={() => toggleAmenity(amenity)}
                >
                  {form.amenities.includes(amenity) ? '✓' : '+'} {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Photos (max 10)</div>
            <div className={styles.imageUpload}>
              {imagePreviews.map((src, i) => (
                <div key={i} className={styles.imagePreview}>
                  <img src={src} alt={`Photo ${i + 1}`} />
                  <button className={styles.imageRemoveBtn} onClick={() => removeImage(i)}>×</button>
                </div>
              ))}
              {imagePreviews.length < 10 && (
                <button
                  type="button"
                  className={styles.imageAddBtn}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleImageAdd}
              />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        {saving && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '12px 16px', background: 'var(--color-primary-50, #F0FDF4)',
            borderRadius: '8px', margin: '0 0 8px',
            fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-primary-700, #065F46)',
          }}>
            <svg style={{ animation: 'spin 1s linear infinite', width: 18, height: 18 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {savingLabel}
          </div>
        )}

        <div className={styles.footer}>
          <button
            className={styles.btnDraft}
            disabled={saving}
            onClick={() => handleSubmit(true)}
          >
            Brouillon
          </button>
          <button
            className={styles.btnPublish}
            disabled={saving}
            onClick={() => handleSubmit(false)}
          >
            Publier
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
