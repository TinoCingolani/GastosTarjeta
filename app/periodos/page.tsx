"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mes } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const monthOrder: Record<string, number> = {
  ENERO: 1, FEBRERO: 2, MARZO: 3, ABRIL: 4, MAYO: 5, JUNIO: 6,
  JULIO: 7, AGOSTO: 8, SEPTIEMBRE: 9, OCTUBRE: 10, NOVIEMBRE: 11, DICIEMBRE: 12,
};

function sortMeses(meses: Mes[]) {
  return [...meses].sort((a, b) => {
    if (a.anio !== b.anio) return a.anio - b.anio;
    return (monthOrder[a.nombre] || 0) - (monthOrder[b.nombre] || 0);
  });
}

export default function PeriodosPage() {
  const router = useRouter();
  const [meses, setMeses] = useState<Mes[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingMes, setEditingMes] = useState<Mes | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    anio: new Date().getFullYear(),
    fecha_cierre: "",
    fecha_vencimiento: "",
    es_fecha_aproximada: false,
  });

  useEffect(() => {
    fetchMeses();
  }, []);

  async function fetchMeses() {
    setLoading(true);
    try {
      const res = await fetch("/api/meses");
      const data = await res.json();
      if (res.ok) setMeses(data);
    } catch {
      toast.error("Error al cargar períodos");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/meses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const newMes = await res.json();
      setMeses((prev) => sortMeses([...prev, newMes]));
      setOpenAdd(false);
      setForm({
        nombre: "",
        anio: new Date().getFullYear(),
        fecha_cierre: "",
        fecha_vencimiento: "",
        es_fecha_aproximada: false,
      });
      toast.success("Período agregado");
    } else {
      toast.error("Error al agregar período");
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMes) return;
    const res = await fetch(`/api/meses/${editingMes.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      setMeses((prev) =>
        sortMeses(prev.map((m) => (m.id === updated.id ? updated : m)))
      );
      setOpenEdit(false);
      setEditingMes(null);
      toast.success("Período actualizado");
    } else {
      toast.error("Error al actualizar período");
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/meses/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMeses((prev) => prev.filter((m) => m.id !== id));
      toast.success("Período eliminado");
    } else {
      const err = await res.json();
      toast.error(err.error || "Error al eliminar período");
    }
  }

  function openEditDialog(mes: Mes) {
    setEditingMes(mes);
    setForm({
      nombre: mes.nombre,
      anio: mes.anio,
      fecha_cierre: mes.fecha_cierre,
      fecha_vencimiento: mes.fecha_vencimiento,
      es_fecha_aproximada: mes.es_fecha_aproximada || false,
    });
    setOpenEdit(true);
  }

  const formFields = (
    <>
      <div className="grid gap-2">
        <Label htmlFor="nombre">Nombre del mes</Label>
        <Input
          id="nombre"
          placeholder="Ej: ABRIL"
          value={form.nombre}
          onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value.toUpperCase() }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="anio">Año</Label>
        <Input
          id="anio"
          type="number"
          value={form.anio}
          onChange={(e) => setForm((p) => ({ ...p, anio: Number(e.target.value) }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="fecha_cierre">Fecha de cierre</Label>
        <Input
          id="fecha_cierre"
          type="date"
          value={form.fecha_cierre}
          onChange={(e) => setForm((p) => ({ ...p, fecha_cierre: e.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="fecha_vencimiento">Fecha de vencimiento</Label>
        <Input
          id="fecha_vencimiento"
          type="date"
          value={form.fecha_vencimiento}
          onChange={(e) => setForm((p) => ({ ...p, fecha_vencimiento: e.target.value }))}
          required
        />
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="es_fecha_aproximada"
          checked={form.es_fecha_aproximada}
          onCheckedChange={(checked) => setForm((p) => ({ ...p, es_fecha_aproximada: !!checked }))}
        />
        <Label htmlFor="es_fecha_aproximada" className="font-normal cursor-pointer">
          Es fecha aproximada
        </Label>
      </div>
    </>
  );

  const sorted = sortMeses(meses);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" richColors />

      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Administración de Períodos
              </h1>
              <p className="text-xs text-muted-foreground">
                Gestiona los meses, cierres y vencimientos
              </p>
            </div>
          </div>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Agregar mes
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nuevo período</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="grid gap-4 mt-2">
                {formFields}
                <Button type="submit">Guardar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No hay períodos configurados</p>
            <p className="text-sm">Agrega tu primer mes para comenzar.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {sorted.map((mes) => (
              <Card key={mes.id} className="hover:bg-card/60 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {mes.nombre.slice(0, 3)}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {mes.nombre} {mes.anio}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          Cierre: {new Date(mes.fecha_cierre).toLocaleDateString("es-AR")}
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Vencimiento: {new Date(mes.fecha_vencimiento).toLocaleDateString("es-AR")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(mes)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(mes.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar período</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="grid gap-4 mt-2">
            {formFields}
            <Button type="submit">Actualizar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
