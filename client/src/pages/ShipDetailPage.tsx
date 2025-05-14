import React, { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { useJobs } from '../contexts/JobsContext';
import { useToast } from '@/hooks/use-toast';
import ShipDetail from '../components/Ships/ShipDetail';
import ShipForm from '../components/Ships/ShipForm';
import { Ship, ShipComponent, Job } from '../types';
import { Helmet } from 'react-helmet';

interface ShipDetailPageProps {
  id?: string;
}

const ShipDetailPage: React.FC<ShipDetailPageProps> = ({ id: propId }) => {
  const [, params] = useRoute('/ships/:id');
  const [location, setLocation] = useLocation();
  const id = propId || params?.id;
  const { ships, getShip, editShip } = useShips();
  const { components, getComponentsForShip } = useComponents();
  const { jobs, getJobsForShip } = useJobs();
  const { toast } = useToast();
  
  const [ship, setShip] = useState<Ship | undefined>(undefined);
  const [shipComponents, setShipComponents] = useState<ShipComponent[]>([]);
  const [shipJobs, setShipJobs] = useState<Job[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadShipData = () => {
      if (!id) {
        setError('Ship ID not provided');
        setLoading(false);
        return;
      }
      
      try {
        // Check if edit mode from URL parameter
        const searchParams = new URLSearchParams(window.location.search);
        setIsEditing(searchParams.get('edit') === 'true');
        
        // Load ship data
        const shipData = getShip(id);
        if (!shipData) {
          setError('Ship not found');
          setLoading(false);
          return;
        }
        
        setShip(shipData);
        
        // Load related components
        const relatedComponents = getComponentsForShip(id);
        setShipComponents(relatedComponents);
        
        // Load related jobs
        const relatedJobs = getJobsForShip(id);
        setShipJobs(relatedJobs);
        
        setError(null);
      } catch (err) {
        console.error('Error loading ship data:', err);
        setError('Failed to load ship data');
      } finally {
        setLoading(false);
      }
    };
    
    loadShipData();
  }, [id, getShip, getComponentsForShip, getJobsForShip, ships, components, jobs]);
  
  const handleUpdateShip = (data: Ship) => {
    setIsSubmitting(true);
    
    try {
      editShip(data);
      
      toast({
        title: "Ship Updated",
        description: "The ship details have been successfully updated.",
        variant: "default",
      });
      
      setShip(data);
      setIsEditing(false);
      
      // Update URL to remove edit parameter
      setLocation(`/ships/${id}`);
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
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading ship details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !ship) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p>{error || 'Ship not found'}</p>
        <button
          onClick={() => setLocation('/ships')}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Back to Ships
        </button>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{ship.name} - Ship Details | ENTNT Maintenance</title>
        <meta name="description" content={`View and manage details for ${ship.name} (IMO: ${ship.imo}). Includes general information, installed components, and maintenance history.`} />
      </Helmet>
      
      {isEditing ? (
        <ShipForm 
          ship={ship} 
          onSubmit={handleUpdateShip} 
          isLoading={isSubmitting}
        />
      ) : (
        <ShipDetail 
          ship={ship} 
          components={shipComponents} 
          jobs={shipJobs}
        />
      )}
    </>
  );
};

export default ShipDetailPage;
