import React, { useState, useEffect } from 'react';
import VerificationSuccess from '../pages/VerificationSuccess.jsx';
import VerificationFailed from '../pages/VerificationFailed.jsx';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Target,
  FileText,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Menu,
  X,
  BarChart3,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  CreditCard
} from 'lucide-react';

// COMPONENTE DE VERIFICACIÓN DE EMAIL
const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/auth/verify-email/${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          setTimeout(() => navigate('/'), 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Token inválido o expirado');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error al verificar el correo');
      }
    };

    if (token) verifyEmail();
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
            <p className="text-green-300 text-lg">Verificando tu correo...</p>
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
            <p className="text-gray-400 mb-4">Redirigiendo al login...</p>
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
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-gray-600 to-gray-500 text-white py-3 px-8 rounded-lg hover:from-gray-500 hover:to-gray-400 transition-all font-semibold"
            >
              Volver al Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// COMPONENTE PRINCIPAL DE LA APP
const AppContent = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', amount: 45000, description: 'Supermercado', category: 'Alimentación', date: '2024-01-15' },
    { id: 2, type: 'income', amount: 150000, description: 'Salario', category: 'Trabajo', date: '2024-01-01' },
    { id: 3, type: 'expense', amount: 12000, description: 'Uber al trabajo', category: 'Transporte', date: '2024-01-10' }
  ]);

  const [goals, setGoals] = useState([
    { id: 1, name: 'Vacaciones', target: 500000, current: 125000, deadline: '2024-06-01' },
    { id: 2, name: 'Fondo de Emergencia', target: 300000, current: 80000, deadline: '2024-12-31' }
  ]);

  const balance = transactions.reduce((acc, t) =>
    t.type === 'income' ? acc + t.amount : acc - t.amount, 0
  );

  // COMPONENTE DE AUTENTICACIÓN
  const AuthComponent = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const validateForm = () => {
      const errors = {};
      const emailValue = formData.email.trim();

      if (!emailValue) {
        errors.email = 'El correo electrónico es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        errors.email = 'Ingresa un correo electrónico válido';
      }

      if (!formData.password) {
        errors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 8) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres';
      }

      if (authMode === 'register') {
        if (!formData.confirmPassword) {
          errors.confirmPassword = 'Debes confirmar tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Las contraseñas no coinciden';
        }
      }

      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setFieldErrors({});

      if (!validateForm()) return;

      setLoading(true);

      try {
        const endpoint = authMode === 'login'
          ? 'http://localhost:3000/api/auth/login'
          : 'http://localhost:3000/api/auth/register';

        const body = authMode === 'login'
          ? { email: formData.email.trim(), password: formData.password }
          : {
            email: formData.email.trim(),
            password: formData.password,
            confirmPassword: formData.confirmPassword
          };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Error en la operación');

        if (authMode === 'login') {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          setIsAuthenticated(true);
        } else {
          setError('');
          alert('Registro exitoso. Por favor verifica tu correo electrónico.');
          setAuthMode('login');
          setFormData({ email: '', password: '', confirmPassword: '' });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 border border-green-700 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <DollarSign className="h-12 w-12 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">StonkyStonk</h1>
            <p className="text-green-300">Control Financiero Profesional</p>
          </div>

          <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${authMode === 'login'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
                }`}
              onClick={() => {
                setAuthMode('login');
                setError('');
                setFieldErrors({});
              }}
            >
              Iniciar Sesión
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${authMode === 'register'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
                }`}
              onClick={() => {
                setAuthMode('register');
                setError('');
                setFieldErrors({});
              }}
            >
              Registrarse
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-300 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                className={`w-full px-4 py-3 bg-gray-700 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-600'
                  } text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-green-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 bg-gray-700 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-600'
                    } text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 pr-12`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-green-300 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  className={`w-full px-4 py-3 bg-gray-700 border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                    } text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={loading}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-6 rounded-lg hover:from-green-500 hover:to-green-400 transition-all duration-200 font-semibold shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading
                ? 'Procesando...'
                : (authMode === 'login' ? 'Acceder a mi cuenta' : 'Crear cuenta')
              }
            </button>
          </form>

          {authMode === 'login' && (
            <div className="text-center mt-6">
              <button className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // LAYOUT PRINCIPAL
  const MainLayout = ({ children }) => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'transactions', label: 'Transacciones', icon: CreditCard },
      { id: 'goals', label: 'Metas', icon: Target },
      { id: 'budgets', label: 'Presupuestos', icon: Wallet },
      { id: 'reports', label: 'Reportes', icon: FileText },
      { id: 'analysis', label: 'Análisis', icon: TrendingUp },
      { id: 'settings', label: 'Configuración', icon: Settings },
    ];

    const getViewTitle = () => {
      const titles = {
        'dashboard': 'Panel Principal',
        'transactions': 'Transacciones',
        'goals': 'Metas Financieras',
        'budgets': 'Presupuestos',
        'reports': 'Reportes',
        'analysis': 'Análisis',
        'settings': 'Configuración'
      };
      return titles[currentView] || 'Dashboard';
    };

    return (
      <div className="flex h-screen bg-gray-950">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className={`fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-30 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:z-0`}>
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-400 mr-3" />
                <h1 className="text-xl font-bold text-white">StonkyStonk</h1>
              </div>
              <button
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <nav className="mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-6 py-4 text-left transition-all duration-200 group ${currentView === item.id
                      ? 'bg-green-800 text-green-100 border-r-4 border-green-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <Icon className={`h-5 w-5 mr-4 transition-colors ${currentView === item.id ? 'text-green-400' : 'text-gray-400 group-hover:text-green-400'
                    }`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 w-full p-6 border-t border-gray-800">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-red-900 hover:text-white rounded-lg transition-all duration-200 group"
            >
              <LogOut className="h-5 w-5 mr-3 group-hover:text-red-400" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-gray-900 border-b border-gray-800 shadow-2xl px-4 md:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  className="md:hidden mr-4 text-gray-400 hover:text-white"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-white">
                  {getViewTitle()}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                  <Wallet className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-gray-300 font-medium">Balance:</span>
                  <span className={`font-bold text-lg ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${balance.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-gray-950 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    );
  };

  // DASHBOARD
  const Dashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-xl p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-full">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-300">Saldo Actual</p>
              <p className="text-3xl font-bold text-white">
                ${balance.toLocaleString('es-CL')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900 to-green-800 border border-green-700 rounded-2xl shadow-xl p-6">
          <div className="flex items-center">
            <div className="bg-green-400 p-3 rounded-full">
              <ArrowUpCircle className="h-8 w-8 text-gray-900" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-200">Ingresos del Mes</p>
              <p className="text-3xl font-bold text-white">
                ${transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0).toLocaleString('es-CL')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-black border border-gray-700 rounded-2xl shadow-xl p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-full">
              <Target className="h-8 w-8 text-gray-900" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-300">Metas Activas</p>
              <p className="text-3xl font-bold text-white">{goals.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Transacciones Recientes</h3>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-4 px-6 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-750 transition-colors">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-4 ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                  {transaction.type === 'income'
                    ? <ArrowUpCircle className="h-5 w-5 text-white" />
                    : <ArrowDownCircle className="h-5 w-5 text-white" />
                  }
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">{transaction.description}</p>
                  <p className="text-gray-400">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-xl ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString('es-CL')}
                </p>
                <p className="text-gray-500">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PlaceholderPage = ({ title }) => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-12 text-center">
        <div className="mb-6">
          <div className="bg-gray-800 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
            <Settings className="h-12 w-12 text-green-400" />
          </div>
        </div>
        <p className="text-gray-300 text-2xl font-semibold mb-4">Componente en desarrollo</p>
        <p className="text-gray-500 text-lg">Esta funcionalidad estará disponible próximamente</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <PlaceholderPage title="📊 Transacciones" />;
      case 'goals': return <PlaceholderPage title="🎯 Metas Financieras" />;
      case 'budgets': return <PlaceholderPage title="💰 Presupuestos" />;
      case 'reports': return <PlaceholderPage title="📈 Reportes" />;
      case 'analysis': return <PlaceholderPage title="📊 Análisis" />;
      case 'settings': return <PlaceholderPage title="⚙️ Configuración" />;
      default: return <Dashboard />;
    }
  };

  if (!isAuthenticated) return <AuthComponent />;
  return <MainLayout>{renderContent()}</MainLayout>;
};

// COMPONENTE PRINCIPAL CON RUTAS
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/verification-success" element={<VerificationSuccess />} />
        <Route path="/verification-failed" element={<VerificationFailed />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;