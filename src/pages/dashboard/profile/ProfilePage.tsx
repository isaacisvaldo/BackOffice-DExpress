import { useState, useEffect } from "react";

import ProfileHeader from "@/components/profile/profile-header";
import ProfileContent from "@/components/profile/profile-content";
import ErrorPage from "../error/erro-page";
import { getCurrentUser, type AdminUser } from "@/services/admin/admin.service";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";



export default function ProfilePage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
  
      const data = await getCurrentUser();
      setUser(data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
     <div className="flex justify-center items-center py-10">
           <SwirlingEffectSpinner></SwirlingEffectSpinner>
          </div>
    );
  }

  if (!user) {
    return (
      <ErrorPage
        title="Erro ao carregar perfil"
        message="Não conseguimos buscar suas informações. Tente novamente."
        breadcrumb="Perfil"
        onRetry={fetchData}
        backTo="/dashboard"
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* ✅ Passa o objeto 'user' diretamente para os componentes filhos */}
          <ProfileHeader user={user} />
          <ProfileContent user={user} />
        </div>
      </div>
    </div>
  );
}
