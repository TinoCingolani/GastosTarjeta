export type Mes = {
  id: string;
  nombre: string;
  anio: number;
  fecha_cierre: string;
  fecha_vencimiento: string;
  es_fecha_aproximada?: boolean;
  created_at: string;
};

export type Gasto = {
  id: string;
  mes_id: string;
  fecha_compra: string;
  descripcion: string;
  cuota_actual: number;
  total_cuotas: number;
  monto: number;
  estado: string;
  compra_id?: string | null;
  created_at: string;
};
