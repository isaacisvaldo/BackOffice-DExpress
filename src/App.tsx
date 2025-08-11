// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

import LoginPage from "./pages/auth/LoginPage"
import NotFoundPage from "./pages/dashboard/error/404"
import DashboardPage from "./pages/dashboard/DashboardPage"
import ApplicationsPage from "./pages/dashboard/application/ApplicationsPage"
import CitiesList from "./pages/dashboard/location/citiesList"
import ProfilePage from "./pages/dashboard/profile/ProfilePage"
import LayoutDashboard from "./pages/dashboard/LayoutDashboard"
import ApplicationDetailPage from "./pages/dashboard/application/ApplicationDetailPage"
import ProfessionalsList from "./pages/dashboard/profissional/profissionalList"
import DistrictList from "./pages/dashboard/location/districList"
import AdminList from "./pages/dashboard/admin/AdminList"
import RoleList from "./pages/dashboard/role/RoleList"
import ProfessionaDetails from "./pages/dashboard/profissional/profissionalDetails"

// 🔹 Rota protegida
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth()
  if (isLoading) return <div>Carregando...</div>
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />
}

// 🔹 Rota pública (se logado → manda para dashboard)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth()
  if (isLoading) return <div>Carregando...</div>
  return !isLoggedIn ? <>{children}</> : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* O BrowserRouter agora envolve o AuthProvider */}
      <BrowserRouter>
        <AuthProvider>
          <Routes>

            {/* Rotas públicas */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            {/* Rotas protegidas com layout */}
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
              <Route path="locations/districts" element={<DistrictList />} />
              <Route path="hires/applications" element={<ApplicationsPage />} />
              <Route path="hires/applications/:id" element={<ApplicationDetailPage />} />
              <Route path="professionals" element={<ProfessionalsList />} />
              <Route path="professional/:id/details" element={<ProfessionaDetails />} />
              <Route path="admin/roles-permissions" element={<RoleList />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="admin/users" element={<AdminList />} />
              {/* Página 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
