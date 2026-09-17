import { Mes, Gasto } from "@/types";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { GastosTable } from "@/components/gastos/GastosTable";

interface MesAccordionItemProps {
  mes: Mes;
  gastos: Gasto[];
  totalMes: number;
  onEditGasto: (gasto: Gasto) => void;
  onDeleteGasto: (gasto: Gasto, bulk: boolean) => void;
  onToggleEstadoGasto: (gasto: Gasto) => void;
}

export function MesAccordionItem({
  mes,
  gastos,
  totalMes,
  onEditGasto,
  onDeleteGasto,
  onToggleEstadoGasto,
}: MesAccordionItemProps) {
  function formatCurrency(value: number) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  }

  return (
    <AccordionItem
      value={mes.id}
      className="border rounded-xl px-4 bg-card/40 data-[state=open]:bg-card/60 transition-colors"
    >
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
              {mes.nombre.slice(0, 3)}
            </div>
            <div className="text-left">
              <p className="font-semibold">
                {mes.nombre} {mes.anio}
              </p>
              <p className="text-xs text-muted-foreground">
                {mes.es_fecha_aproximada ? (
                  <span className="italic text-muted-foreground/80">Cierre estimado:</span>
                ) : (
                  <span>Cierre:</span>
                )}{" "}
                {new Date(mes.fecha_cierre).toLocaleDateString("es-AR", { timeZone: "UTC" })} · Vencimiento:{" "}
                {new Date(mes.fecha_vencimiento).toLocaleDateString("es-AR", { timeZone: "UTC" })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{formatCurrency(totalMes)}</p>
            <p className="text-xs text-muted-foreground">
              {gastos.length} gasto{gastos.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <GastosTable
          gastos={gastos}
          totalMes={totalMes}
          onEdit={onEditGasto}
          onDelete={onDeleteGasto}
          onToggleEstado={onToggleEstadoGasto}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
