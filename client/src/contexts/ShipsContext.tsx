import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ship } from '../types';
import {
  getShips,
  getShipById,
  createShip,
  updateShip,
  deleteShip
} from '../utils/localStorage';

interface ShipsContextType {
  ships: Ship[];
  loading: boolean;
  error: string | null;
  getShip: (id: string) => Ship | undefined;
  addShip: (ship: Omit<Ship, 'id'>) => Ship;
  editShip: (ship: Ship) => Ship;
  removeShip: (id: string) => void;
  refreshShips: () => void;
}

const ShipsContext = createContext<ShipsContextType | undefined>(undefined);

export const ShipsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadShips = () => {
    try {
      setLoading(true);
      const shipsData = getShips();
      setShips(shipsData);
      setError(null);
    } catch (err) {
      setError('Failed to load ships');
      console.error('Error loading ships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShips();
  }, []);

  const getShip = (id: string): Ship | undefined => {
    return getShipById(id);
  };

  const addShip = (shipData: Omit<Ship, 'id'>): Ship => {
    try {
      const newShip = createShip(shipData);
      setShips(prevShips => [...prevShips, newShip]);
      return newShip;
    } catch (err) {
      setError('Failed to add ship');
      console.error('Error adding ship:', err);
      throw err;
    }
  };

  const editShip = (shipData: Ship): Ship => {
    try {
      const updatedShip = updateShip(shipData);
      setShips(prevShips => 
        prevShips.map(ship => ship.id === updatedShip.id ? updatedShip : ship)
      );
      return updatedShip;
    } catch (err) {
      setError('Failed to update ship');
      console.error('Error updating ship:', err);
      throw err;
    }
  };

  
  const removeShip = (id: string): void => {
    try {
      deleteShip(id);
      setShips(prevShips => prevShips.filter(ship => ship.id !== id));
    } catch (err) {
      setError('Failed to delete ship');
      console.error('Error deleting ship:', err);
      throw err;
    }
  };

  const refreshShips = (): void => {
    loadShips();
  };

  return (
    <ShipsContext.Provider value={{
      ships,
      loading,
      error,
      getShip,
      addShip,
      editShip,
      removeShip,
      refreshShips
    }}>
      {children}
    </ShipsContext.Provider>
  );
};

export const useShips = (): ShipsContextType => {
  const context = useContext(ShipsContext);
  if (context === undefined) {
    throw new Error('useShips must be used within a ShipsProvider');
  }
  return context;
};
