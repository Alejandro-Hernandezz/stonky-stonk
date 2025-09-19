import { Sidebar } from 'flowbite-react';
import { 
  HiChartPie, 
  HiCurrencyDollar, 
  HiTarget, 
  HiClipboardList, 
  HiCog,
  HiChartBar,
  HiLogout
} from 'react-icons/hi';

export default function AppSidebar({ isOpen, onClose }) {
  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition duration-200 ease-in-out bg-white shadow-lg`}>
        <Sidebar aria-label="Sidebar de StonkyStonk">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="/dashboard" icon={HiChartPie}>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item href="/transactions" icon={HiCurrencyDollar}>
                Transacciones
              </Sidebar.Item>
              <Sidebar.Item href="/goals" icon={HiTarget}>
                Metas
              </Sidebar.Item>
              <Sidebar.Item href="/budgets" icon={HiClipboardList}>
                Presupuestos
              </Sidebar.Item>
              <Sidebar.Item href="/reports" icon={HiChartBar}>
                Reportes
              </Sidebar.Item>
              <Sidebar.Item href="/settings" icon={HiCog}>
                Configuración
              </Sidebar.Item>
              <Sidebar.Item href="/logout" icon={HiLogout}>
                Cerrar Sesión
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </>
  );
}