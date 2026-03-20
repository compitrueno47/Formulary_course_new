import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import crypto from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const body = await req.json()

    const nombre = body.nombre
    const apellidos = body.apellidos
    const direccion = body.direccion
    const codigo_postal = body.codigo_postal || body.codigoPostal
    const telefono = body.telefono
    const email = body.email
    const accepted_privacy =
      body.accepted_privacy ?? body.acceptedPrivacy ?? false

    const verification_token = crypto.randomBytes(24).toString('hex')

    const { error } = await supabase
      .from('leads')
      .upsert(
        [
          {
            nombre,
            apellidos,
            direccion,
            codigo_postal,
            telefono,
            email,
            accepted_privacy,
            verification_token,
            verified_at: null,
          },
        ],
        { onConflict: 'email' }
      )

    if (error) {
      console.error('SUPABASE ERROR:', error)
      return NextResponse.json(
        { error: `Supabase: ${error.message}` },
        { status: 500 }
      )
    }

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${verification_token}`

    const mail = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verifica tu correo para confirmar tu plaza',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Confirma tu correo electrónico</h2>
          <p>Hola ${nombre},</p>
          <p>Gracias por registrarte. Para confirmar tu plaza y recibir la información de la sesión, verifica tu correo haciendo clic aquí:</p>
          <p>
            <a href="${verifyUrl}" style="display:inline-block;padding:12px 20px;background:#0f172a;color:#ffffff;text-decoration:none;border-radius:8px;">
              Verificar correo
            </a>
          </p>
          <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
          <p>${verifyUrl}</p>
        </div>
      `,
    })

    if (mail.error) {
      console.error('RESEND ERROR:', mail.error)
      return NextResponse.json(
        { error: `Resend: ${mail.error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: 'Tus datos se han guardado y te hemos enviado un correo de verificación.',
    })
  } catch (err) {
    console.error('SERVER ERROR:', err)
    return NextResponse.json(
      { error: err.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}