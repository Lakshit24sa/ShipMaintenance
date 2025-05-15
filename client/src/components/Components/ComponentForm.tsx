import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShipComponent } from '../../types';
import { formatDateToYYYYMMDD } from '../../utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const componentSchema = z.object({
  name: z.string().min(2, { message: 'Component name must be at least 2 characters' }),
  serialNumber: z.string().min(2, { message: 'Serial number is required' }),
  shipId: z.string().min(1, { message: 'Please select a ship' }),
  installDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Please enter a valid date (YYYY-MM-DD)' }),
  lastMaintenanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Please enter a valid date (YYYY-MM-DD)' }),
});

type FormValues = z.infer<typeof componentSchema>;

interface ComponentFormProps {
  component?: ShipComponent; // If editing, component will be provided
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
  shipOptions: { id: string, name: string }[];
  preSelectedShipId?: string; // For when coming from a ship detail page
}

const ComponentForm: React.FC<ComponentFormProps> = ({ 
  component, 
  onSubmit, 
  isLoading, 
  shipOptions,
  preSelectedShipId
}) => {
  const today = formatDateToYYYYMMDD(new Date());
  
  const form = useForm<FormValues>({
    resolver: zodResolver(componentSchema),
    defaultValues: component ? {
      ...component,
    } : {
      name: '',
      serialNumber: '',
      shipId: preSelectedShipId || '',
      installDate: today,
      lastMaintenanceDate: today,
    },
  });
  
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>{component ? 'Edit Component' : 'Add New Component'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Component Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter component name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter serial number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="shipId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ship</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a ship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shipOptions.map(ship => (
                        <SelectItem key={ship.id} value={ship.id}>{ship.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="installDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installation Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastMaintenanceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Maintenance Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Saving...' : component ? 'Update Component' : 'Add Component'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ComponentForm;
