import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShipComponent } from '../types';
import {
  getComponents,
  getComponentById,
  getComponentsByShipId,
  createComponent,
  updateComponent,
  deleteComponent
} from '../utils/localStorage';

interface ComponentsContextType {
  components: ShipComponent[];
  loading: boolean;
  error: string | null;
  getComponent: (id: string) => ShipComponent | undefined;
  getComponentsForShip: (shipId: string) => ShipComponent[];
  addComponent: (component: Omit<ShipComponent, 'id'>) => ShipComponent;
  editComponent: (component: ShipComponent) => ShipComponent;
  removeComponent: (id: string) => void;
  refreshComponents: () => void;
}

const ComponentsContext = createContext<ComponentsContextType | undefined>(undefined);

export const ComponentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<ShipComponent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadComponents = () => {
    try {
      setLoading(true);
      const componentsData = getComponents();
      setComponents(componentsData);
      setError(null);
    } catch (err) {
      setError('Failed to load components');
      console.error('Error loading components:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComponents();
  }, []);

  const getComponent = (id: string): ShipComponent | undefined => {
    return getComponentById(id);
  };

  const getComponentsForShip = (shipId: string): ShipComponent[] => {
    return getComponentsByShipId(shipId);
  };

  const addComponent = (componentData: Omit<ShipComponent, 'id'>): ShipComponent => {
    try {
      const newComponent = createComponent(componentData);
      setComponents(prevComponents => [...prevComponents, newComponent]);
      return newComponent;
    } catch (err) {
      setError('Failed to add component');
      console.error('Error adding component:', err);
      throw err;
    }
  };

  const editComponent = (componentData: ShipComponent): ShipComponent => {
    try {
      const updatedComponent = updateComponent(componentData);
      setComponents(prevComponents => 
        prevComponents.map(component => component.id === updatedComponent.id ? updatedComponent : component)
      );
      return updatedComponent;
    } catch (err) {
      setError('Failed to update component');
      console.error('Error updating component:', err);
      throw err;
    }
  };

  const removeComponent = (id: string): void => {
    try {
      deleteComponent(id);
      setComponents(prevComponents => prevComponents.filter(component => component.id !== id));
    } catch (err) {
      setError('Failed to delete component');
      console.error('Error deleting component:', err);
      throw err;
    }
  };

  const refreshComponents = (): void => {
    loadComponents();
  };

  return (
    <ComponentsContext.Provider value={{
      components,
      loading,
      error,
      getComponent,
      getComponentsForShip,
      addComponent,
      editComponent,
      removeComponent,
      refreshComponents
    }}>
      {children}
    </ComponentsContext.Provider>
  );
};

export const useComponents = (): ComponentsContextType => {
  const context = useContext(ComponentsContext);
  if (context === undefined) {
    throw new Error('useComponents must be used within a ComponentsProvider');
  }
  return context;
};
