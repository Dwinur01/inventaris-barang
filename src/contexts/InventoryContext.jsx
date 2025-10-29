// src/contexts/InventoryContext.jsx
import React, { createContext, useContext } from 'react';
import { useInventory } from '../hooks/useInventory';

const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  const inventoryData = useInventory();
  
  return (
    <InventoryContext.Provider value={inventoryData}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventoryContext = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventoryContext harus digunakan di dalam InventoryProvider");
  }
  return context;
};