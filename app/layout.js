export const metadata = {
  title: 'Inscripción sesión informativa',
  description: 'Formulario de registro para personas interesadas en el curso',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#f5f7fb' }}>
        {children}
      </body>
    </html>
  );
}
