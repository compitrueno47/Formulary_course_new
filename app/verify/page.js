import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function VerifyPage({ searchParams }) {
  const token = searchParams?.token

  if (!token) {
    return <div style={{ padding: 40 }}>Token no válido.</div>
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: pending, error: pendingError } = await supabase
    .from('pending_leads')
    .select('*')
    .eq('verification_token', token)
    .single()

  if (pendingError || !pending) {
    return <div style={{ padding: 40 }}>No se pudo verificar el correo.</div>
  }

  const { error: insertError } = await supabase
    .from('leads')
    .upsert(
      [
        {
          nombre: pending.nombre,
          apellidos: pending.apellidos,
          direccion: pending.direccion,
          codigo_postal: pending.codigo_postal,
          telefono: pending.telefono,
          email: pending.email,
          accepted_privacy: pending.accepted_privacy,
          verification_token: null,
          verified_at: new Date().toISOString(),
        },
      ],
      { onConflict: 'email' }
    )

  if (insertError) {
    return <div style={{ padding: 40 }}>No se pudo guardar el registro final.</div>
  }

  await supabase
    .from('pending_leads')
    .delete()
    .eq('id', pending.id)

  return (
    <div style={{ padding: 40, fontFamily: 'Arial, sans-serif' }}>
      <h1>Correo verificado correctamente</h1>
      <p>Ya estás registrado y recibirás la información de la sesión.</p>
    </div>
  )
}