# ImmoGuinée - Plateforme Immobilière en Guinée

ImmoGuinée est une plateforme immobilière moderne conçue spécifiquement pour le marché guinéen. Elle vise à connecter les propriétaires, les locataires et les agents immobiliers de manière sécurisée et transparente.

## Fonctionnalités

- **Vérification KYC** : Tous les utilisateurs sont vérifiés via une identification biométrique
- **Paiements automatisés** : Prélèvements automatiques des loyers
- **Tableaux de bord clairs** : Suivi en temps réel des revenus, locataires et paiements
- **Contrats automatiques** : Génération de contrats de bail avec signature électronique
- **Gestion diaspora** : Service de gestion de biens pour les propriétaires vivant à l'étranger
- **Messagerie intégrée** : Communication directe entre les parties

## Technologies utilisées

- React (v19.2.0)
- TypeScript
- Vite
- React Router DOM
- Lucide React (pour les icônes)
- CSS Modules
- Jest et React Testing Library (pour les tests)

## Architecture du projet

```
src/
├── App.tsx                 # Point d'entrée principal de l'application
├── context/                # Gestion d'état avec Context API
│   └── PropertyContext.tsx # Contexte pour les données dynamiques
├── components/
│   ├── pages/             # Pages principales
│   │   ├── Home.tsx       # Page d'accueil
│   │   ├── AuthPage.tsx   # Pages d'authentification
│   │   └── ...
│   └── dashboard_locataire/ # Composants du tableau de bord locataire
│       ├── Dashboard_Locataire.tsx
│       ├── Mon_Logement.tsx
│       ├── Mes_Paiements.tsx
│       └── ...
├── assets/                # Images et autres ressources
└── ...
```

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-compte/immo-guinee.git
cd imo-guinee
```

2. Installez les dépendances :
```bash
npm install
```

3. Démarrez le serveur de développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse http://localhost:5173

## Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Crée une version optimisée pour la production
- `npm run preview` - Prévisualise la version de production localement
- `npm run lint` - Exécute ESLint pour vérifier le code
- `npm run test` - Lance les tests avec Jest
- `npm run test:watch` - Lance les tests en mode surveillance
- `npm run test:coverage` - Génère un rapport de couverture de test

## Tests

Le projet utilise Jest et React Testing Library pour les tests. Les fichiers de test se trouvent à côté des composants qu'ils testent.

Pour exécuter les tests :
```bash
npm run test
```

## Structure de gestion d'état

Le projet utilise React Context API pour gérer l'état global des données dynamiques comme les propriétés immobilières, les fonctionnalités, les points de confiance, etc.

## Contribution

Les contributions sont les bienvenues ! Veuillez d'abord discuter des modifications que vous souhaitez apporter via les issues, puis soumettre une Pull Request.

## Licence

Ce projet est sous licence MIT.