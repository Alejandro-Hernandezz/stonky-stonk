
import React, { useState } from 'react';
import { 
  DollarSign, 
  PlusCircle, 
  TrendingUp, 
  Target, 
  PieChart, 
  FileText, 
  Settings, 
  LogOut, 
  Eye, 
  EyeOff,
  Menu,
  X,
  BarChart3,
  AlertTriangle,
  Calendar,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  CreditCard
} from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Simulación de datos
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', amount: 45000, description: 'Supermercado', category: 'Alimentación', date: '2024-01-15' },
    { id: 2, type: 'income', amount: 150000, description: 'Salario', category: 'Trabajo', date: '2024-01-01' },
    { id: 3, type: 'expense', amount: 12000, description: 'Uber al trabajo', category: 'Transporte', date: '2024-01-10' }
  ]);

  const [goals, setGoals] = useState([
    { id: 1, name: 'Vacaciones', target: 500000, current: 125000, deadline: '2024-06-01' },
    { id: 2, name: 'Fondo de Emergencia', target: 300000, current: 80000, deadline: '2024-12-31' }
  ]);

  const [budget, setBudget] = useState({
    total: 200000,
    categories: {
      'Alimentación': { budget: 80000, spent: 45000 },
      'Transporte': { budget: 40000, spent: 12000 },
      'Entretenimiento': { budget: 30000, spent: 8000 }
    }
  });

  const balance = transactions.reduce((acc, t) => 
    t.type === 'income' ? acc + t.amount : acc - t.amount, 0
  );

  // Componente de Autenticación
  const AuthComponent = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      setIsAuthenticated(true);
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
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                authMode === 'login' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setAuthMode('login')}
            >
              Iniciar Sesión
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                authMode === 'register' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setAuthMode('register')}
            >
              Registrarse
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-300 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 pr-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-green-300 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-6 rounded-lg hover:from-green-500 hover:to-green-400 transition-all duration-200 font-semibold shadow-lg transform hover:scale-105"
            >
              {authMode === 'login' ? 'Acceder a mi cuenta' : 'Crear cuenta'}
            </button>
          </div>

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

  // Componente de Layout Principal
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
        {/* Sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className={`fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                  className={`w-full flex items-center px-6 py-4 text-left transition-all duration-200 group ${
                    currentView === item.id 
                      ? 'bg-green-800 text-green-100 border-r-4 border-green-400' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-4 transition-colors ${
                    currentView === item.id ? 'text-green-400' : 'text-gray-400 group-hover:text-green-400'
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

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
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

          {/* Main content */}
          <main className="flex-1 overflow-auto bg-gray-950 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    );
  };

  // Páginas
  const Dashboard = () => (
    <div className="space-y-8">
      {/* Balance y resumen rápido */}
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

      {/* Transacciones recientes */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Transacciones Recientes</h3>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-4 px-6 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-750 transition-colors">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-4 ${
                  transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
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
                <p className={`font-bold text-xl ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
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

  if (!isAuthenticated) {
    return <AuthComponent />;
  }

  return (
    <MainLayout>
      {renderContent()}
    </MainLayout>
  );
};

export default App;