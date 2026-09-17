import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Target, Wallet } from "lucide-react";
import { Mes, Gasto } from "@/types";

interface DashboardMetricsProps {
  loading: boolean;
  meses: Mes[];
  gastos: Gasto[];
}

const MONTHS = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

export function DashboardMetrics({
  loading,
  meses,
  gastos,
}: DashboardMetricsProps) {
  function formatCurrency(value: number) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  }

  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonthName = MONTHS[currentMonthIndex];

  let prevMonthIndex = currentMonthIndex - 1;
  let prevYear = currentYear;
  if (prevMonthIndex < 0) {
    prevMonthIndex = 11;
    prevYear--;
  }
  const prevMonthName = MONTHS[prevMonthIndex];

  // Buscar si existen los meses en la base de datos
  const mesActual = meses.find(m => m.nombre.toUpperCase() === currentMonthName && m.anio === currentYear);
  const mesAnterior = meses.find(m => m.nombre.toUpperCase() === prevMonthName && m.anio === prevYear);

  // Filtrar gastos
  const gastosMesActual = mesActual ? gastos.filter(g => g.mes_id === mesActual.id) : [];
  const gastosMesAnterior = mesAnterior ? gastos.filter(g => g.mes_id === mesAnterior.id) : [];

  const totalActual = gastosMesActual.reduce((sum, g) => sum + Number(g.monto), 0);
  const totalAnterior = gastosMesAnterior.reduce((sum, g) => sum + Number(g.monto), 0);

  // Tarjeta 1: Margen Disponible
  let colorClass = "text-green-500";
  if (totalActual > 50000) {
    colorClass = "text-red-500";
  } else if (totalActual > 35000) {
    colorClass = "text-orange-500";
  }

  // Tarjeta 2: Terminan Este Mes
  const comprasQueTerminan = gastosMesActual.filter(
    g => g.estado === "Finalizado" || g.cuota_actual === g.total_cuotas
  );
  const totalLiberado = comprasQueTerminan.reduce((sum, g) => sum + Number(g.monto), 0);
  const countTerminan = comprasQueTerminan.length;

  // Tarjeta 3: Tendencia vs Mes Anterior
  let porcentajeDiff = 0;
  let tendenciaNeutral = false;

  if (totalAnterior === 0 || !mesAnterior) {
    tendenciaNeutral = true;
  } else {
    porcentajeDiff = ((totalActual - totalAnterior) / totalAnterior) * 100;
  }

  // Para capitalizar el nombre del mes anterior
  const capitalizedPrevMonth = (mesAnterior?.nombre || prevMonthName).charAt(0).toUpperCase() + (mesAnterior?.nombre || prevMonthName).slice(1).toLowerCase();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Tarjeta 1: Margen Disponible */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Margen Disponible
          </CardTitle>
          <Target className="w-4 h-4 text-violet-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${colorClass}`}>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              formatCurrency(totalActual)
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Límite ideal: $35.000
          </p>
        </CardContent>
      </Card>

      {/* Tarjeta 2: Terminan Este Mes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Terminan Este Mes
          </CardTitle>
          <Wallet className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              `${countTerminan} compras`
            )}
          </div>
          <p className="text-xs text-green-500 mt-1">
            Libera {formatCurrency(totalLiberado)} para el próximo mes
          </p>
        </CardContent>
      </Card>

      {/* Tarjeta 3: Termómetro de Consumo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tendencia vs Mes Anterior
          </CardTitle>
          {tendenciaNeutral ? null : porcentajeDiff > 0 ? (
            <TrendingUp className="w-4 h-4 text-red-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-green-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : tendenciaNeutral ? (
              <span className="text-lg text-muted-foreground font-normal">Sin datos previos</span>
            ) : (
              <div className="flex items-center gap-1">
                <span className={porcentajeDiff > 0 ? "text-red-500" : "text-green-500"}>
                  {Math.abs(Math.round(porcentajeDiff))}%
                </span>
                <span className="text-muted-foreground text-sm font-normal">
                  {porcentajeDiff > 0 ? "más" : "menos"} que {capitalizedPrevMonth}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
