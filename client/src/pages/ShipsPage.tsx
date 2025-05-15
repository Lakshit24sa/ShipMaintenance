import React, { useState } from 'react';
import { useShips } from '../contexts/ShipsContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ShipList from '../components/Ships/ShipList';
import ShipForm from '../components/Ships/ShipForm';
import { Ship } from '../types';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Helmet } from 'react-helmet';

const ShipsPage: React.FC = () => {
  const { ships, addShip, editShip, removeShip, loading, error } = useShips();
  const { currentUser, hasPermission } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingShip, setEditingShip] = useState<Ship | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const canAddOrEditShips = hasPermission(['Admin', 'Inspector']);
  
  const handleCreateShip = (data: Omit<Ship, 'id'>) => {
    setIsSubmitting(true);
    
    try {
      addShip(data);
      
      toast({
        title: "Ship Added",
        description: "The ship has been successfully added to the fleet.",
        variant: "success",
      });
      
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add ship. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateShip = (data: Ship) => {
    setIsSubmitting(true);
    
    try {
      editShip(data);
      
      toast({
        title: "Ship Updated",
        description: "The ship details have been successfully updated.",
        variant: "success",
      });
      
      setEditingShip(undefined);
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ship. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteShip = (id: string) => {
    try {
      removeShip(id);
      
      toast({
        title: "Ship Deleted",
        description: "The ship has been successfully removed from the fleet.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ship. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Ships Management - ENTNT Maintenance</title>
        <meta name="description" content="Manage your fleet of vessels. Add, edit, and view ship details including maintenance status and components." />
      </Helmet>
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Ships Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your fleet of vessels</p>
        </div>
        
        {canAddOrEditShips && (
          <Button
            onClick={() => {
              setEditingShip(undefined);
              setShowForm(true);
            }}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusIcon className="h-4 w-4 mr-2" /> Add New Ship
          </Button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {showForm ? (
        <ShipForm 
          ship={editingShip} 
          onSubmit={editingShip ? handleUpdateShip : handleCreateShip} 
          isLoading={isSubmitting}
        />
      ) : (
        <ShipList 
          ships={ships} 
          onDelete={handleDeleteShip} 
          isLoading={loading}
        />
      )}
    </>
  );
};

export default ShipsPage;



