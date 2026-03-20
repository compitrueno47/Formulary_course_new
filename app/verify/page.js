import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function VerifyPage({ searchParams }) {
  const token = searchParams.token

  if (!token) {
    return <div style={{ padding: 40 }}>Token no válido.</div>
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data, error } = await supabase
    .from('leads')
    .update({
      verified_at: new Date().toISOString(),
      verification_token: null,
    })
    .eq('verification_token', token)
    .select()

  if (error || !data || data.length === 0) {
    return <div style={{ padding: 40 }}>No se pudo verificar el correo.</div>
  }

  return (
    <div style={{ padding: 40, fontFamily: 'Arial, sans-serif' }}>
      <h1>Correo verificado correctamente</h1>
      <p>Ya estás confirmado y recibirás la información de la sesión.</p>
    </div>
  )
}
