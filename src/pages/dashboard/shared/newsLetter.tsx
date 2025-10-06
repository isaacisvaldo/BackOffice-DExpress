import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";
import { DataTable } from "@/components/data-table";
import { NewsLetterColumns } from "@/components/shared/newsLetter-column";
import { DeleteNewsLetterSubscription, GetNewsLetterSubscriptionsList, type NewsLetterSubscription } from "@/services/shared/newsLetter/newsLetter.service";
import { formatDate } from "@/util";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export function NewsLetter() {
  const [data, setData] = useState<NewsLetterSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [debouncedemailFilter, setDebouncedemailFilter] = useState<string>("");


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedemailFilter(emailFilter);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [emailFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await GetNewsLetterSubscriptionsList({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedemailFilter || undefined,
      });

      const mappedData: NewsLetterSubscription[] = result.data.map((item: any) => ({
        id: item.id,
        email: item.email,
        createdAt: formatDate(item.createdAt),

      }));
      setData(mappedData);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar cursos", error);

    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedemailFilter]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await DeleteNewsLetterSubscription(id);
      toast.success("Sucesso", {
        description: "Curso excluído com sucesso!",
      });
      fetchData();
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      toast.error("Erro", {
        description: "Falha ao excluir o curso. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = NewsLetterColumns(handleDelete, isDeleting);
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Newsletter</h5>
        <div className="container mx-auto py-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <SwirlingEffectSpinner></SwirlingEffectSpinner>
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
                  placeholder: "Filtrar por Email...",
                  value: emailFilter,
                  onChange: setEmailFilter,
                },
              ]}
            />
          )}
        </div>

      </div>
    </div>
  );
} 