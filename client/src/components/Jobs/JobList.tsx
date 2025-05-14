import React, { useState } from 'react';
import { Link } from 'wouter';
import { Job, JobStatus, JobPriority } from '../../types';
import { Search, WrenchIcon, PencilIcon, EyeIcon, FilterIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDateForDisplay } from '../../utils/dateUtils';

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  shipOptions: { id: string, name: string }[];
  engineerOptions: { id: string, name: string }[];
  componentMap: Record<string, string>; // Map componentId to component name
}

const JobList: React.FC<JobListProps> = ({ 
  jobs, 
  isLoading, 
  shipOptions, 
  engineerOptions,
  componentMap 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shipFilter, setShipFilter] = useState('all_ships');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all_statuses'>('all_statuses');
  const [priorityFilter, setPriorityFilter] = useState<JobPriority | 'all_priorities'>('all_priorities');
  
  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter(job => {
    const componentName = componentMap[job.componentId] || '';
    const shipName = shipOptions.find(s => s.id === job.shipId)?.name || '';
    const engineerName = engineerOptions.find(e => e.id === job.assignedEngineerId)?.name || '';
    
    const matchesSearch = 
      job.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineerName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesShip = shipFilter && shipFilter !== 'all_ships' ? job.shipId === shipFilter : true;
    const matchesStatus = statusFilter && statusFilter !== 'all_statuses' ? job.status === statusFilter : true;
    const matchesPriority = priorityFilter && priorityFilter !== 'all_priorities' ? job.priority === priorityFilter : true;
    
    return matchesSearch && matchesShip && matchesStatus && matchesPriority;
  });
  
  // Sort jobs by scheduled date (newest first)
  const sortedJobs = [...filteredJobs].sort(
    (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
  );
  
  return (
    <>
      <Card className="bg-white dark:bg-gray-800 mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search jobs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Select value={shipFilter} onValueChange={setShipFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Ships" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_ships">All Ships</SelectItem>
                  {shipOptions.map(ship => (
                    <SelectItem key={ship.id} value={ship.id}>{ship.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as JobStatus | '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_statuses">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select 
                value={priorityFilter} 
                onValueChange={(value) => setPriorityFilter(value as JobPriority | '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_priorities">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Ship</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Engineer</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    Loading jobs...
                  </TableCell>
                </TableRow>
              ) : sortedJobs.length > 0 ? (
                sortedJobs.map((job) => {
                  const ship = shipOptions.find(s => s.id === job.shipId);
                  const engineer = engineerOptions.find(e => e.id === job.assignedEngineerId);
                  const componentName = componentMap[job.componentId] || 'Unknown Component';
                  
                  return (
                    <TableRow key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900 dark:text-amber-300">
                            <WrenchIcon className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{job.type}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">#{job.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {ship?.name || 'Unknown Ship'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {componentName}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${job.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                            ${job.priority === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : ''}
                            ${job.priority === 'Low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                          `}
                        >
                          {job.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${job.status === 'Open' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : ''}
                            ${job.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                            ${job.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                            ${job.status === 'Cancelled' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' : ''}
                          `}
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {engineer?.name || 'Unassigned'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDateForDisplay(job.scheduledDate)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link href={`/jobs/${job.id}`}>
                          <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        {job.status !== 'Completed' && job.status !== 'Cancelled' && (
                          <Link href={`/jobs/${job.id}?edit=true`}>
                            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Update Status
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500 dark:text-gray-400">
                    No jobs found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default JobList;
