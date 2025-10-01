import { DataTable } from "@/components/data-table";
import { AuditLogEntryColumns } from "@/components/shared/auditLog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  deleteAuditLog,
  getAuditLog,
  type AuditLog,
} from "@/services/auditLog/auditLog.service";
import { useEffect, useState } from "react";

export default function AuditLog() {
  const [deletingItem, setDeletingItem] = useState<AuditLog | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [data, setData] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // filtros
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [debouncedSearchFilter, setDebouncedSearchFilter] = useState<string>("");

  const [loading, setLoading] = useState(false);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearchFilter(searchFilter),
      500
    );
    return () => clearTimeout(timer);
  }, [searchFilter]);

  // resetar pagina quando filtros mudam
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchFilter, statusFilter]);

  // fetch
  async function fetchData() {
    setLoading(true);
    try {
      const result = await getAuditLog({
        page,
        limit: limit === 0 ? undefined : limit,
        status: statusFilter || undefined,
        search: debouncedSearchFilter || undefined,
      });

      setData(result.data);
      setTotalPages(result.totalPages || totalPages);
      setPage(result.page);
      setLimit(result.limit);
    } catch (e) {
      console.error("Erro ao carregar logs de auditoria", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedSearchFilter, statusFilter]);

  async function handleDelete() {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      await deleteAuditLog(deletingItem.id);
      setDeletingItem(null);

      setData((prev) => prev.filter((i) => i.id !== deletingItem.id));
    } catch (e) {
      console.error("Erro ao excluir log", e);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6 bg-background">
      <h1 className="text-2xl font-bold mb-4">AuditLog*</h1>
      <div className="container mx-auto max-h-[80vh] overflow-y-auto pr-2">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <DataTable
            columns={AuditLogEntryColumns({
              onDelete: (item) => setDeletingItem(item),
            })}
            data={data}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            limit={limit}
            setLimit={setLimit}
            filters={[
              {
                type: "input",
                column: "Entity",
                placeholder: "Pesquisar...",
                value: searchFilter,
                onChange: setSearchFilter,
              },
              {
                type: "select",
                placeholder: "Filtrar status",
                value: statusFilter || "all",
                onChange: (val) => setStatusFilter(val === "all" ? "" : val),
                options: [
                  { label: "Todos", value: "all" },
                  { label: "Sucesso", value: "SUCCESS" },
                  { label: "Falhou", value: "FAILED" },
                ],
              },
            ]}
          />
        )}
      </div>

      {/* Confirmar exclusão */}
      <AlertDialog
        open={!!deletingItem}
        onOpenChange={() => setDeletingItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. O log{" "}
              <b>{deletingItem?.description}</b> será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={deleting}
            >
              {deleting ? "Excluindo..." : "Confirmar Exclusão"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
