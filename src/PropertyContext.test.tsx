import React from 'react';
import { render, screen } from '@testing-library/react';
import { PropertyProvider, usePropertyContext } from './context/PropertyContext';

// Composant de test pour accéder au contexte
const TestComponent: React.FC = () => {
  const { state } = usePropertyContext();
  return <div>Properties count: {state.properties.length}</div>;
};

describe('PropertyContext', () => {
  test('should provide initial state', () => {
    render(
      <PropertyProvider>
        <TestComponent />
      </PropertyProvider>
    );

    expect(screen.getByText('Properties count: 0')).toBeInTheDocument();
  });
});