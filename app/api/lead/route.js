import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { resend } from '../../../lib/resend';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      nombre,
      apellidos,
      direccion,
      codigoPostal,
      telefono,
      email,
      acceptedPrivacy,
    } = body;

    if (
      !nombre ||
      !apellidos ||
      !direccion ||
      !codigoPostal ||
      !telefono ||
      !email ||
      !acceptedPrivacy
    ) {
      return NextResponse.json({ error: 'Faltan campos obligatorios o la aceptación de privacidad.' }, { status: 400 });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/lead?token=${verificationToken}`;

    const { error: upsertError } = await supabaseAdmin.from('leads').upsert(
      {
        nombre,
        apellidos,
        direccion,
        codigo_postal: codigoPostal,
        telefono,
        email: email.toLowerCase(),
        accepted_privacy: true,
        verification_token: verificationToken,
        verified_at: null,
      },
      { onConflict: 'email' }
    );

    if (upsertError) {
      throw upsertError;
    }

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Confirma tu correo para recibir la información del curso',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Hola ${nombre},</h2>
          <p>Gracias por registrarte. Para confirmar que tu correo es real y poder enviarte la información de la sesión, pulsa en el siguiente botón:</p>
          <p>
            <a href="${verificationUrl}" style="background:#111827;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block">
              Verificar correo
            </a>
          </p>
          <p>Si tú no has solicitado esta información, puedes ignorar este mensaje.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo guardar el lead o enviar el correo.' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/verify?status=error`);
    }

    const { data: lead, error: findError } = await supabaseAdmin
      .from('leads')
      .select('id, email')
      .eq('verification_token', token)
      .single();

    if (findError || !lead) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/verify?status=error`);
    }

    const { error: updateError } = await supabaseAdmin
      .from('leads')
      .update({ verified_at: new Date().toISOString(), verification_token: null })
      .eq('id', lead.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/verify?status=ok`);
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/verify?status=error`);
  }
}
