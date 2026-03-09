import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PropertyProvider } from './context/PropertyContext';
import { AuthProvider } from './context/AuthContext';
import OfflineBanner from './components/shared/OfflineBanner';
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
import DashboardAgentLayout from './components/dashbord_demarcheur/shared/DashboardAgentLayout';
import AgentDashboard from './components/dashbord_demarcheur/Agentdashboard';
import AgentMesBiens from './components/dashbord_demarcheur/Agentmesbiens';
import AgentAgenda from './components/dashbord_demarcheur/Agentagenda';
import AgentClients from './components/dashbord_demarcheur/Agentclients';
import AgentMessages from './components/dashbord_demarcheur/Agentmessages';
import AgentCommissions from './components/dashbord_demarcheur/Agentcommissions';
import AgentSettings from './components/dashbord_demarcheur/Agentsettings';
import AgentIAChat from './components/dashbord_demarcheur/AgentIAChat';
import AgentNotifications from './components/dashbord_demarcheur/AgentNotifications';
import PropertyDetail from './pages/PropertyDetail';
import AdminLayout from './components/backoffice/shared/AdminLayout';
import AdminDashboard from './components/backoffice/AdminDashboard';
import AdminUsers from './components/backoffice/AdminUsers';
import AdminProperties from './components/backoffice/AdminProperties';
import AdminRentals from './components/backoffice/AdminRentals';
import AdminFinances from './components/backoffice/AdminFinances';
import AdminActivity from './components/backoffice/AdminActivity';
import AdminIA from './components/backoffice/AdminIA';
import AdminSettings from './components/backoffice/AdminSettings';
import AdminWithdrawals from './components/backoffice/AdminWithdrawals';

export default function App() {
  return (
    <PropertyProvider>
      <Router>
        <OfflineBanner />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<SocialAuthPage />} />
            <Route path="/auth/email" element={<EmailAuthPage />} />
            <Route path="/user-role" element={<UserRoleSelection />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            
            <Route path="/dashbord-agent" element={
              <ProtectedRoute>
                <DashboardAgentLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AgentDashboard />} />
              <Route path="mes-biens" element={<AgentMesBiens />} />
              <Route path="mes-clients" element={<AgentClients />} />
              <Route path="agenda" element={<AgentAgenda />} />
              <Route path="messages" element={<AgentMessages />} />
              <Route path="commissions" element={<AgentCommissions />} />
              <Route path="notifications" element={<AgentNotifications />} />
              <Route path="ia-chat" element={<AgentIAChat />} />
              <Route path="profil" element={<AgentSettings />} />
            </Route>

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

            <Route path="/backoffice" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="utilisateurs" element={<AdminUsers />} />
              <Route path="biens" element={<AdminProperties />} />
              <Route path="locations" element={<AdminRentals />} />
              <Route path="finances" element={<AdminFinances />} />
              <Route path="retraits" element={<AdminWithdrawals />} />
              <Route path="activite" element={<AdminActivity />} />
              <Route path="ia" element={<AdminIA />} />
              <Route path="parametres" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </PropertyProvider>
  );
}
