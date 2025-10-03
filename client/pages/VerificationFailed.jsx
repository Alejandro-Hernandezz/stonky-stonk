import { useNavigate } from 'react-router-dom';

function VerificationFailed() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '500px', 
        padding: '40px', 
        borderRadius: '10px',
        backgroundColor: '#fef2f2',
        border: '2px solid #fca5a5'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
        <h1 style={{ color: '#991b1b', marginBottom: '16px' }}>
          Verificación Fallida
        </h1>
        <p style={{ color: '#dc2626', marginBottom: '24px' }}>
          El enlace de verificación es inválido o ha expirado.
        </p>
        <p style={{ color: '#b91c1c', marginBottom: '32px', fontSize: '14px' }}>
          Los enlaces de verificación son válidos por 24 horas.
        </p>
        <button
          onClick={() => navigate('/register')}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Volver a Registrarse
        </button>
      </div>
    </div>
  );
}

export default VerificationFailed;