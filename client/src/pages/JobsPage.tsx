import React, { useState, useEffect } from 'react';
import { useJobs } from '../contexts/JobsContext';
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import JobList from '../components/Jobs/JobList';
import JobForm from '../components/Jobs/JobForm';
import { Job } from '../types';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Helmet } from 'react-helmet';

const JobsPage: React.FC = () => {
  const { jobs, addJob, editJob, loading, error } = useJobs();
  const { ships } = useShips();
  const { components } = useComponents();
  const { currentUser, hasPermission } = useAuth();
  const { toast } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preSelectedShipId, setPreSelectedShipId] = useState<string | undefined>(undefined);
  const [preSelectedComponentId, setPreSelectedComponentId] = useState<string | undefined>(undefined);
  
  const canAddOrEditJobs = hasPermission(['Admin', 'Inspector', 'Engineer']);
  
  // Map ships to options format for dropdowns
  const shipOptions = ships.map(ship => ({
    id: ship.id,
    name: ship.name
  }));
  
  // Map components to options format for dropdowns
  const componentOptions = components.map(component => ({
    id: component.id,
    name: component.name,
    shipId: component.shipId
  }));
  
  // Map component IDs to component names for display
  const componentMap = components.reduce((map, component) => {
    map[component.id] = component.name;
    return map;
  }, {} as Record<string, string>);
  
  // Get engineers for dropdown
  const engineerOptions = [
    { id: '3', name: 'Engineer User' }
  ];
  
  useEffect(() => {
    // Check URL for "add", "shipId", and "componentId" parameters
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('add') === 'true') {
      setShowForm(true);
      
      const shipId = searchParams.get('shipId');
      if (shipId) {
        setPreSelectedShipId(shipId);
      }
      
      const componentId = searchParams.get('componentId');
      if (componentId) {
        setPreSelectedComponentId(componentId);
      }
    }
  }, []);
  
  const handleCreateJob = (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    
    try {
      addJob(data);
      
      toast({
        title: "Job Created",
        description: "The maintenance job has been successfully created.",
        variant: "success",
      });
      
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateJob = (data: Job) => {
    setIsSubmitting(true);
    
    try {
      editJob(data);
      
      toast({
        title: "Job Updated",
        description: "The maintenance job has been successfully updated.",
        variant: "success",
      });
      
      setEditingJob(undefined);
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Maintenance Jobs - ENTNT Maintenance</title>
        <meta name="description" content="Manage maintenance jobs for your fleet. Create, track, and update jobs for ship components with different priorities and statuses." />
      </Helmet>
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Maintenance Jobs</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage all maintenance jobs for your fleet</p>
        </div>
        
        {canAddOrEditJobs && (
          <Button
            onClick={() => {
              setEditingJob(undefined);
              setPreSelectedShipId(undefined);
              setPreSelectedComponentId(undefined);
              setShowForm(true);
            }}
            className="mt-4 sm:mt-0 bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" /> Create New Job
          </Button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {showForm ? (
        <JobForm 
          job={editingJob} 
          onSubmit={editingJob ? handleUpdateJob : handleCreateJob} 
          isLoading={isSubmitting}
          shipOptions={shipOptions}
          componentOptions={componentOptions}
          engineerOptions={engineerOptions}
          preSelectedShipId={preSelectedShipId}
          preSelectedComponentId={preSelectedComponentId}
        />
      ) : (
        <JobList 
          jobs={jobs} 
          isLoading={loading}
          shipOptions={shipOptions}
          engineerOptions={engineerOptions}
          componentMap={componentMap}
        />
      )}
    </>
  );
};

export default JobsPage;
