import { useParams } from "react-router-dom";
import ErrorPage from "../error/erro-page";
import { useEffect, useState } from "react";
import { getProfessionalById, type Professional } from "@/services/profissional/profissional.service";
import toast from "react-hot-toast";
import ProfessionalHeader from "@/components/profissional/profissionalHeader";

export default  function ProfessionaDetails() {
    const { id } = useParams<{ id: string }>()
    const [profissional, setProfissional] = useState<Professional | null>(null)
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const profissional = await getProfessionalById(id);
            setProfissional(profissional)
        } catch (error) {
            setLoading(false);
                setProfissional(null)
            toast.error("Erro ao carregar dados da candidatura");
            console.error(error);
        }finally {
        setLoading(false);
    }
    };
    useEffect(() => {

        fetchData();
    }, [id]);
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-lg">Carregando...</p>
            </div>
        );
    }
    if (!profissional) {
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
        <ProfessionalHeader user={profissional} />
                </div>
            </div>
        </div>
    );

}