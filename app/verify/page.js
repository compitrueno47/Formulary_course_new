export default function VerifyPage({ searchParams }) {
  const ok = searchParams?.status === 'ok';

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: 620, background: '#fff', padding: 32, borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
        <h1>{ok ? 'Correo verificado' : 'No se pudo verificar el correo'}</h1>
        <p style={{ lineHeight: 1.6 }}>
          {ok
            ? 'Tu correo ha quedado verificado correctamente. A partir de ahora recibirás la información de la sesión y el enlace de acceso.'
            : 'El enlace no es válido o ha caducado. Pide un nuevo correo de verificación.'}
        </p>
      </div>
    </main>
  );
}
