/*
# Create Meses and Gastos tables for expense control platform

1. New Tables
- `meses` (Periods/Months)
  - `id` (uuid, primary key)
  - `nombre` (text, not null) — Month name e.g. 'ABRIL'
  - `anio` (integer, not null) — Year
  - `fecha_cierre` (date, not null) — Closing date
  - `fecha_vencimiento` (date, not null) — Due date
  - `created_at` (timestamptz, default now)
- `gastos` (Expenses)
  - `id` (uuid, primary key)
  - `mes_id` (uuid, not null, foreign key to meses.id)
  - `fecha_compra` (text, not null) — DD/MM format
  - `descripcion` (text, not null)
  - `cuota_actual` (integer, not null)
  - `total_cuotas` (integer, not null)
  - `monto` (numeric(12,2), not null)
  - `estado` (text, not null, default 'Pendiente')
  - `created_at` (timestamptz, default now)
2. Security
- Enable RLS on both tables.
- Allow anon + authenticated CRUD (single-tenant app, no auth required).
3. Indexes
- Index on gastos.mes_id for fast lookups.
- Index on meses.anio and meses.nombre for sorting.
*/

CREATE TABLE IF NOT EXISTS meses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  anio integer NOT NULL,
  fecha_cierre date NOT NULL,
  fecha_vencimiento date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gastos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mes_id uuid NOT NULL REFERENCES meses(id) ON DELETE CASCADE,
  fecha_compra text NOT NULL,
  descripcion text NOT NULL,
  cuota_actual integer NOT NULL,
  total_cuotas integer NOT NULL,
  monto numeric(12,2) NOT NULL,
  estado text NOT NULL DEFAULT 'Pendiente',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gastos_mes_id ON gastos(mes_id);
CREATE INDEX IF NOT EXISTS idx_meses_anio ON meses(anio);
CREATE INDEX IF NOT EXISTS idx_meses_nombre ON meses(nombre);

ALTER TABLE meses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;

-- Meses policies
DROP POLICY IF EXISTS "anon_select_meses" ON meses;
CREATE POLICY "anon_select_meses" ON meses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_meses" ON meses;
CREATE POLICY "anon_insert_meses" ON meses FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_meses" ON meses;
CREATE POLICY "anon_update_meses" ON meses FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_meses" ON meses;
CREATE POLICY "anon_delete_meses" ON meses FOR DELETE
  TO anon, authenticated USING (true);

-- Gastos policies
DROP POLICY IF EXISTS "anon_select_gastos" ON gastos;
CREATE POLICY "anon_select_gastos" ON gastos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_gastos" ON gastos;
CREATE POLICY "anon_insert_gastos" ON gastos FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_gastos" ON gastos;
CREATE POLICY "anon_update_gastos" ON gastos FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_gastos" ON gastos;
CREATE POLICY "anon_delete_gastos" ON gastos FOR DELETE
  TO anon, authenticated USING (true);
