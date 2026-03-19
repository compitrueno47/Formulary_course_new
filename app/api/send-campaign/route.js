import { NextResponse } from 'next/server';
import { resend } from '../../../lib/resend';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { openai } from '../../../lib/openai';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      sessionTitle,
      sessionDate,
      sessionLink,
      extraInfo,
      audienceDescription = 'personas interesadas en el curso',
    } = body;

    if (!sessionTitle || !sessionDate || !sessionLink) {
      return NextResponse.json({ error: 'Faltan datos de la campaña.' }, { status: 400 });
    }

    const { data: leads, error } = await supabaseAdmin
      .from('leads')
      .select('nombre, email')
      .not('verified_at', 'is', null);

    if (error) {
      throw error;
    }

    if (!leads?.length) {
      return NextResponse.json({ error: 'No hay correos verificados todavía.' }, { status: 400 });
    }

    const ai = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: `Redacta un correo breve, claro y cercano en español para ${audienceDescription}. Debe informar de una sesión titulada "${sessionTitle}", celebrada el ${sessionDate}, con este enlace: ${sessionLink}. Información adicional: ${extraInfo || 'ninguna'}. Devuelve solo HTML sencillo con saludo, resumen y llamada a la acción.`,
    });

    const html = ai.output_text || `<p>Hola,</p><p>Te enviamos la información de la sesión <strong>${sessionTitle}</strong>.</p><p>Fecha: ${sessionDate}</p><p>Enlace: <a href="${sessionLink}">${sessionLink}</a></p>`;

    const results = [];

    for (const lead of leads) {
      const personalizedHtml = html.replace(/Hola,/i, `Hola ${lead.nombre},`);
      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: lead.email,
        subject: `Información de la sesión: ${sessionTitle}`,
        html: personalizedHtml,
      });
      results.push(result);
    }

    return NextResponse.json({ ok: true, sent: leads.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo enviar la campaña.' }, { status: 500 });
  }
}
