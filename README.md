<<<<<<< HEAD
# Landing web para captar interesados en un curso

Proyecto hecho con Next.js + Supabase + Resend + OpenAI.

## Qué hace

- Formulario con nombre, apellidos, dirección completa, código postal, teléfono y correo.
- Casilla obligatoria de aceptación de política de privacidad.
- Guarda los registros en Supabase.
- Envía un correo de verificación al instante.
- Solo marca como válidos los correos que pulsan el enlace.
- Permite enviar campañas a todos los correos verificados usando IA para redactar el mensaje.

## Instalación

```bash
npm install
npm run dev
```

## Variables de entorno

Copia `.env.example` a `.env.local` y rellena los valores.

## Base de datos

Ejecuta el contenido de `supabase.sql` en el editor SQL de Supabase.

## Envío de campañas

Haz una petición POST a `/api/send-campaign` con este JSON:

```json
{
  "sessionTitle": "Sesión informativa del curso",
  "sessionDate": "25 de marzo de 2026 a las 19:00",
  "sessionLink": "https://tu-enlace.com/reunion",
  "extraInfo": "Duración aproximada: 45 minutos"
}
```

## Aviso importante

Antes de publicar, sustituye el texto legal por tus datos reales y revísalo con un profesional si vas a usarlo comercialmente.
=======
# Formulary_course
Es un formulario para tiktok para que la gente se registre en el curso.
>>>>>>> 825dddfd26b6d2e127b351ffcd2f4a3e09f1cdc0
