import { Card } from 'flowbite-react';

export default function ExpenseChart() {
  // Este sería un componente con Chart.js en una implementación real
  return (
    <Card>
      <h5 className="text-xl font-bold text-gray-800 mb-4">Distribución de Gastos</h5>
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Gráfico de distribución de gastos por categorías</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
          <span className="text-sm">Alimentación: 25%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
          <span className="text-sm">Transporte: 20%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
          <span className="text-sm">Entretenimiento: 15%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
          <span className="text-sm">Servicios: 30%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-600 rounded-full mr-2"></div>
          <span className="text-sm">Otros: 10%</span>
        </div>
      </div>
    </Card>
  );
}