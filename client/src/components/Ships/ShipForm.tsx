import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ship } from '../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const shipSchema = z.object({
  name: z.string().min(2, { message: 'Ship name must be at least 2 characters' }),
  imo: z.string().regex(/^\d{7}$/, { message: 'IMO number must be exactly 7 digits' }),
  flag: z.string().min(2, { message: 'Flag must be at least 2 characters' }),
  status: z.enum(['Active', 'Under Maintenance', 'Inactive']),
});

type FormValues = z.infer<typeof shipSchema>;

interface ShipFormProps {
  ship?: Ship; // If editing, ship will be provided
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
}

const ShipForm: React.FC<ShipFormProps> = ({ ship, onSubmit, isLoading }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(shipSchema),
    defaultValues: ship || {
      name: '',
      imo: '',
      flag: '',
      status: 'Active',
    },
  });
  
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>{ship ? 'Edit Ship' : 'Add New Ship'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ship Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter ship name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IMO Number</FormLabel>
                  <FormControl>
                    <Input placeholder="7-digit IMO number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="flag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flag</FormLabel>
                  <FormControl>
                    <Input placeholder="Country flag" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ship status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary-600 hover:bg-primary-700"
              >
                {isLoading ? 'Saving...' : ship ? 'Update Ship' : 'Add Ship'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ShipForm;
