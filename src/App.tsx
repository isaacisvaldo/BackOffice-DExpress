import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardPage from './pages/dashboard/DashboardPage';
import ApplicationsPage from './pages/dashboard/candidacy/ApplicationsPage';
import NotFoundPage from './pages/dashboard/error/404';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="/applications" element={<ApplicationsPage /> } />
        <Route path="*" element={<NotFoundPage /> } />
      </Routes>
    </BrowserRouter>
  );
}
