import { Mes, Gasto } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import { CreditCard } from "lucide-react";
import { MesAccordionItem } from "@/components/meses/MesAccordionItem";

interface MesesListProps {
  loading: boolean;
  sortedMeses: Mes[];
  gastosPorMes: (mesId: string) => Gasto[];
  totalMes: (mesId: string) => number;
  onEditGasto: (gasto: Gasto) => void;
  onDeleteGasto: (gasto: Gasto, bulk: boolean) => void;
  onToggleEstadoGasto: (gasto: Gasto) => void;
}

export function MesesList({
  loading,
  sortedMeses,
  gastosPorMes,
  totalMes,
  onEditGasto,
  onDeleteGasto,
  onToggleEstadoGasto,
}: MesesListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (sortedMeses.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">No hay períodos configurados</p>
        <p className="text-sm">
          Ve a la sección de Períodos para agregar meses.
        </p>
      </div>
    );
  }

  const MONTHS = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];
  
  const currentDate = new Date();
  const currentMonthName = MONTHS[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  
  const mesActual = sortedMeses.find(
    m => m.nombre.toUpperCase() === currentMonthName && m.anio === currentYear
  );

  return (
    <Accordion 
      type="multiple" 
      className="space-y-3"
      defaultValue={mesActual ? [mesActual.id] : []}
    >
      {sortedMeses.map((mes) => (
        <MesAccordionItem
          key={mes.id}
          mes={mes}
          gastos={gastosPorMes(mes.id)}
          totalMes={totalMes(mes.id)}
          onEditGasto={onEditGasto}
          onDeleteGasto={onDeleteGasto}
          onToggleEstadoGasto={onToggleEstadoGasto}
        />
      ))}
    </Accordion>
  );
}
