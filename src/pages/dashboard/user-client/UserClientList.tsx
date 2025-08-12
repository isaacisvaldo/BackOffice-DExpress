// src/components/users/UserList.tsx

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { toast } from "sonner";
import { userColumns, type User } from "@/components/shared/user-column";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";
import { deleteUser, getUsers } from "@/services/users-client/user-client.service";
import type { UserType } from "@/enums/user-type";

export default function UserClientList() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [debouncedEmailFilter, setDebouncedEmailFilter] = useState<string>("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmailFilter(emailFilter);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [emailFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getUsers({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedEmailFilter || undefined,
      });

      const mappedData: User[] = result.data.map((item: any) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        isActive: item.isActive,
        type: item.type as UserType,
        createdAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
        updatedAt: new Date(item.updatedAt).toLocaleDateString("pt-PT"),
      }));

      setData(mappedData);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar usuários", error);
      toast.error("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteUser(id);
      toast.success("Sucesso", {
        description: "Usuário excluído com sucesso!",
      });
      fetchData();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro", {
        description: "Falha ao excluir o usuário. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedEmailFilter]);



  const columns = userColumns(handleDelete, isDeleting);

  return (
    <div className="flex flex-col gap-4">
     

      <div className="container mx-auto py-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <SwirlingEffectSpinner />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            limit={limit}
            setLimit={setLimit}
            filters={[
              {
                type: "input",
                column: "email",
                placeholder: "Filtrar por e-mail...",
                value: emailFilter,
                onChange: setEmailFilter,
              },
            ]}
          />
        )}
      </div>

   
    </div>
  );
}