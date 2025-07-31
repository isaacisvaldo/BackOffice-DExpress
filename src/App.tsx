// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"

import LoginPage from "./pages/auth/LoginPage"
import NotFoundPage from "./pages/dashboard/error/404"
import DashboardPage from "./pages/dashboard/DashboardPage"
import ApplicationsPage from "./pages/dashboard/candidacy/ApplicationsPage"
import CitiesPage from "./pages/dashboard/location/citiesPage"
import ProfilePage from "./pages/dashboard/profile/ProfilePage"
import PrivateRoute from "./components/PrivateRoute"
import LayoutDashboard from "./pages/dashboard/LayoutDashboard"
import ApplicationDetailPage from "./pages/dashboard/candidacy/ApplicationDetailPage"

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
            {/* Redirecionamento padrão */}
           
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="locations/cities" element={<CitiesPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
             {/* Página 404 */}
          <Route path="*" element={<NotFoundPage />} />
          </Route>

         
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
