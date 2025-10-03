import { useState } from "react";
import { DataTable } from "@/components/data-table";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";
import { CreateContractModal } from "./components/create-contracts-modal";
import { useGetContracts } from "@/hooks/use-get-contracts";
import { contractsColumns } from "@/components/contract/contract-column";
import { ManagementContractsProvider } from "./context";
import { useDeleteContractMutation } from "@/hooks/use-delete-contract-mutation";

export default function ManagementContracts() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { deleteContactAsync, isPending: isDeleting } =
    useDeleteContractMutation();
  const { data, isPending } = useGetContracts({ limit, page });

  const columns = contractsColumns(deleteContactAsync, isDeleting);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Gestão de Contratos</h1>
      <ManagementContractsProvider>
        <div className="flex justify-end mb-4">
          <CreateContractModal />
        </div>

        <div className="container mx-auto py-6">
          {isPending && data === undefined ? (
            <div className="flex justify-center items-center py-10">
              <SwirlingEffectSpinner />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data?.data ?? []}
              page={page}
              setPage={setPage}
              totalPages={data?.totalPages ?? 0}
              limit={limit}
              setLimit={setLimit}
              filters={[]}
            />
          )}
        </div>
      </ManagementContractsProvider>
    </div>
  );
}
