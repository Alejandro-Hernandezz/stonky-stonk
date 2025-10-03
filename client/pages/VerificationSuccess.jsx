import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function VerificationSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al login después de 3 segundos
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
        backgroundColor: '#f0fdf4',
        border: '2px solid #86efac'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h1 style={{ color: '#166534', marginBottom: '16px' }}>
          ¡Cuenta Verificada!
        </h1>
        <p style={{ color: '#15803d', marginBottom: '24px' }}>
          Tu correo electrónico ha sido verificado exitosamente.
          Ya puedes iniciar sesión en StonkyStonk.
        </p>
        <p style={{ color: '#16a34a', fontSize: '14px' }}>
          Redirigiendo al login en 3 segundos...
        </p>
      </div>
    </div>
  );
}

export default VerificationSuccess;