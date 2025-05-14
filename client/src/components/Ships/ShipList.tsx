import React, { useState } from 'react';
import { Link } from 'wouter';
import { Ship } from '../../types';
import { ShipIcon, PencilIcon, TrashIcon, EyeIcon, Search } from 'lucide-react';
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

interface ShipListProps {
  ships: Ship[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const ShipList: React.FC<ShipListProps> = ({ ships, onDelete, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [flagFilter, setFlagFilter] = useState('');
  const [deleteShipId, setDeleteShipId] = useState<string | null>(null);
  
  // Filter ships based on search term and filters
  const filteredShips = ships.filter(ship => {
    const matchesSearch = 
      ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship.imo.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter ? ship.status === statusFilter : true;
    const matchesFlag = flagFilter ? ship.flag === flagFilter : true;
    
    return matchesSearch && matchesStatus && matchesFlag;
  });
  
  // Get unique flags for filter
  const uniqueFlags = Array.from(new Set(ships.map(ship => ship.flag)));
  
  const handleDeleteConfirm = () => {
    if (deleteShipId) {
      onDelete(deleteShipId);
      setDeleteShipId(null);
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
                  placeholder="Search ships by name or IMO"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-40">
                <Select value={flagFilter} onValueChange={setFlagFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Flags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Flags</SelectItem>
                    {uniqueFlags.map(flag => (
                      <SelectItem key={flag} value={flag}>{flag}</SelectItem>
                    ))}
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
                <TableHead>Ship Name</TableHead>
                <TableHead>IMO Number</TableHead>
                <TableHead>Flag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Loading ships...
                  </TableCell>
                </TableRow>
              ) : filteredShips.length > 0 ? (
                filteredShips.map((ship) => (
                  <TableRow key={ship.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                          <ShipIcon className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{ship.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                      {ship.imo}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                      {ship.flag}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ship.status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : ship.status === 'Under Maintenance' 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {ship.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/ships/${ship.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/ships/${ship.id}?edit=true`}>
                        <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => setDeleteShipId(ship.id)}
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500 dark:text-gray-400">
                    No ships found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      <AlertDialog open={!!deleteShipId} onOpenChange={(open) => !open && setDeleteShipId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this ship?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the ship and all its associated components and maintenance jobs.
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

export default ShipList;
