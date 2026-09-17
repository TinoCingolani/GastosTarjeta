"use client";

import { useState } from "react";
import { Gasto } from "@/types";
import { Toaster } from "@/components/ui/sonner";

import { useMeses } from "@/hooks/use-meses";
import { useGastos } from "@/hooks/use-gastos";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { MesesList } from "@/components/dashboard/MesesList";
import { GastoFormDialog } from "@/components/gastos/GastoFormDialog";

export default function Dashboard() {
  const { meses, sortedMeses, loadingMeses, fetchMeses } = useMeses();
  const {
    loadingGastos,
    addGasto,
    editGasto,
    deleteGasto,
    toggleEstado,
    gastosPorMes,
    totalMes,
    totalGastado,
    gastos,
  } = useGastos();

  const [openAddGasto, setOpenAddGasto] = useState(false);
  const [openEditGasto, setOpenEditGasto] = useState(false);
  const [editingGasto, setEditingGasto] = useState<Gasto | null>(null);

  const loading = loadingMeses || loadingGastos;

  function handleOpenEdit(gasto: Gasto) {
    setEditingGasto(gasto);
    setOpenEditGasto(true);
  }

  return (
    <div className="min-h-screen text-foreground">
      <Toaster position="top-right" richColors />

      <DashboardHeader onAddGasto={() => setOpenAddGasto(true)} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <DashboardMetrics
          loading={loading}
          meses={meses}
          gastos={gastos}
        />

        <MesesList
          loading={loading}
          sortedMeses={sortedMeses}
          gastosPorMes={gastosPorMes}
          totalMes={totalMes}
          onEditGasto={handleOpenEdit}
          onDeleteGasto={deleteGasto}
          onToggleEstadoGasto={toggleEstado}
        />
      </main>

      <GastoFormDialog
        open={openAddGasto}
        onOpenChange={setOpenAddGasto}
        title="Nuevo gasto"
        meses={sortedMeses}
        onSubmit={async (data) => {
          const success = await addGasto(data);
          if (success && data.total_cuotas > 1) {
            fetchMeses();
          }
          return success;
        }}
      />

      <GastoFormDialog
        open={openEditGasto}
        onOpenChange={(open) => {
          setOpenEditGasto(open);
          if (!open) setEditingGasto(null);
        }}
        title="Editar gasto"
        initialData={editingGasto}
        meses={sortedMeses}
        onSubmit={(data) => {
          if (editingGasto) {
            return editGasto(editingGasto.id, data);
          }
          return Promise.resolve(false);
        }}
      />
    </div>
  );
}
