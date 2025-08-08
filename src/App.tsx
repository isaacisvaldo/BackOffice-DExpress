// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider } from "./contexts/AuthContext" // 👈 IMPORTADO AQUI

import LoginPage from "./pages/auth/LoginPage"
import NotFoundPage from "./pages/dashboard/error/404"
import DashboardPage from "./pages/dashboard/DashboardPage"
import ApplicationsPage from "./pages/dashboard/candidacy/ApplicationsPage"
import CitiesList from "./pages/dashboard/location/citiesList"
import ProfilePage from "./pages/dashboard/profile/ProfilePage"
import PrivateRoute from "./components/PrivateRoute"
import LayoutDashboard from "./pages/dashboard/LayoutDashboard"
import ApplicationDetailPage from "./pages/dashboard/candidacy/ApplicationDetailPage"
import ProfessionalsList from "./pages/dashboard/profissional/profissionalList"
import DistrictList from "./pages/dashboard/location/districList"
import AdminList from "./pages/dashboard/admin/AdminList"
import RoleList from "./pages/dashboard/role/RoleList"


export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider> {/* ENVOLVENDO TUDO COM AuthProvider */}
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />

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
              <Route path="/locations/districts" element={<DistrictList />} />
              <Route path="/hires/applications" element={<ApplicationsPage />} />
              <Route path="/hires/applications/:id" element={<ApplicationDetailPage />} />
              <Route path="/professionals" element={<ProfessionalsList />} />
              <Route path="/admin/roles-permissions" element={<RoleList />} />

             

              <Route path="profile" element={<ProfilePage />} />

              {/*ADMIN*/}

              <Route path="/admin/users" element={<AdminList />} />
              {/* Página 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
