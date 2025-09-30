import { Card } from 'flowbite-react';
import { HiCurrencyDollar, HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

export default function StatsCards() {
  const stats = [
    {
      title: 'Saldo Actual',
      value: '$1,250,000',
      change: '+2.3%',
      trend: 'up',
      icon: HiCurrencyDollar,
      color: 'blue'
    },
    {
      title: 'Ingresos Mensuales',
      value: '$750,000',
      change: '+5.1%',
      trend: 'up',
      icon: HiTrendingUp,
      color: 'green'
    },
    {
      title: 'Gastos Mensuales',
      value: '$500,000',
      change: '-3.2%',
      trend: 'down',
      icon: HiTrendingDown,
      color: 'red'
    },
    {
      title: 'Ahorro Mensual',
      value: '$250,000',
      change: '+15.8%',
      trend: 'up',
      icon: HiTrendingUp,
      color: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="text-center p-4">
          <div className={`flex justify-center mb-3 p-3 rounded-full bg-${stat.color}-100`}>
            <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
          </div>
          <h5 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h5>
          <p className="text-gray-600 mb-2">{stat.title}</p>
          <div className={`inline-flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {stat.trend === 'up' ? (
              <HiTrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <HiTrendingDown className="w-4 h-4 mr-1" />
            )}
            <span className="text-sm font-medium">{stat.change}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}