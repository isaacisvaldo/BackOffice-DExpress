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
import LanguageList from "./pages/dashboard/shared/languageList"
import SkillList from "./pages/dashboard/shared/skillsList"
import CourseList from "./pages/dashboard/shared/courseList"
import HighestDegreeList from "./pages/dashboard/shared/HighestDegreeList"
import MaritalStatusList from "./pages/dashboard/shared/MaritalStatusList"
import GenderList from "./pages/dashboard/shared/GenderList"
import SwirlingEffectSpinner from "./components/customized/spinner/spinner-06"
import UserClientLeadsList from "./pages/dashboard/user-client/UserClientLeadsList"
import UserClientList from "./pages/dashboard/user-client/UserClientList"
import ClientCompanyProfileList from "./pages/dashboard/user-client/company/ClientCompanyList"
import ClientList from "./pages/dashboard/user-client/ClientList"
import PackagesList from "./pages/dashboard/user-client/company/package/PackageList"
import ContractsListAndCreation from "./pages/dashboard/service/ContractsListAndCreation"
import DashboardFinancial from "./pages/dashboard/finance/DasboardFinancial"
import ServiceRequestList from "./pages/dashboard/service/ServiceRequestList"
import NotificationList from "./pages/dashboard/notifications/notificationList"

// 🔹 Rota protegida
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth()
  if (isLoading) return <div className="flex justify-center items-center py-10">
    <SwirlingEffectSpinner></SwirlingEffectSpinner>
  </div>
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />
}

// 🔹 Rota pública (se logado → manda para dashboard)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth()
  if (isLoading) return <div className="flex justify-center items-center py-10">
    <SwirlingEffectSpinner></SwirlingEffectSpinner>
  </div>
  return !isLoggedIn ? <>{children}</> : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
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
              <Route path="rh/applications" element={<ApplicationsPage />} />
              <Route path="rh/application/:id" element={<ApplicationDetailPage />} />
              <Route path="rh/professionals" element={<ProfessionalsList />} />
              <Route path="rh/professional/:id/details" element={<ProfessionaDetails />} />
              <Route path="admin/roles-permissions" element={<RoleList />} />
              <Route path="shared-data/languages" element={<LanguageList />} />
              <Route path="shared-data/skills" element={<SkillList />} />
              <Route path="shared-data/courses" element={<CourseList />} />
              <Route path="shared-data/highest-degrees" element={<HighestDegreeList />} />
              <Route path="shared-data/marital-status" element={<MaritalStatusList />} />
              <Route path="shared-data/package" element={<PackagesList />} /> 
              <Route path="shared-data/genders" element={<GenderList />} />
           
              <Route path="profile" element={<ProfilePage />} />

              <Route path="contratacoes/contratos-ativos" element={<ContractsListAndCreation />} />

              <Route path="portal/users" element={<UserClientList />} />
              <Route path="portal/leads" element={<UserClientLeadsList />} />


              <Route path="clients/company" element={<ClientCompanyProfileList />} /> 
              <Route path="clients/individual" element={<ClientList />} /> 
              <Route path="contratacoes/solicitacoes" element={<ServiceRequestList />} /> 
            
           <Route path="financas/dashboard" element={<DashboardFinancial />} />
           <Route path="settings/notifications" element={<NotificationList />} />

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
