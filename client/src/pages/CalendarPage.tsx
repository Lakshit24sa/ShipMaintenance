import React, { useMemo } from 'react';
import { useJobs } from '../contexts/JobsContext';
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';
import MaintenanceCalendar from '../components/Calendar/MaintenanceCalendar';
import { Helmet } from 'react-helmet';

const CalendarPage: React.FC = () => {
  const { jobs } = useJobs();
  const { ships } = useShips();
  const { components } = useComponents();
  
  // Memoize ship map and component map to avoid recalculation on re-renders
  const shipMap = useMemo(() => {
    return ships.reduce((map, ship) => {
      map[ship.id] = ship.name;
      return map;
    }, {} as Record<string, string>);
  }, [ships]);
  
  const componentMap = useMemo(() => {
    return components.reduce((map, component) => {
      map[component.id] = component.name;
      return map;
    }, {} as Record<string, string>);
  }, [components]);
  
  return (
    <>
      <Helmet>
        <title>Maintenance Calendar - ENTNT Maintenance</title>
        <meta name="description" content="View and manage your maintenance schedule in a calendar format. See upcoming jobs, their priorities, and related components." />
      </Helmet>
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Maintenance Calendar</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">View and manage scheduled maintenance jobs</p>
        </div>
      </div>
      
      <MaintenanceCalendar
        jobs={jobs}
        componentMap={componentMap}
        shipMap={shipMap}
      />
    </>
  );
};

export default CalendarPage;
