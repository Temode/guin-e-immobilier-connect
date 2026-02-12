import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PropertyProvider } from './context/PropertyContext';
import { AuthProvider } from './context/AuthContext';
import SocialAuthPage from "./components/pages/SocialAuthPage";
import EmailAuthPage from "./components/pages/EmailAuthPage";
import UserRoleSelection from "./components/pages/UserRoleSelection";
import Home from "./components/pages/Home";
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLocataireLayout from './components/dashboard_locataire/shared/DashboardLocataireLayout';
import Dashboard_Locataire from './components/dashboard_locataire/Dashboard_Locataire';
import Mon_Logement from './components/dashboard_locataire/Mon_Logement';
import Mes_Paiements from './components/dashboard_locataire/Mes_Paiements';
import Documents from './components/dashboard_locataire/Documents';
import Messages from './components/dashboard_locataire/Messages';
import Notifications from './components/dashboard_locataire/Notifications';
import SearchProperty from './components/dashboard_locataire/SearchProperty';
import ProfileSettings from './components/dashboard_locataire/ProfileSettings';
import AgentDashboard from './components/dashbord_demarcheur/AgentDashboard';
import AgentMesBiens from './components/dashbord_demarcheur/AgentMesBiens';
import AgentAgenda from './components/dashbord_demarcheur/Agentagenda';

export default function App() {
  return (
    <PropertyProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<SocialAuthPage />} />
            <Route path="/auth/email" element={<EmailAuthPage />} />
            <Route path="/user-role" element={<UserRoleSelection />} />
            
            <Route path="/dashbord-agent" element={<AgentDashboard />} />
            <Route path="/agent-mes-biens" element={<AgentMesBiens />} />
            <Route path="/agent-agenda" element={<AgentAgenda />} />

            <Route path="/dashboard-locataire" element={
              <ProtectedRoute>
                <DashboardLocataireLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard_Locataire />} />
              <Route path="mon-logement" element={<Mon_Logement />} />
              <Route path="mes-paiements" element={<Mes_Paiements />} />
              <Route path="documents" element={<Documents />} />
              <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="recherche" element={<SearchProperty />} />
              <Route path="profil" element={<ProfileSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </PropertyProvider>
  );
}
