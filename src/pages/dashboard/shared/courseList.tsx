// src/components/courses/CourseList.tsx (or similar path)

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { courseColumns, type Course } from "@/components/shared/course-column";
import { createCourse, deleteCourse, getCourses } from "@/services/shared/courses/course.service";
import SwirlingEffectSpinner from "@/components/customized/spinner/spinner-06";

export default function CourseList() {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const [nameFilter, setNameFilter] = useState<string>("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState<string>("");
  const [newCourseLabel, setNewCourseLabel] = useState<string>("");
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameFilter(nameFilter);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [nameFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getCourses({
        page,
        limit: limit === 0 ? undefined : limit,
        search: debouncedNameFilter || undefined, 
      });

      const mappedData: Course[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        label: item.label,
        createdAt: new Date(item.createdAt).toLocaleDateString("pt-PT"),
        updatedAt: new Date(item.updatedAt).toLocaleDateString("pt-PT"),
      }));

      setData(mappedData);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar cursos", error);
      toast.error("Erro ao carregar cursos.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteCourse(id);
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

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedNameFilter]);

  const handleCreateCourse = async () => {
    if (!newCourseName.trim() || !newCourseLabel.trim()) {
      toast.error("Nome e rótulo do curso não podem ser vazios.");
      return;
    }

    setIsCreatingCourse(true);
    try {
      await createCourse({
        name: newCourseName,
        label: newCourseLabel,
      });
      toast.success("Curso cadastrado com sucesso!");
      setIsModalOpen(false);
      setNewCourseName("");
      setNewCourseLabel("");
      fetchData();
    } catch (error: any) {
      console.error("Erro ao cadastrar curso", error);
      toast.error(error.message || "Erro ao cadastrar curso.");
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const columns = courseColumns(handleDelete, isDeleting);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Cursos</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)}>Cadastrar Novo Curso</Button>
      </div>

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
                column: "label", 
                placeholder: "Filtrar por Rotulo...",
                value: nameFilter,
                onChange: setNameFilter,
              },
            ]}
          />
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Curso</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar um novo curso.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseName" className="text-right">
                Nome
              </Label>
              <Input
                id="courseName"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: ENGENHARIA DE SOFTWARE"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseLabel" className="text-right">
                Rótulo
              </Label>
              <Input
                id="courseLabel"
                value={newCourseLabel}
                onChange={(e) => setNewCourseLabel(e.target.value)}
                className="col-span-3"
                placeholder="Ex: software_engineering"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateCourse} disabled={isCreatingCourse}>
              {isCreatingCourse ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}