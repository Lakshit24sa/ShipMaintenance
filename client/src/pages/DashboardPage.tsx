import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { useJobs } from '../contexts/JobsContext';
import { ActivityItem } from '../components/Dashboard/RecentActivity';
import { formatDateToYYYYMMDD, getDateXDaysAgo, isMaintenanceOverdue } from '../utils/dateUtils';
import KPICards from '../components/Dashboard/KPICards';
import Charts from '../components/Dashboard/Charts';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { Helmet } from 'react-helmet';



const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { ships } = useShips();
  const { components } = useComponents();
  const { jobs } = useJobs();
  
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  // Compute dashboard stats
  const totalShips = ships.length;
  const componentsCount = components.length;
  const componentsNeedingMaintenance = components.filter(comp => 
    isMaintenanceOverdue(comp.lastMaintenanceDate)
  ).length;
  
  const jobsInProgress = jobs.filter(job => job.status === 'In Progress').length;
  const highPriorityJobs = jobs.filter(job => job.priority === 'High' && job.status !== 'Completed' && job.status !== 'Cancelled').length;
  const completedJobs = jobs.filter(job => job.status === 'Completed').length;
  
  // Count jobs completed this week
  const oneWeekAgo = formatDateToYYYYMMDD(getDateXDaysAgo(7));
  const completedThisWeek = jobs.filter(job => 
    job.status === 'Completed' && 
    job.updatedAt >= oneWeekAgo
  ).length;
  
  // Generate chart data
  const maintenanceStatusData = [
    { name: 'Completed', value: completedJobs, color: '#10b981' },
    { name: 'In Progress', value: jobsInProgress, color: '#3b82f6' },
    { name: 'Scheduled', value: jobs.filter(job => job.status === 'Open').length, color: '#f59e0b' },
    { name: 'Overdue', value: components.filter(comp => isMaintenanceOverdue(comp.lastMaintenanceDate)).length, color: '#ef4444' },
  ];
  
  const shipStatusData = [
    { name: 'Active', value: ships.filter(ship => ship.status === 'Active').length, color: '#3b82f6' },
    { name: 'Operational', value: ships.filter(ship => ship.status === 'Active').length, color: '#10b981' },
    { name: 'Maintenance', value: ships.filter(ship => ship.status === 'Under Maintenance').length, color: '#f59e0b' },
    { name: 'Inactive', value: ships.filter(ship => ship.status === 'Inactive').length, color: '#ef4444' },
  ];
  
  // Generate recent activities
  useEffect(() => {
    const activitiesList: ActivityItem[] = [];
    
    // Recent jobs (sorted by creation date, newest first)
    const sortedJobs = [...jobs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Only take the 10 most recent activities
    const recentJobs = sortedJobs.slice(0, 10);
    
    // Create activities from jobs
    recentJobs.forEach(job => {
      const ship = ships.find(s => s.id === job.shipId);
      const component = components.find(c => c.id === job.componentId);
      
      if (job.status === 'Completed') {
        activitiesList.push({
          id: `job_completed_${job.id}`,
          title: 'Maintenance job completed',
          description: `${job.type} for ${component?.name || 'Unknown Component'} on ${ship?.name || 'Unknown Ship'}`,
          timestamp: job.updatedAt,
          type: 'job_completed'
        });
      } else if (new Date(job.createdAt).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000) {
        // Only show newly created jobs (within the last week)
        activitiesList.push({
          id: `job_created_${job.id}`,
          title: 'New maintenance job added',
          description: `${job.type} scheduled for ${component?.name || 'Unknown Component'} on ${ship?.name || 'Unknown Ship'}`,
          timestamp: job.createdAt,
          type: 'job_created'
        });
      }
    });
    
    // Add new ships (if any)
    const sortedShips = [...ships].sort(
      (a, b) => new Date(b.id).getTime() - new Date(a.id).getTime() // Using ID as a proxy for creation time
    ).slice(0, 3);
    
    sortedShips.forEach(ship => {
      // Only include recently added ships (assuming ID contains timestamp)
      if (parseInt(ship.id.split('_')[1] || '0') > Date.now() - 7 * 24 * 60 * 60 * 1000) {
        activitiesList.push({
          id: `ship_added_${ship.id}`,
          title: 'New ship added to the fleet',
          description: `${ship.name} (IMO: ${ship.imo})`,
          timestamp: new Date(parseInt(ship.id.split('_')[1] || '0')).toISOString(),
          type: 'ship_added'
        });
      }
    });
    
    // Add maintenance due reminders
    components.filter(comp => isMaintenanceOverdue(comp.lastMaintenanceDate))
      .slice(0, 3)
      .forEach(component => {
        const ship = ships.find(s => s.id === component.shipId);
        activitiesList.push({
          id: `maintenance_due_${component.id}`,
          title: 'Maintenance due reminder',
          description: `${component.name} on ${ship?.name || 'Unknown Ship'} requires maintenance`,
          timestamp: new Date().toISOString(), // Current time
          type: 'maintenance_due'
        });
      });
    
    // Sort all activities by timestamp (newest first)
    activitiesList.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Set activities state (limit to 10)
    setActivities(activitiesList.slice(0, 10));
  }, [jobs, ships, components]);
  
  return (
    <>
      <Helmet>
        <title>Dashboard - ENTNT Ship Maintenance</title>
        <meta name="description" content="Monitor your fleet status, maintenance activities, and key performance indicators with the ENTNT Ship Maintenance Dashboard." />
      </Helmet>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Dashboard Overview</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your fleet status and maintenance activities</p>
      </div>
      
      {/* KPI Cards */}
      <KPICards
        totalShips={totalShips}
        componentsCount={componentsCount}
        componentsNeedingMaintenance={componentsNeedingMaintenance}
        jobsInProgress={jobsInProgress}
        highPriorityJobs={highPriorityJobs}
        completedJobs={completedJobs}
        completedThisWeek={completedThisWeek}
      />
      
      {/* Charts and Stats */}
      <Charts
        maintenanceStatusData={maintenanceStatusData}
        shipStatusData={shipStatusData}
      />
      
      {/* Recent Activity */}
      <RecentActivity activities={activities} />
    </>
  );
};

export default DashboardPage;
