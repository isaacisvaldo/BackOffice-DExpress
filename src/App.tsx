import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Páginas da sua aplicação
import LoginPage from "./pages/auth/LoginPage";
import NotFoundPage from "./pages/dashboard/error/404";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ApplicationsPage from "./pages/dashboard/candidacy/ApplicationsPage";
import CitiesList from "./pages/dashboard/location/citiesList";
import ProfilePage from "./pages/dashboard/profile/ProfilePage";
import LayoutDashboard from "./pages/dashboard/LayoutDashboard";
import ApplicationDetailPage from "./pages/dashboard/candidacy/ApplicationDetailPage";
import ProfessionalsList from "./pages/dashboard/profissional/profissionalList";
import DistrictList from "./pages/dashboard/location/districList";
import AdminList from "./pages/dashboard/admin/AdminList";
import RoleList from "./pages/dashboard/role/RoleList";

/**
 * Componente de rota privada.
 * Redireciona o usuário para a página de login se ele não estiver autenticado.
 */
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();


  if (isLoading) {
    return <div>Carregando...</div>;
  }
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

/**
 * Componente de rota pública.
 * Redireciona o usuário para o dashboard se ele já estiver autenticado.
 */
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();


  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas que usam o PublicRoute. */}
            <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

            {/* Rotas protegidas que usam o PrivateRoute. */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <LayoutDashboard />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="locations/cities" element={<CitiesList />} />
              <Route path="/locations/districts" element={<DistrictList />} />
              <Route path="/hires/applications" element={<ApplicationsPage />} />
              <Route path="/hires/applications/:id" element={<ApplicationDetailPage />} />
              <Route path="/professionals" element={<ProfessionalsList />} />
              <Route path="/admin/roles-permissions" element={<RoleList />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="/admin/users" element={<AdminList />} />
              
            </Route>

            {/* Rota para lidar com páginas não encontradas (404) */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
