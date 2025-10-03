import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DollarSign } from 'lucide-react';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/auth/verify-email/${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Token inválido o expirado');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error al verificar el correo');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 border border-green-700 rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <DollarSign className="h-16 w-16 text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">StonkyStonk</h1>

        {status === 'verifying' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-green-300 text-lg">Verificando tu correo electrónico...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="bg-green-900/50 border border-green-700 rounded-lg p-6 mb-6">
              <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-2">¡Correo Verificado!</h2>
              <p className="text-green-300">{message}</p>
            </div>
            <p className="text-gray-400 mb-4">Serás redirigido al login en 3 segundos...</p>
            <Link 
              to="/"
              className="inline-block bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-8 rounded-lg hover:from-green-500 hover:to-green-400 transition-all duration-200 font-semibold"
            >
              Ir al Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 mb-6">
              <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-2">Error de Verificación</h2>
              <p className="text-red-300">{message}</p>
            </div>
            <Link 
              to="/"
              className="inline-block bg-gradient-to-r from-gray-600 to-gray-500 text-white py-3 px-8 rounded-lg hover:from-gray-500 hover:to-gray-400 transition-all duration-200 font-semibold"
            >
              Volver al Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}