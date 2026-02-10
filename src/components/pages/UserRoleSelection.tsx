import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, Key, Briefcase } from 'lucide-react';
import styles from './UserRoleSelection.module.css';

const UserRoleSelection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('looking'); // Valeur par défaut: je cherche une maison

  const roles = [
    { id: 'looking', title: 'Je cherche une maison', description: 'Trouver un logement à louer ou acheter', icon: Search },
    { id: 'currentTenant', title: 'Je suis déjà locataire', description: 'Gérer mon logement actuel', icon: Home },
    { id: 'owner', title: 'Je suis propriétaire', description: 'Louer ou vendre mes biens immobiliers', icon: Key },
    { id: 'agent', title: 'Agent immobilier', description: 'Gérer les biens pour les clients', icon: Briefcase }
  ];

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      alert('Veuillez sélectionner une option');
      return;
    }

    console.log('Rôle sélectionné:', selectedRole);
    // Ici, vous pouvez enregistrer le rôle de l'utilisateur dans votre système
    // et rediriger vers la page appropriée
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
              <button type="submit" className={styles.continueButton} disabled={!selectedRole}>
                Continuer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRoleSelection;