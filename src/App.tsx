import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardPage from './pages/dashboard/DashboardPage';
import ApplicationsPage from './pages/dashboard/candidacy/ApplicationsPage';
import NotFoundPage from './pages/dashboard/error/404';
import CitiesPage from './pages/dashboard/location/citiesPage';
import { ThemeProvider } from './components/theme-provider';
import { ModeToggle } from './components/mode-toggle';
import ProfilePage from './pages/dashboard/profile/ProfilePage';


export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        {/* Coloque o botão em algum lugar visível, por exemplo, canto superior direito */}
        <div className="fixed top-4 right-4 z-50">
          <ModeToggle />
        </div>

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/locations/cities"
            element={
              <PrivateRoute>
                <CitiesPage />
              </PrivateRoute>
            }
          />
          <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/profile" element={ <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
