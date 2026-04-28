import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Bill } from '../types';

interface BillingContextType {
  isAuthenticated: boolean;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  bills: Bill[];
  addBill: (bill: Bill) => void;
  deleteBill: (id: string) => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('sagar_bills');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sagar_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('auth', String(isAuthenticated));
  }, [isAuthenticated]);

  const login = (username: string, pass: string) => {
    // Simple hardcoded auth for owner
    if (username === 'owner' && pass === 'admin123') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addBill = (bill: Bill) => {
    setBills(prev => [bill, ...prev]);
  };

  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
  };

  return (
    <BillingContext.Provider value={{ isAuthenticated, login, logout, bills, addBill, deleteBill }}>
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};
