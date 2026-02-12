import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Search, Home, Key, Briefcase } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import styles from './UserRoleSelection.module.css';

const UserRoleSelection: React.FC = () => {
  const { user, loading, updateUserRole, getDashboardByRole } = useAuthContext();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('looking');
  const [submitting, setSubmitting] = useState(false);

  const roles = [
    { id: 'looking', title: 'Je cherche une maison', description: 'Trouver un logement à louer ou acheter', icon: Search },
    { id: 'currentTenant', title: 'Je suis déjà locataire', description: 'Gérer mon logement actuel', icon: Home },
    { id: 'owner', title: 'Je suis propriétaire', description: 'Louer ou vendre mes biens immobiliers', icon: Key },
    { id: 'agent', title: 'Agent immobilier', description: 'Gérer les biens pour les clients', icon: Briefcase }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user already has a role, redirect to the correct dashboard
  const existingRole = user.user_metadata?.role;
  if (existingRole) {
    return <Navigate to={getDashboardByRole(existingRole)} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || submitting) return;

    setSubmitting(true);
    const { error } = await updateUserRole(selectedRole);

    if (error) {
      alert('Erreur lors de la sauvegarde du rôle. Veuillez réessayer.');
      setSubmitting(false);
      return;
    }

    navigate(getDashboardByRole(selectedRole));
  };

  return (
    <div className={styles.roleSelectionPage}>
      <div className={styles.roleSelectionContainer}>
        <div className={styles.logo}>
          <Link to="/">🏠 ImmoGuinée</Link>
        </div>

        <div className={styles.content}>
          <h1>Bienvenue sur ImmoGuinée !</h1>
          <p className={styles.subtitle}>Commençons par comprendre votre profil utilisateur</p>

          <form onSubmit={handleSubmit} className={styles.roleForm}>
            <div className={styles.roleOptions}>
              {roles.map((role) => {
                const IconComponent = role.icon;
                return (
                  <div
                    key={role.id}
                    className={`${styles.roleOption} ${selectedRole === role.id ? styles.selected : ''}`}
                    onClick={() => handleRoleChange(role.id)}
                  >
                    <div className={styles.roleIcon}>
                      <IconComponent size={24} />
                    </div>
                    <div className={styles.roleInfo}>
                      <h3>{role.title}</h3>
                      <p>{role.description}</p>
                    </div>
                    <div className={styles.radioButton}>
                      <input
                        type="radio"
                        id={role.id}
                        name="user-role"
                        checked={selectedRole === role.id}
                        onChange={() => handleRoleChange(role.id)}
                      />
                      <label htmlFor={role.id}></label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.continueButton} disabled={!selectedRole || submitting}>
                {submitting ? 'En cours...' : 'Continuer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  function handleRoleChange(roleId: string) {
    setSelectedRole(roleId);
  }
};

export default UserRoleSelection;
