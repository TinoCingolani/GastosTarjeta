import { useState, useEffect } from "react";
import { Mes } from "@/types";
import { toast } from "sonner";

const monthOrder: Record<string, number> = {
  ENERO: 1, FEBRERO: 2, MARZO: 3, ABRIL: 4, MAYO: 5, JUNIO: 6,
  JULIO: 7, AGOSTO: 8, SEPTIEMBRE: 9, OCTUBRE: 10, NOVIEMBRE: 11, DICIEMBRE: 12,
};

export function useMeses() {
  const [meses, setMeses] = useState<Mes[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/meses");
      const data = await res.json();
      if (res.ok) {
        setMeses(data);
      }
    } catch {
      toast.error("Error al cargar los meses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeses();
  }, []);

  const sortedMeses = [...meses].sort((a, b) => {
    if (a.anio !== b.anio) return a.anio - b.anio;
    return (monthOrder[a.nombre] || 0) - (monthOrder[b.nombre] || 0);
  });

  return { meses, sortedMeses, loadingMeses: loading, fetchMeses };
}
