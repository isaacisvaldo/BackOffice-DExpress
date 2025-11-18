// src/routes/PublicRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";

export function PublicRoute() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <SwirlingEffectSpinner />
      </div>
    );
  }

  return !isLoggedIn ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
