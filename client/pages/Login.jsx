import { useState } from 'react';
import { Card, TextInput, Button, Label, Alert } from 'flowbite-react';
import { HiMail, HiLockOpen, HiInformationCircle } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar token en localStorage
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">StonkyStonk</h1>
          <p className="text-gray-600">Controla tus finanzas de manera inteligente</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">Error: </span>
                {error}
              </Alert>
            )}

            <div>
              <Label htmlFor="email" value="Correo electrónico" />
              <TextInput
                id="email"
                type="email"
                icon={HiMail}
                placeholder="nombre@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password" value="Contraseña" />
              <TextInput
                id="password"
                type="password"
                icon={HiLockOpen}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <Link 
                to="/request-reset" 
                className="text-sm text-blue-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>

            <div className="text-sm text-center text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Regístrate ahora
              </Link>
            </div>
          </form>
        </Card>

        <p className="text-center text-xs text-gray-500">
          Al iniciar sesión, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
}