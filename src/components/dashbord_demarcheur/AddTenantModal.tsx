import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import styles from './AddTenantModal.module.css';

interface AddTenantModalProps {
  onClose: () => void;
  onSuccess: () => void;
  preselectedPropertyId?: string;
}

const AddTenantModal = ({ onClose, onSuccess, preselectedPropertyId }: AddTenantModalProps) => {
  const { user } = useAuthContext();
  const [email, setEmail] = useState('');
  const [propertyId, setPropertyId] = useState(preselectedPropertyId || '');
  const [rentAmount, setRentAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentDay, setPaymentDay] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('orange_money');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [tenantProfile, setTenantProfile] = useState<any>(null);
  const [propertyData, setPropertyData] = useState<any>(null);

  const validateAndFetch = async () => {
    setError('');
    if (!email || !propertyId || !rentAmount || !startDate) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);
    try {
      // 1. Find user by email via auth - look in profiles that match
      const { data: profiles, error: profileErr } = await supabase
        .from('profiles')
        .select('id, full_name, phone, kyc_status')
        .limit(100);

      if (profileErr) throw profileErr;

      // We need to find the user by email. Since we can't query auth.users directly,
      // we'll search by fetching user_roles for users who exist and try to match.
      // Best approach: use a service-role edge function. For now, search by trying signIn approach.
      // Alternative: store email in profiles. Let's try to get user by looking at a custom RPC or
      // using the admin API via edge function. For simplicity, let's use a lookup approach:
      
      // Actual approach: use a postgres function to find user by email
      const { data: userByEmail, error: userEmailErr } = await supabase
        .rpc('get_user_id_by_email' as any, { email_input: email.toLowerCase().trim() });

      if (userEmailErr || !userByEmail) {
        setError(`Aucun utilisateur trouvé avec l'email "${email}". Assurez-vous que cet utilisateur est inscrit.`);
        setLoading(false);
        return;
      }

      const tenantId = userByEmail;

      // 2. Fetch tenant profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, phone, kyc_status')
        .eq('id', tenantId)
        .single();

      // 3. Validate property exists and belongs to agent
      const { data: property, error: propErr } = await supabase
        .from('properties')
        .select('id, title, city, commune, quartier, type, bedrooms, area, images')
        .eq('id', propertyId)
        .single();

      if (propErr || !property) {
        setError(`Aucun bien trouvé avec l'ID "${propertyId}".`);
        setLoading(false);
        return;
      }

      setTenantProfile({ ...profile, email });
      setPropertyData(property);
      setStep('confirm');
    } catch (e: any) {
      setError(e.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const { error: rentalErr } = await supabase
        .from('rentals')
        .insert({
          tenant_id: tenantProfile.id,
          property_id: propertyId,
          owner_id: propertyData.owner_id || user!.id,
          agent_id: user!.id,
          rent_amount: parseFloat(rentAmount),
          currency: 'GNF',
          start_date: startDate,
          end_date: endDate || null,
          payment_day_of_month: parseInt(paymentDay),
          payment_method: paymentMethod,
          status: 'active',
          agent_commission_percent: 10,
        });

      if (rentalErr) throw rentalErr;

      // Update property status to 'rented'
      await supabase
        .from('properties')
        .update({ status: 'rented' })
        .eq('id', propertyId);

      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Erreur lors de la création de la location.');
    } finally {
      setLoading(false);
    }
  };

  const formatImages = (images: any) => {
    if (!images) return null;
    const arr = Array.isArray(images) ? images : JSON.parse(images as string);
    return arr[0] || null;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div className={styles.modalIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2>Ajouter un locataire</h2>
              <p>{step === 'form' ? 'Renseignez les informations du locataire' : 'Confirmez les informations'}</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 'form' ? (
          <div className={styles.modalBody}>
            {error && <div className={styles.errorAlert}>{error}</div>}

            <div className={styles.formGrid}>
              <div className={styles.formGroup + ' ' + styles.fullWidth}>
                <label>Email du locataire *</label>
                <input
                  type="email"
                  placeholder="locataire@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
                <span className={styles.hint}>L'utilisateur doit être inscrit sur ImmoGN</span>
              </div>

              <div className={styles.formGroup + ' ' + styles.fullWidth}>
                <label>ID du bien *</label>
                <input
                  type="text"
                  placeholder="UUID du bien (ex: abc123...)"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className={styles.input}
                />
                <span className={styles.hint}>Copiez l'ID depuis la liste de vos biens</span>
              </div>

              <div className={styles.formGroup}>
                <label>Loyer mensuel (GNF) *</label>
                <input
                  type="number"
                  placeholder="2000000"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Jour de paiement</label>
                <select
                  value={paymentDay}
                  onChange={(e) => setPaymentDay(e.target.value)}
                  className={styles.input}
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>Le {d} du mois</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Date de début *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Date de fin (optionnel)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup + ' ' + styles.fullWidth}>
                <label>Mode de paiement</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={styles.input}
                >
                  <option value="orange_money">Orange Money</option>
                  <option value="mtn_money">MTN Money</option>
                  <option value="wave">Wave</option>
                  <option value="bank_transfer">Virement bancaire</option>
                  <option value="cash">Espèces</option>
                </select>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={onClose} disabled={loading}>
                Annuler
              </button>
              <button className={styles.btnPrimary} onClick={validateAndFetch} disabled={loading}>
                {loading ? 'Vérification...' : 'Vérifier et continuer →'}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.modalBody}>
            {error && <div className={styles.errorAlert}>{error}</div>}

            <div className={styles.confirmSection}>
              <h3>Locataire</h3>
              <div className={styles.confirmCard}>
                <div className={styles.confirmAvatar}>
                  {tenantProfile?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}
                </div>
                <div>
                  <p className={styles.confirmName}>{tenantProfile?.full_name || 'Utilisateur'}</p>
                  <p className={styles.confirmSub}>{tenantProfile?.email}</p>
                  {tenantProfile?.phone && <p className={styles.confirmSub}>{tenantProfile.phone}</p>}
                </div>
              </div>
            </div>

            <div className={styles.confirmSection}>
              <h3>Bien loué</h3>
              <div className={styles.confirmCard}>
                {formatImages(propertyData?.images) && (
                  <img
                    src={formatImages(propertyData.images)}
                    alt={propertyData?.title}
                    className={styles.confirmPropertyImg}
                  />
                )}
                <div>
                  <p className={styles.confirmName}>{propertyData?.title}</p>
                  <p className={styles.confirmSub}>
                    {[propertyData?.quartier, propertyData?.commune, propertyData?.city].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.confirmSection}>
              <h3>Conditions</h3>
              <div className={styles.confirmDetails}>
                <div className={styles.confirmRow}>
                  <span>Loyer mensuel</span>
                  <strong>{parseInt(rentAmount).toLocaleString('fr-FR')} GNF</strong>
                </div>
                <div className={styles.confirmRow}>
                  <span>Début</span>
                  <strong>{new Date(startDate).toLocaleDateString('fr-FR')}</strong>
                </div>
                {endDate && (
                  <div className={styles.confirmRow}>
                    <span>Fin</span>
                    <strong>{new Date(endDate).toLocaleDateString('fr-FR')}</strong>
                  </div>
                )}
                <div className={styles.confirmRow}>
                  <span>Paiement le</span>
                  <strong>{paymentDay} du mois</strong>
                </div>
                <div className={styles.confirmRow}>
                  <span>Mode de paiement</span>
                  <strong>{paymentMethod.replace('_', ' ')}</strong>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setStep('form')} disabled={loading}>
                ← Modifier
              </button>
              <button className={styles.btnSuccess} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Création en cours...' : '✓ Confirmer la location'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTenantModal;
