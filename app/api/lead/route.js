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
      .from('pending_leads')
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
          },
        ],
        { onConflict: 'email' }
      )

    if (error) {
      return NextResponse.json(
        { error: `Supabase: ${error.message}` },
        { status: 500 }
      )
    }

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${verification_token}`

    const { error: mailError } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verifica tu correo para confirmar tu plaza',
      html: `
        <h2>Confirma tu correo</h2>
        <p>Hola ${nombre},</p>
        <p>Pulsa aquí para verificar tu email:</p>
        <p><a href="${verifyUrl}">Verificar correo</a></p>
        <p>Si no funciona, copia este enlace:</p>
        <p>${verifyUrl}</p>
      `,
    })

    if (mailError) {
      return NextResponse.json(
        { error: `Resend: ${mailError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: 'Te hemos enviado un correo de verificación.',
    })
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}