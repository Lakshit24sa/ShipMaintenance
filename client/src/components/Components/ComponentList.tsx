import React, { useState } from 'react';
import { Link } from 'wouter';
import { ShipComponent } from '../../types';
import { Drill, Settings, Search, PencilIcon, TrashIcon, EyeIcon, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { getMaintenanceStatus, formatDateForDisplay } from '../../utils/dateUtils';
import { Badge } from '@/components/ui/badge';

interface ComponentListProps {
  components: ShipComponent[];
  onDelete: (id: string) => void;
  isLoading: boolean;
  shipOptions: { id: string, name: string }[];
}

const ComponentList: React.FC<ComponentListProps> = ({ 
  components, 
  onDelete, 
  isLoading,
  shipOptions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shipFilter, setShipFilter] = useState('');
  const [maintenanceFilter, setMaintenanceFilter] = useState('');
  const [deleteComponentId, setDeleteComponentId] = useState<string | null>(null);
  
  // Filter components based on search term and filters
  const filteredComponents = components.filter(component => {
    const matchesSearch = 
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesShip = shipFilter ? component.shipId === shipFilter : true;
    
    const status = getMaintenanceStatus(component.lastMaintenanceDate);
    const matchesMaintenance = maintenanceFilter ? status === maintenanceFilter : true;
    
    return matchesSearch && matchesShip && matchesMaintenance;
  });
  
  const handleDeleteConfirm = () => {
    if (deleteComponentId) {
      onDelete(deleteComponentId);
      setDeleteComponentId(null);
    }
  };
  
  return (
    <>
      <Card className="bg-white dark:bg-gray-800 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search components by name or serial number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="w-40">
                <Select value={shipFilter} onValueChange={setShipFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Ships" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Ships</SelectItem>
                    {shipOptions.map(ship => (
                      <SelectItem key={ship.id} value={ship.id}>{ship.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-48">
                <Select value={maintenanceFilter} onValueChange={setMaintenanceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="Up to Date">Maintenance Up to Date</SelectItem>
                    <SelectItem value="Due Soon">Maintenance Due</SelectItem>
                    <SelectItem value="Overdue">Maintenance Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component Name</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Ship</TableHead>
                <TableHead>Installation Date</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Loading components...
                  </TableCell>
                </TableRow>
              ) : filteredComponents.length > 0 ? (
                filteredComponents.map((component) => {
                  const maintenanceStatus = getMaintenanceStatus(component.lastMaintenanceDate);
                  const ship = shipOptions.find(s => s.id === component.shipId);
                  
                  return (
                    <TableRow key={component.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                            <Drill className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{component.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {component.serialNumber}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {ship?.name || 'Unknown Ship'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDateForDisplay(component.installDate)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDateForDisplay(component.lastMaintenanceDate)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${maintenanceStatus === 'Up to Date' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                            ${maintenanceStatus === 'Due Soon' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : ''}
                            ${maintenanceStatus === 'Overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                          `}
                        >
                          {maintenanceStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Link href={`/jobs?add=true&componentId=${component.id}&shipId=${component.shipId}`}>
                          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => setDeleteComponentId(component.id)}
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500 dark:text-gray-400">
                    No components found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      <AlertDialog open={!!deleteComponentId} onOpenChange={(open) => !open && setDeleteComponentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this component?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the component and all its associated maintenance jobs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ComponentList;
