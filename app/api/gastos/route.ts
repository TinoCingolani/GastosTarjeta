import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const MONTHS = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

export async function GET() {
  const { data, error } = await supabase
    .from('gastos')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { mes_id, total_cuotas } = body;

  if (!total_cuotas || total_cuotas <= 1) {
    const { data, error } = await supabase.from('gastos').insert({
       ...body,
       cuota_actual: 1
    }).select().single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json([data], { status: 201 });
  }

  const { data: initialMonth, error: monthError } = await supabase
    .from('meses')
    .select('*')
    .eq('id', mes_id)
    .single();

  const compra_id = crypto.randomUUID();

  if (monthError) {
    return NextResponse.json({ error: monthError.message }, { status: 500 });
  }

  let currentMonthIndex = MONTHS.indexOf(initialMonth.nombre.toUpperCase());
  let currentYear = initialMonth.anio;
  
  let currentDate = new Date(`${initialMonth.fecha_cierre}T12:00:00Z`);
  let due = new Date(`${initialMonth.fecha_vencimiento}T12:00:00Z`);

  const start_cuota = body.cuota_actual ? Number(body.cuota_actual) : 1;
  const createdGastos = [];
  
  for (let i = start_cuota; i <= total_cuotas; i++) {
    let targetMesId = mes_id;

    if (i > start_cuota) {
      currentMonthIndex++;
      if (currentMonthIndex > 11) {
        currentMonthIndex = 0;
        currentYear++;
      }
      const targetMonthName = MONTHS[currentMonthIndex];

      const { data: existingMonth } = await supabase
        .from('meses')
        .select('*')
        .ilike('nombre', targetMonthName)
        .eq('anio', currentYear)
        .single();

      if (existingMonth) {
        targetMesId = existingMonth.id;
        currentDate = new Date(`${existingMonth.fecha_cierre}T12:00:00Z`);
        due = new Date(`${existingMonth.fecha_vencimiento}T12:00:00Z`);
      } else {
        currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
        due.setUTCMonth(due.getUTCMonth() + 1);
        
        const newMonthData = {
          nombre: targetMonthName,
          anio: currentYear,
          fecha_cierre: currentDate.toISOString().split('T')[0],
          fecha_vencimiento: due.toISOString().split('T')[0],
          es_fecha_aproximada: true,
        };

        const { data: newMonth, error: createError } = await supabase
          .from('meses')
          .insert(newMonthData)
          .select()
          .single();

        if (createError) {
          return NextResponse.json({ error: createError.message }, { status: 500 });
        }
        targetMesId = newMonth.id;
      }
    }

    const { data: insertedGasto, error: gastoError } = await supabase.from('gastos').insert({
      ...body,
      mes_id: targetMesId,
      cuota_actual: i,
      compra_id
    }).select().single();

    if (gastoError) {
       return NextResponse.json({ error: gastoError.message }, { status: 500 });
    }
    createdGastos.push(insertedGasto);
  }

  return NextResponse.json(createdGastos, { status: 201 });
}
