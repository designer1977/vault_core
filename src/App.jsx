import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import VaultCore from './pages/VaultCore';
import SecurityLogic from './pages/SecurityLogic';
import JwtSecretGenerator from './pages/generators/JwtSecretGenerator';
import ApiKeyGenerator from './pages/generators/ApiKeyGenerator';
import EncryptionKeyGenerator from './pages/generators/EncryptionKeyGenerator';
import UuidGenerator from './pages/generators/UuidGenerator';
import PasswordGenerator from './pages/generators/PasswordGenerator';
import MetricsDashboard from './pages/MetricsDashboard';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<VaultCore />} />
      <Route path="/security-logic" element={<SecurityLogic />} />
      <Route path="/jwt-secret-generator" element={<JwtSecretGenerator />} />
      <Route path="/api-key-generator" element={<ApiKeyGenerator />} />
      <Route path="/encryption-key-generator" element={<EncryptionKeyGenerator />} />
      <Route path="/uuid-generator" element={<UuidGenerator />} />
      <Route path="/password-generator" element={<PasswordGenerator />} />
      <Route path="/metrics" element={<MetricsDashboard />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App