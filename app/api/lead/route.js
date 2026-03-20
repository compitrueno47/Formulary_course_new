import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  try {
    const body = await req.json()

    const {
      nombre,
      apellidos,
      direccion,
      codigo_postal,
      telefono,
      email,
      accepted_privacy,
    } = body

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          nombre,
          apellidos,
          direccion,
          codigo_postal,
          telefono,
          email,
          accepted_privacy,
        },
      ])
      .select()

    if (error) {
      console.error('SUPABASE ERROR:', error)
      return NextResponse.json(
        { error: `Supabase: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: 'Guardado en Supabase correctamente',
      data,
    })
  } catch (err) {
    console.error('SERVER ERROR:', err)
    return NextResponse.json(
      { error: err.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}