import React from 'react';
import { Ship, ShipComponent, Job } from '../../types';
import { Link } from 'wouter';
import { formatDateForDisplay } from '../../utils/dateUtils';
import { 
  ChevronRightIcon, 
  ShipIcon, 
  InfoIcon, 
  FlagIcon, 
  Drill, 
  CalendarIcon,
  ClockIcon 
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ShipDetailProps {
  ship: Ship;
  components: ShipComponent[];
  jobs: Job[];
}

const ShipDetail: React.FC<ShipDetailProps> = ({ ship, components, jobs }) => {
  return (
    <div className="space-y-6">
      {/* Ship Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="h-12 w-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <ShipIcon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{ship.name}</h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>IMO: {ship.imo}</span>
              <ChevronRightIcon className="h-4 w-4 mx-2" />
              <span>Flag: {ship.flag}</span>
              <ChevronRightIcon className="h-4 w-4 mx-2" />
              <Badge 
                variant="outline" 
                className={`
                  ${ship.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                  ${ship.status === 'Under Maintenance' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : ''}
                  ${ship.status === 'Inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                `}
              >
                {ship.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link href={`/ships/${ship.id}?edit=true`}>
            <Button variant="outline">Edit Ship</Button>
          </Link>
          <Link href="/components?add=true&shipId=ship.id">
            <Button variant="outline">
              <Drill className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </Link>
          <Link href="/jobs?add=true&shipId=ship.id">
            <Button 
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              Create Job
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Ship Details Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">
            <InfoIcon className="h-4 w-4 mr-2" />
            General Information
          </TabsTrigger>
          <TabsTrigger value="components">
            <Drill className="h-4 w-4 mr-2" />
            Components ({components.length})
          </TabsTrigger>
          <TabsTrigger value="jobs">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Maintenance History ({jobs.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="mt-4">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Ship Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ship Name</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-white">{ship.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">IMO Number</h3>
                    <p className="mt-1 text-base text-gray-900 dark:text-white">{ship.imo}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Flag</h3>
                    <div className="mt-1 flex items-center">
                      <FlagIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-base text-gray-900 dark:text-white">{ship.flag}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <p className="mt-1">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${ship.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                          ${ship.status === 'Under Maintenance' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : ''}
                          ${ship.status === 'Inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                        `}
                      >
                        {ship.status}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="components" className="mt-4">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Installed Components</CardTitle>
              <Link href={`/components?add=true&shipId=${ship.id}`}>
                <Button size="sm">
                  Add Component
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {components.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Component Name</TableHead>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Installation Date</TableHead>
                        <TableHead>Last Maintenance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {components.map((component) => {
                        // Calculate if maintenance is overdue (for demo purposes, using 6 months as threshold)
                        const lastMaintenance = new Date(component.lastMaintenanceDate);
                        const sixMonthsAgo = new Date();
                        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                        
                        const maintenanceStatus = lastMaintenance < sixMonthsAgo 
                          ? 'Overdue' 
                          : 'Up to Date';
                          
                        return (
                          <TableRow key={component.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                            <TableCell className="font-medium">
                              {component.name}
                            </TableCell>
                            <TableCell>
                              {component.serialNumber}
                            </TableCell>
                            <TableCell>
                              {formatDateForDisplay(component.installDate)}
                            </TableCell>
                            <TableCell>
                              {formatDateForDisplay(component.lastMaintenanceDate)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={`
                                  ${maintenanceStatus === 'Up to Date' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                                  ${maintenanceStatus === 'Overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                                `}
                              >
                                {maintenanceStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/components/${component.id}`}>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </Link>
                              <Link href={`/jobs?add=true&componentId=${component.id}&shipId=${ship.id}`}>
                                <Button variant="outline" size="sm">
                                  Schedule Maintenance
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <Drill className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No components installed on this ship yet.</p>
                  <Link href={`/components?add=true&shipId=${ship.id}`}>
                    <Button variant="outline" className="mt-3">
                      Add First Component
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobs" className="mt-4">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Maintenance History</CardTitle>
              <Link href={`/jobs?add=true&shipId=${ship.id}`}>
                <Button size="sm">
                  Create New Job
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {jobs.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Type</TableHead>
                        <TableHead>Component</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Scheduled Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => {
                        // Find the component for this job
                        const component = components.find(c => c.id === job.componentId);
                        
                        return (
                          <TableRow key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                            <TableCell className="font-medium">
                              {job.type}
                            </TableCell>
                            <TableCell>
                              {component?.name || 'Unknown Component'}
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
                            <TableCell>
                              <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                                {formatDateForDisplay(job.scheduledDate)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/jobs/${job.id}`}>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </Link>
                              {job.status !== 'Completed' && job.status !== 'Cancelled' && (
                                <Link href={`/jobs/${job.id}?edit=true`}>
                                  <Button variant="outline" size="sm">
                                    Update Status
                                  </Button>
                                </Link>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No maintenance jobs for this ship yet.</p>
                  <Link href={`/jobs?add=true&shipId=${ship.id}`}>
                    <Button variant="outline" className="mt-3">
                      Create First Job
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShipDetail;
