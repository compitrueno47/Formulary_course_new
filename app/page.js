'use client';

import { useMemo, useState } from 'react';

const initialForm = {
  nombre: '',
  apellidos: '',
  direccion: '',
  codigoPostal: '',
  telefono: '',
  email: '',
  acceptedPrivacy: false,
};

export default function HomePage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => {
    return (
      form.nombre &&
      form.apellidos &&
      form.direccion &&
      form.codigoPostal &&
      form.telefono &&
      form.email &&
      form.acceptedPrivacy
    );
  }, [form]);

  const updateField = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo completar el registro');
      }

      setMessage(
        'Registro completado. Revisa tu correo y pulsa en el enlace de verificación para confirmar que es real.'
      );
      setForm(initialForm);
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div
        style={{
          width: '100%',
          maxWidth: 860,
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <section style={{ background: '#111827', color: '#fff', padding: 32 }}>
          <p style={{ margin: 0, opacity: 0.85 }}>Curso · sesión informativa</p>
          <h1 style={{ margin: '10px 0 8px', fontSize: 34 }}>Reserva tu plaza</h1>
          <p style={{ margin: 0, maxWidth: 620, lineHeight: 1.6, opacity: 0.9 }}>
            Déjanos tus datos y te enviaremos toda la información, la fecha de la reunión y el enlace de acceso.
          </p>
        </section>

        <section style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              <Field label="Nombre" name="nombre" value={form.nombre} onChange={updateField} />
              <Field label="Apellidos" name="apellidos" value={form.apellidos} onChange={updateField} />
            </div>

            <Field label="Dirección completa" name="direccion" value={form.direccion} onChange={updateField} />

            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              <Field label="Código postal" name="codigoPostal" value={form.codigoPostal} onChange={updateField} />
              <Field label="Teléfono" name="telefono" value={form.telefono} onChange={updateField} />
            </div>

            <Field
              label="Correo electrónico"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              help="Es el dato más importante: aquí recibirán la verificación y el enlace de la sesión."
            />

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                background: '#f9fafb',
                padding: 16,
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                lineHeight: 1.5,
              }}
            >
              <input
                type="checkbox"
                name="acceptedPrivacy"
                checked={form.acceptedPrivacy}
                onChange={updateField}
                style={{ marginTop: 4 }}
              />
              <span>
                He leído y acepto la política de privacidad y el tratamiento de mis datos para recibir información sobre el curso, la sesión informativa y la verificación del correo electrónico.
              </span>
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <button
                type="submit"
                disabled={!canSubmit || loading}
                style={{
                  border: 'none',
                  background: canSubmit ? '#111827' : '#9ca3af',
                  color: '#fff',
                  padding: '14px 22px',
                  borderRadius: 12,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {loading ? 'Enviando...' : 'Quiero recibir información'}
              </button>

              {message ? <span style={{ color: '#047857' }}>{message}</span> : null}
              {error ? <span style={{ color: '#b91c1c' }}>{error}</span> : null}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function Field({ label, help, ...props }) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <span style={{ fontWeight: 700, color: '#111827' }}>{label}</span>
      <input
        {...props}
        required
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: 14,
          border: '1px solid #d1d5db',
          borderRadius: 12,
          fontSize: 16,
        }}
      />
      {help ? <small style={{ color: '#6b7280' }}>{help}</small> : null}
    </label>
  );
}
