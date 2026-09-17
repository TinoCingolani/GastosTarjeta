import { useState, useEffect } from "react";
import { Mes, Gasto } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GastoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialData?: Gasto | null;
  meses: Mes[];
  onSubmit: (data: any) => Promise<boolean>;
}

export function GastoFormDialog({
  open,
  onOpenChange,
  title,
  initialData,
  meses,
  onSubmit,
}: GastoFormDialogProps) {
  const [formGasto, setFormGasto] = useState({
    mes_id: "",
    fecha_compra: "",
    descripcion: "",
    cuota_actual: 1,
    total_cuotas: 1,
    monto: "",
    estado: "Finalizado",
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormGasto({
          mes_id: initialData.mes_id,
          fecha_compra: initialData.fecha_compra,
          descripcion: initialData.descripcion,
          cuota_actual: initialData.cuota_actual,
          total_cuotas: initialData.total_cuotas,
          monto: String(initialData.monto),
          estado: initialData.estado,
        });
      } else {
        setFormGasto({
          mes_id: "",
          fecha_compra: "",
          descripcion: "",
          cuota_actual: 1,
          total_cuotas: 1,
          monto: "",
          estado: "Finalizado",
        });
      }
    }
  }, [open, initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = await onSubmit({
      ...formGasto,
      monto: parseFloat(formGasto.monto),
      cuota_actual: Number(formGasto.cuota_actual),
      total_cuotas: Number(formGasto.total_cuotas),
    });
    if (success) {
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-2">
          <div className="grid gap-2">
            <Label htmlFor="mes_id">Mes destino</Label>
            <Select
              value={formGasto.mes_id}
              onValueChange={(v) => setFormGasto((p) => ({ ...p, mes_id: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar mes" />
              </SelectTrigger>
              <SelectContent>
                {meses.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.nombre} {m.anio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fecha_compra">Fecha de compra (DD/MM)</Label>
            <Input
              id="fecha_compra"
              placeholder="15/04"
              value={formGasto.fecha_compra}
              onChange={(e) =>
                setFormGasto((p) => ({ ...p, fecha_compra: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              placeholder="Supermercado, Netflix, etc."
              value={formGasto.descripcion}
              onChange={(e) =>
                setFormGasto((p) => ({ ...p, descripcion: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cuota_actual">Cuota actual</Label>
              <Input
                id="cuota_actual"
                type="number"
                min={1}
                value={formGasto.cuota_actual}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormGasto((p) => ({
                    ...p,
                    cuota_actual: val,
                    estado: val === p.total_cuotas ? "Finalizado" : "En curso",
                  }));
                }}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="total_cuotas">Total cuotas</Label>
              <Input
                id="total_cuotas"
                type="number"
                min={1}
                value={formGasto.total_cuotas}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormGasto((p) => ({
                    ...p,
                    total_cuotas: val,
                    estado: p.cuota_actual === val ? "Finalizado" : "En curso",
                  }));
                }}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="monto">Monto</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formGasto.monto}
              onChange={(e) =>
                setFormGasto((p) => ({ ...p, monto: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={formGasto.estado}
              onValueChange={(v) => setFormGasto((p) => ({ ...p, estado: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En curso">En curso</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">{initialData ? "Actualizar" : "Guardar"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
