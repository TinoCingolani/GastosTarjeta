import { Gasto } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface GastosTableProps {
  gastos: Gasto[];
  totalMes: number;
  onEdit: (gasto: Gasto) => void;
  onDelete: (gasto: Gasto, bulk: boolean) => void;
  onToggleEstado: (gasto: Gasto) => void;
}

export function GastosTable({ gastos, totalMes, onEdit, onDelete, onToggleEstado }: GastosTableProps) {
  const [deleteDialogGasto, setDeleteDialogGasto] = useState<Gasto | null>(null);

  const confirmDelete = (gasto: Gasto) => {
    if (gasto.compra_id) {
      setDeleteDialogGasto(gasto);
    } else {
      if (confirm("¿Estás seguro de eliminar este gasto?")) {
        onDelete(gasto, false);
      }
    }
  };

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  }

  if (gastos.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground text-sm">
        No hay gastos registrados para este mes.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left py-2 px-3 font-medium">Fecha</th>
            <th className="text-left py-2 px-3 font-medium">Descripción</th>
            <th className="text-center py-2 px-3 font-medium">Cuota</th>
            <th className="text-right py-2 px-3 font-medium">Monto</th>
            <th className="text-center py-2 px-3 font-medium">Estado</th>
            <th className="text-right py-2 px-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((g) => (
            <tr
              key={g.id}
              className="border-b border-border/50 hover:bg-slate-800/40 transition-colors"
            >
              <td className="py-2.5 px-3 text-muted-foreground">
                {g.fecha_compra}
              </td>
              <td className="py-2.5 px-3 font-medium">
                {g.descripcion}
              </td>
              <td className="py-2.5 px-3 text-center text-muted-foreground">
                {g.cuota_actual}/{g.total_cuotas}
              </td>
              <td className="py-2.5 px-3 text-right font-semibold">
                {formatCurrency(Number(g.monto))}
              </td>
              <td className="py-2.5 px-3 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleEstado(g);
                  }}
                  className="cursor-pointer"
                >
                  <Badge
                    variant={g.estado === "Finalizado" ? "default" : "secondary"}
                    className="select-none hover:opacity-80 transition-opacity"
                  >
                    {g.estado}
                  </Badge>
                </button>
              </td>
              <td className="py-2.5 px-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(g);
                    }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(g);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-border">
            <td
              colSpan={3}
              className="py-3 px-3 font-semibold text-muted-foreground text-right"
            >
              Total mes:
            </td>
            <td className="py-3 px-3 text-right font-bold text-lg">
              {formatCurrency(totalMes)}
            </td>
            <td colSpan={2} />
          </tr>
        </tfoot>
      </table>

      <AlertDialog open={!!deleteDialogGasto} onOpenChange={(open) => !open && setDeleteDialogGasto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar gasto en cuotas</AlertDialogTitle>
            <AlertDialogDescription>
              Este gasto forma parte de una compra en cuotas. ¿Qué deseas hacer?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col gap-2 mt-4">
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteDialogGasto) onDelete(deleteDialogGasto, false);
                setDeleteDialogGasto(null);
              }}
            >
              Borrar solo esta cuota
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteDialogGasto) onDelete(deleteDialogGasto, true);
                setDeleteDialogGasto(null);
              }}
            >
              Borrar todas las cuotas
            </Button>
            <AlertDialogCancel onClick={() => setDeleteDialogGasto(null)}>
              Cancelar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
