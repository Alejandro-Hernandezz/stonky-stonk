import React, { createContext, useContext, useState, useEffect } from 'react';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'expense',
      amount: 45000,
      description: 'Supermercado Jumbo',
      category: 'Alimentación',
      date: '2024-01-15',
      tags: ['comida', 'hogar']
    },
    {
      id: 2,
      type: 'income',
      amount: 150000,
      description: 'Salario Enero',
      category: 'Trabajo',
      date: '2024-01-01',
      tags: ['salario', 'trabajo']
    },
    {
      id: 3,
      type: 'expense',
      amount: 12000,
      description: 'Uber al trabajo',
      category: 'Transporte',
      date: '2024-01-10',
      tags: ['trabajo', 'uber']
    }
  ]);

  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Vacaciones de Verano',
      target: 500000,
      current: 125000,
      deadline: '2024-06-01',
      category: 'Entretenimiento',
      description: 'Viaje a la playa con la familia'
    },
    {
      id: 2,
      name: 'Fondo de Emergencia',
      target: 300000,
      current: 80000,
      deadline: '2024-12-31',
      category: 'Ahorro',
      description: 'Ahorro para emergencias'
    }
  ]);

  const [budgets, setBudgets] = useState({
    total: 200000,
    categories: {
      'Alimentación': { budget: 80000, spent: 45000 },
      'Transporte': { budget: 40000, spent: 12000 },
      'Entretenimiento': { budget: 30000, spent: 8000 },
      'Salud': { budget: 25000, spent: 0 },
      'Educación': { budget: 15000, spent: 0 }
    }
  });

  const [loading, setLoading] = useState(false);

  // Calcular balance total
  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === 'income' 
      ? acc + transaction.amount 
      : acc - transaction.amount;
  }, 0);

  // Funciones para transacciones
  const addTransaction = async (transactionData) => {
    try {
      setLoading(true);
      
      const newTransaction = {
        id: Date.now(),
        ...transactionData,
        amount: parseFloat(transactionData.amount),
        date: transactionData.date || new Date().toISOString().split('T')[0]
      };

      // Aquí harías la petición POST al backend
      // const response = await fetch('/api/transactions', { ... });
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Actualizar presupuesto si es un gasto
      if (newTransaction.type === 'expense') {
        updateBudgetSpent(newTransaction.category, newTransaction.amount);
      }

      return { success: true, transaction: newTransaction };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id, updatedData) => {
    try {
      setLoading(true);
      
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id 
            ? { ...transaction, ...updatedData }
            : transaction
        )
      );

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      setLoading(true);
      
      const transaction = transactions.find(t => t.id === id);
      if (transaction && transaction.type === 'expense') {
        updateBudgetSpent(transaction.category, -transaction.amount);
      }

      setTransactions(prev => prev.filter(transaction => transaction.id !== id));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Funciones para metas
  const addGoal = async (goalData) => {
    try {
      setLoading(true);
      
      const newGoal = {
        id: Date.now(),
        ...goalData,
        current: 0,
        target: parseFloat(goalData.target)
      };

      setGoals(prev => [...prev, newGoal]);
      return { success: true, goal: newGoal };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (id, updatedData) => {
    try {
      setLoading(true);
      
      setGoals(prev => 
        prev.map(goal => 
          goal.id === id 
            ? { ...goal, ...updatedData }
            : goal
        )
      );

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (id) => {
    try {
      setLoading(true);
      setGoals(prev => prev.filter(goal => goal.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Funciones para presupuestos
  const updateBudget = (category, newBudget) => {
    setBudgets(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          budget: parseFloat(newBudget)
        }
      }
    }));
  };

  const updateBudgetSpent = (category, amount) => {
    setBudgets(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          spent: (prev.categories[category]?.spent || 0) + amount
        }
      }
    }));
  };

  // Funciones de filtrado y búsqueda
  const getTransactionsByCategory = (category) => {
    return transactions.filter(t => t.category === category);
  };

  const getTransactionsByDateRange = (startDate, endDate) => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
  };

  const getIncomeTotal = (period = 'month') => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions
      .filter(t => t.type === 'income' && new Date(t.date) >= startOfMonth)
      .reduce((total, t) => total + t.amount, 0);
  };

  const getExpenseTotal = (period = 'month') => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
      .reduce((total, t) => total + t.amount, 0);
  };

  const value = {
    // Estado
    transactions,
    goals,
    budgets,
    balance,
    loading,
    
    // Transacciones
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Metas
    addGoal,
    updateGoal,
    deleteGoal,
    
    // Presupuestos
    updateBudget,
    updateBudgetSpent,
    
    // Utilidades
    getTransactionsByCategory,
    getTransactionsByDateRange,
    getIncomeTotal,
    getExpenseTotal,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};