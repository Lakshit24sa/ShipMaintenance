import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job } from '../types';
import {
  getJobs,
  getJobById,
  getJobsByShipId,
  getJobsByComponentId,
  getJobsByEngineer,
  createJob,
  updateJob,
  deleteJob
} from '../utils/localStorage';

interface JobsContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  getJob: (id: string) => Job | undefined;
  getJobsForShip: (shipId: string) => Job[];
  getJobsForComponent: (componentId: string) => Job[];
  getJobsForEngineer: (engineerId: string) => Job[];
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => Job;
  editJob: (job: Job) => Job;
  removeJob: (id: string) => void;
  refreshJobs: () => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = () => {
    try {
      setLoading(true);
      const jobsData = getJobs();
      setJobs(jobsData);
      setError(null);
    } catch (err) {
      setError('Failed to load maintenance jobs');
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const getJob = (id: string): Job | undefined => {
    return getJobById(id);
  };

  const getJobsForShip = (shipId: string): Job[] => {
    return getJobsByShipId(shipId);
  };

  const getJobsForComponent = (componentId: string): Job[] => {
    return getJobsByComponentId(componentId);
  };

  const getJobsForEngineer = (engineerId: string): Job[] => {
    return getJobsByEngineer(engineerId);
  };

  
  const addJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job => {
    try {
      const newJob = createJob(jobData);
      setJobs(prevJobs => [...prevJobs, newJob]);
      return newJob;
    } catch (err) {
      setError('Failed to add job');
      console.error('Error adding job:', err);
      throw err;
    }
  };

  const editJob = (jobData: Job): Job => {
    try {
      const updatedJob = updateJob(jobData);
      setJobs(prevJobs => 
        prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
      );
      return updatedJob;
    } catch (err) {
      setError('Failed to update job');
      console.error('Error updating job:', err);
      throw err;
    }
  };

  const removeJob = (id: string): void => {
    try {
      deleteJob(id);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    } catch (err) {
      setError('Failed to delete job');
      console.error('Error deleting job:', err);
      throw err;
    }
  };

  const refreshJobs = (): void => {
    loadJobs();
  };

  return (
    <JobsContext.Provider value={{
      jobs,
      loading,
      error,
      getJob,
      getJobsForShip,
      getJobsForComponent,
      getJobsForEngineer,
      addJob,
      editJob,
      removeJob,
      refreshJobs
    }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = (): JobsContextType => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};
