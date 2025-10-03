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
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Limpiar errores
    if (fieldErrors[id]) {
      setFieldErrors({ ...fieldErrors, [id]: '' });
    }
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = {};

    // Validar email
    const emailValue = formData.email.trim();
    if (!emailValue) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      errors.email = 'Ingresa un correo electrónico válido';
    }

    // Validar contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Formulario enviado'); // Debug
    console.log('Datos:', formData); // Debug
    
    setError('');
    setFieldErrors({});

    // Validar antes de continuar
    if (!validateForm()) {
      console.log('Validación falló'); // Debug
      return false;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

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
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {error && (
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">Error: </span>
                {error}
              </Alert>
            )}

            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Correo electrónico" />
              </div>
              <TextInput
                id="email"
                type="email"
                icon={HiMail}
                placeholder="nombre@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                color={fieldErrors.email ? 'failure' : undefined}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Contraseña" />
              </div>
              <TextInput
                id="password"
                type="password"
                icon={HiLockOpen}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                color={fieldErrors.password ? 'failure' : undefined}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
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
              className="w-full"
              color="blue"
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