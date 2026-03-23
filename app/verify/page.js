export default function VerifySuccessPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      padding: "20px"
    }}>
      
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "40px",
        maxWidth: "500px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        
        {/* ICONO */}
        <div style={{
          fontSize: "50px",
          marginBottom: "20px"
        }}>
          ✅
        </div>

        {/* TITULO */}
        <h1 style={{
          fontSize: "26px",
          marginBottom: "10px",
          color: "#0f172a"
        }}>
          ¡Correo verificado!
        </h1>

        {/* SUBTITULO */}
        <p style={{
          color: "#475569",
          marginBottom: "25px",
          fontSize: "15px"
        }}>
          Gracias por confirmar tu email. Ya formas parte del proceso.
        </p>

        {/* TEXTO PRINCIPAL */}
        <div style={{
          background: "#f1f5f9",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "25px",
          fontSize: "14px",
          color: "#334155"
        }}>
          📩 En breve recibirás un correo con:
          <br /><br />
          ✔️ Fecha de la sesión  
          ✔️ Hora exacta  
          ✔️ Enlace de acceso  
        </div>

        {/* TEXTO EXTRA */}
        <p style={{
          fontSize: "13px",
          color: "#64748b",
          marginBottom: "30px"
        }}>
          Asegúrate de revisar tu bandeja de entrada (y spam por si acaso).
        </p>

        {/* BOTÓN */}
        <a href="/" style={{
          display: "inline-block",
          background: "#0f172a",
          color: "#fff",
          padding: "12px 25px",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          Volver a la página
        </a>

      </div>
    </div>
  );
}