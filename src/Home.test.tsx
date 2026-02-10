import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PropertyProvider } from './context/PropertyContext';
import Home from './components/pages/Home';

// Mock des modules qui posent problème
jest.mock('lucide-react', () => ({
  Check: () => <span>Check Icon</span>,
  ArrowRight: () => <span>ArrowRight Icon</span>,
  Search: () => <span>Search Icon</span>,
  CreditCard: () => <span>CreditCard Icon</span>,
  BarChart3: () => <span>BarChart3 Icon</span>,
  PenTool: () => <span>PenTool Icon</span>,
  Globe: () => <span>Globe Icon</span>,
  MessageCircle: () => <span>MessageCircle Icon</span>,
  MapPin: () => <span>MapPin Icon</span>,
  Lock: () => <span>Lock Icon</span>,
  DollarSign: () => <span>DollarSign Icon</span>,
  FileText: () => <span>FileText Icon</span>,
  ShieldCheck: () => <span>ShieldCheck Icon</span>,
  Zap: () => <span>Zap Icon</span>,
  Facebook: () => <span>Facebook Icon</span>,
  Twitter: () => <span>Twitter Icon</span>,
  Linkedin: () => <span>Linkedin Icon</span>,
  Instagram: () => <span>Instagram Icon</span>,
  Heart: () => <span>Heart Icon</span>,
  Star: () => <span>Star Icon</span>,
  Image: () => <span>Image Icon</span>,
  Home: () => <span>Home Icon</span>,
  Maximize2: () => <span>Maximize2 Icon</span>,
  Snowflake: () => <span>Snowflake Icon</span>,
  Car: () => <span>Car Icon</span>,
  Sofa: () => <span>Sofa Icon</span>,
  CloudSun: () => <span>CloudSun Icon</span>,
}));

describe('Home Component', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <PropertyProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </PropertyProvider>
    );
  };

  test('renders welcome message', () => {
    renderWithProviders(<Home />);
    
    const welcomeElement = screen.getByText(/Trouvez la maison parfaite en Guinée/i);
    expect(welcomeElement).toBeInTheDocument();
  });
});
