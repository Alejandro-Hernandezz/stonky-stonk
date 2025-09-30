import { Navbar, Dropdown, Avatar, Badge } from 'flowbite-react';
import { HiBell, HiCog, HiLogout } from 'react-icons/hi';

export default function AppHeader({ onMenuClick }) {
  return (
    <Navbar fluid rounded className="border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between w-full p-4">
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 mr-2 text-gray-500 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Navbar.Brand href="/dashboard">
            <span className="self-center whitespace-nowrap text-xl font-semibold text-gray-800">
              StonkyStonk
            </span>
          </Navbar.Brand>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 relative">
            <HiBell className="w-5 h-5" />
            <Badge color="red" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
              3
            </Badge>
          </button>
          
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">Usuario StonkyStonk</span>
              <span className="block truncate text-sm font-medium">usuario@stonkystonk.com</span>
            </Dropdown.Header>
            <Dropdown.Item icon={HiCog}>Configuración</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={HiLogout}>Cerrar sesión</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </Navbar>
  );
}