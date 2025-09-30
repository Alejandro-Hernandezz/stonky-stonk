import { Card, TextInput, Button, Label } from 'flowbite-react';
import { HiMail, HiLockOpen } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">StonkyStonk</h1>
          <p className="text-gray-600">Controla tus finanzas de manera inteligente</p>
        </div>
        <Card>
          <form className="space-y-6">
            <div>
              <Label htmlFor="email" value="Correo electrónico" />
              <TextInput
                id="email"
                type="email"
                icon={HiMail}
                placeholder="nombre@ejemplo.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" value="Contraseña" />
              <TextInput
                id="password"
                type="password"
                icon={HiLockOpen}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Iniciar sesión
            </Button>
            <div className="text-sm text-center text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Regístrate ahora
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}