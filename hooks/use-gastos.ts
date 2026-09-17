import { useState, useEffect } from "react";
import { Gasto } from "@/types";
import { toast } from "sonner";

export function useGastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGastos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gastos");
      const data = await res.json();
      if (res.ok) {
        setGastos(data);
      }
    } catch {
      toast.error("Error al cargar los gastos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  const addGasto = async (gastoData: any) => {
    const res = await fetch("/api/gastos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gastoData),
    });
    if (res.ok) {
      const newGastos = await res.json();
      setGastos((prev) => [...prev, ...newGastos]);
      toast.success(newGastos.length > 1 ? `${newGastos.length} cuotas agregadas` : "Gasto agregado correctamente");
      return true;
    } else {
      toast.error("Error al agregar gasto");
      return false;
    }
  };

  const editGasto = async (id: string, gastoData: any) => {
    const res = await fetch(`/api/gastos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gastoData),
    });
    if (res.ok) {
      const updated = await res.json();
      setGastos((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
      toast.success("Gasto actualizado correctamente");
      return true;
    } else {
      toast.error("Error al actualizar gasto");
      return false;
    }
  };

  const deleteGasto = async (gasto: Gasto, bulk: boolean = false) => {
    const url = bulk && gasto.compra_id 
      ? `/api/gastos/${gasto.id}?bulk=true&compra_id=${gasto.compra_id}` 
      : `/api/gastos/${gasto.id}`;
      
    const res = await fetch(url, { method: "DELETE" });
    if (res.ok) {
      if (bulk && gasto.compra_id) {
        setGastos((prev) => prev.filter((g) => g.compra_id !== gasto.compra_id));
      } else {
        setGastos((prev) => prev.filter((g) => g.id !== gasto.id));
      }
      toast.success(bulk ? "Todas las cuotas eliminadas" : "Gasto eliminado");
      return true;
    } else {
      toast.error("Error al eliminar gasto");
      return false;
    }
  };

  const toggleEstado = async (gasto: Gasto) => {
    const nuevoEstado = gasto.estado === "En curso" ? "Finalizado" : "En curso";
    const res = await fetch(`/api/gastos/${gasto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (res.ok) {
      setGastos((prev) =>
        prev.map((g) => (g.id === gasto.id ? { ...g, estado: nuevoEstado } : g))
      );
      toast.success(`Estado cambiado a ${nuevoEstado}`);
      return true;
    } else {
      toast.error("Error al cambiar estado");
      return false;
    }
  };

  const gastosPorMes = (mesId: string) => gastos.filter((g) => g.mes_id === mesId);
  const totalMes = (mesId: string) => gastosPorMes(mesId).reduce((sum, g) => sum + Number(g.monto), 0);
  const totalGastado = gastos.reduce((sum, g) => sum + Number(g.monto), 0);

  return {
    gastos,
    loadingGastos: loading,
    fetchGastos,
    addGasto,
    editGasto,
    deleteGasto,
    toggleEstado,
    gastosPorMes,
    totalMes,
    totalGastado,
  };
}
