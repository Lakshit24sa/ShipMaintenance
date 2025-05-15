import React, { useState, useEffect } from 'react';
import { useComponents } from '../contexts/ComponentsContext';
import { useShips } from '../contexts/ShipsContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ComponentList from '../components/Components/ComponentList';
import ComponentForm from '../components/Components/ComponentForm';
import { ShipComponent } from '../types';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Helmet } from 'react-helmet';



const ComponentsPage: React.FC = () => {
  const { components, addComponent, editComponent, removeComponent, loading, error } = useComponents();
  const { ships } = useShips();
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState<ShipComponent | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preSelectedShipId, setPreSelectedShipId] = useState<string | undefined>(undefined);
  
  const canAddOrEditComponents = hasPermission(['Admin', 'Inspector']);
  
  // Map ships to options format for dropdowns
  const shipOptions = ships.map(ship => ({
    id: ship.id,
    name: ship.name
  }));
  
  useEffect(() => {
    // Check URL for "add" and "shipId" parameters
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('add') === 'true') {
      setShowForm(true);
      
      const shipId = searchParams.get('shipId');
      if (shipId) {
        setPreSelectedShipId(shipId);
      }
    }
  }, []);
  
  const handleCreateComponent = (data: Omit<ShipComponent, 'id'>) => {
    setIsSubmitting(true);
    
    try {
      addComponent(data);
      
      toast({
        title: "Component Added",
        description: "The component has been successfully added.",
        variant: "success",
      });
      
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add component. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateComponent = (data: ShipComponent) => {
    setIsSubmitting(true);
    
    try {
      editComponent(data);
      
      toast({
        title: "Component Updated",
        description: "The component details have been successfully updated.",
        variant: "success",
      });
      
      setEditingComponent(undefined);
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update component. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteComponent = (id: string) => {
    try {
      removeComponent(id);
      
      toast({
        title: "Component Deleted",
        description: "The component has been successfully removed.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete component. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Ship Components - ENTNT Maintenance</title>
        <meta name="description" content="Manage all components installed on your vessels. Track installation dates, maintenance status, and schedule maintenance jobs." />
      </Helmet>
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Ship Components</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage all components installed on your vessels</p>
        </div>
        
        {canAddOrEditComponents && (
          <Button
            onClick={() => {
              setEditingComponent(undefined);
              setPreSelectedShipId(undefined);
              setShowForm(true);
            }}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusIcon className="h-4 w-4 mr-2" /> Add New Component
          </Button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {showForm ? (
        <ComponentForm 
          component={editingComponent} 
          onSubmit={editingComponent ? handleUpdateComponent : handleCreateComponent} 
          isLoading={isSubmitting}
          shipOptions={shipOptions}
          preSelectedShipId={preSelectedShipId}
        />
      ) : (
        <ComponentList 
          components={components} 
          onDelete={handleDeleteComponent} 
          isLoading={loading}
          shipOptions={shipOptions}
        />
      )}
    </>
  );
};

export default ComponentsPage;
