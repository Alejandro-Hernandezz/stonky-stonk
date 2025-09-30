import MainLayout from '../components/layout/MainLayout';
import StatsCards from '../components/dashboard/StatsCards';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import FinancialGoals from '../components/dashboard/FinancialGoals';
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <span className="text-sm text-gray-500">Hoy: {new Date().toLocaleDateString()}</span>
        </div>

        <Alert color="info" icon={HiInformationCircle}>
          <span className="font-medium">Bienvenido a StonkyStonk!</span> Tu aplicación de control financiero personal.
        </Alert>

        {/* Stats Cards */}
        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Chart */}
          <div className="lg:col-span-1">
            <ExpenseChart />
          </div>

          {/* Budget Progress */}
          <div className="lg:col-span-1">
            <BudgetProgress />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-1">
            <RecentTransactions />
          </div>

          {/* Financial Goals */}
          <div className="lg:col-span-1">
            <FinancialGoals />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}