import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('meses')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { data, error } = await supabase
    .from('meses')
    .update(body)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { data: gastos, error: gastosError } = await supabase
    .from('gastos')
    .select('id')
    .eq('mes_id', params.id);

  if (gastosError) {
    return NextResponse.json({ error: gastosError.message }, { status: 500 });
  }

  if (gastos && gastos.length > 0) {
    return NextResponse.json(
      { error: 'No se puede eliminar el mes porque tiene gastos asociados.' },
      { status: 400 }
    );
  }

  const { error } = await supabase.from('meses').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
