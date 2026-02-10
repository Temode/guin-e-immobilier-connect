import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2rem', fontWeight: 'bold' }}>404</h1>
        <p style={{ marginBottom: '1rem', fontSize: '1.25rem', color: '#64748B' }}>Page non trouvée</p>
        <a href="/" style={{ color: 'var(--color-primary-600)', textDecoration: 'underline' }}>
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
