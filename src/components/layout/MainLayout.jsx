import React, { useState } from 'react';
import { useTransactions } from '../../contexts/TransactionContext';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children, currentView, setCurrentView }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { balance } = useTransactions();

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentView={currentView}
          setSidebarOpen={setSidebarOpen}
          balance={balance}
        />
        
        <main className="flex-1 overflow-auto bg-gray-950 p-4 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;