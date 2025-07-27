import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const accessToken = localStorage.getItem('accessToken');
  return accessToken ? children : <Navigate to="/" replace />;
}
