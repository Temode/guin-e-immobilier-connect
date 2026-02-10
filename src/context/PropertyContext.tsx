import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  period: string;
  type: string;
  verified: boolean;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  priceValue: number;
}

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: any;
}

interface TrustPoint {
  id: number;
  title: string;
  description: string;
  icon: any;
}

interface TrustVisualCard {
  id: number;
  number: string;
  label: string;
  icon: any;
}

interface FooterLink {
  id: number;
  text: string;
  href: string;
}

interface State {
  properties: Property[];
  features: Feature[];
  trustPoints: TrustPoint[];
  trustVisualCards: TrustVisualCard[];
  footerLinks: {
    platform: FooterLink[];
    company: FooterLink[];
    support: FooterLink[];
  };
  stats: {
    id: number;
    number: string;
    label: string;
  }[];
}

interface Action {
  type: string;
  payload?: any;
}

// Initial State
const initialState: State = {
  properties: [],
  features: [],
  trustPoints: [],
  trustVisualCards: [],
  footerLinks: {
    platform: [],
    company: [],
    support: []
  },
  stats: []
};

// Reducer
const propertyReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PROPERTIES':
      return { ...state, properties: action.payload };
    case 'SET_FEATURES':
      return { ...state, features: action.payload };
    case 'SET_TRUST_POINTS':
      return { ...state, trustPoints: action.payload };
    case 'SET_TRUST_VISUAL_CARDS':
      return { ...state, trustVisualCards: action.payload };
    case 'SET_FOOTER_LINKS':
      return { ...state, footerLinks: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'ADD_PROPERTY':
      return { ...state, properties: [...state.properties, action.payload] };
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        properties: state.properties.map(property =>
          property.id === action.payload.id ? action.payload : property
        )
      };
    case 'DELETE_PROPERTY':
      return {
        ...state,
        properties: state.properties.filter(property => property.id !== action.payload)
      };
    default:
      return state;
  }
};

// Context
const PropertyContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null
});

// Provider
interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(propertyReducer, initialState);

  return (
    <PropertyContext.Provider value={{ state, dispatch }}>
      {children}
    </PropertyContext.Provider>
  );
};

// Custom hook
export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
};