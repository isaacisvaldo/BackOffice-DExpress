import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/contexts/AuthContext";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";
import { useEffect } from "react";

export default function LayoutDashboard() {
  const { isLoggedIn, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [isLoggedIn]);

  // Enquanto checa a autenticação → mostra spinner
  if (isLoading || isLoggedIn === null) {
    return (
      <div className="flex justify-center items-center py-10">
        <SwirlingEffectSpinner />
      </div>
    );
  }

  // Se não está logado → redireciona para login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading || isLoggedIn === null) {
    return (
      <div className="flex justify-center items-center py-10">
        <SwirlingEffectSpinner />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <SwirlingEffectSpinner />
      </div>
    );
  }

  // 2) Não autenticado
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader onSearch={(val) => console.log("Pesquisa Global:", val)} />
        <div className="flex-1 p-4 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
