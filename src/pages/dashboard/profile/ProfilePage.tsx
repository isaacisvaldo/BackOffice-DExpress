import { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/user/userService";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileContent from "@/components/profile/profile-content";
import ErrorPage from "../error/erro-page";

interface AdminUser {
  id: string;
  name: string;
  numberphone: string;
  isActive: boolean;
  identityNumber: string;
  gender: string;
  birthDate: string | Date;
  email: string;
  avatar?: string | null;
  role: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  permissions: string[];
  accountSettings: any[];
  notificationSettings: any[];
  securitySettings: any[];
}

type Gender = "MALE" | "FEMALE" | "OTHER";

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
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Carregando...</p>
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

  const normalizedUser = {
    ...user,
    gender: (user.gender?.toUpperCase() as Gender) || "OTHER",
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <ProfileHeader user={normalizedUser} />
          <ProfileContent user={normalizedUser} />
        </div>
      </div>
    </div>
  );
}
