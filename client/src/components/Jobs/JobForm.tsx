import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Job, JobPriority, JobStatus, JobType } from '../../types';
import { formatDateToYYYYMMDD } from '../../utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Schema for job form
const jobSchema = z.object({
  type: z.enum(['Inspection', 'Repair', 'Replacement', 'Overhaul']),
  shipId: z.string().min(1, { message: 'Please select a ship' }),
  componentId: z.string().min(1, { message: 'Please select a component' }),
  priority: z.enum(['High', 'Medium', 'Low']),
  status: z.enum(['Open', 'In Progress', 'Completed', 'Cancelled']),
  assignedEngineerId: z.string().min(1, { message: 'Please assign an engineer' }),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Please enter a valid date (YYYY-MM-DD)' }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof jobSchema>;

interface JobFormProps {
  job?: Job; // If editing, job will be provided
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
  shipOptions: { id: string, name: string }[];
  componentOptions: { id: string, name: string, shipId: string }[];
  engineerOptions: { id: string, name: string }[];
  preSelectedShipId?: string;
  preSelectedComponentId?: string;
}

const JobForm: React.FC<JobFormProps> = ({
  job,
  onSubmit,
  isLoading,
  shipOptions,
  componentOptions,
  engineerOptions,
  preSelectedShipId,
  preSelectedComponentId
}) => {
  const today = formatDateToYYYYMMDD(new Date());
  const initialShipId = preSelectedShipId || job?.shipId || '';
  
  // Filter component options based on selected ship
  const [filteredComponents, setFilteredComponents] = React.useState(
    componentOptions.filter(c => c.shipId === initialShipId)
  );
  
  const form = useForm<FormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: job ? {
      ...job
    } : {
      type: 'Inspection',
      shipId: initialShipId,
      componentId: preSelectedComponentId || '',
      priority: 'Medium',
      status: 'Open',
      assignedEngineerId: '',
      scheduledDate: today,
      description: '',
    },
  });
  
  // Watch the shipId field to update component options
  const watchedShipId = form.watch('shipId');
  
  React.useEffect(() => {
    // Update filtered components when ship changes
    setFilteredComponents(
      componentOptions.filter(c => c.shipId === watchedShipId)
    );
    
    // Reset componentId if the selected ship changes
    if (watchedShipId !== initialShipId) {
      form.setValue('componentId', '');
    }
  }, [watchedShipId, componentOptions, initialShipId, form]);
  
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>{job ? 'Edit Maintenance Job' : 'Create New Maintenance Job'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Inspection">Inspection</SelectItem>
                        <SelectItem value="Repair">Repair</SelectItem>
                        <SelectItem value="Replacement">Replacement</SelectItem>
                        <SelectItem value="Overhaul">Overhaul</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="shipId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ship</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!!preSelectedShipId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a ship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shipOptions.map(ship => (
                          <SelectItem key={ship.id} value={ship.id}>
                            {ship.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="componentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!watchedShipId || !!preSelectedComponentId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={watchedShipId ? "Select a component" : "Select a ship first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredComponents.map(component => (
                          <SelectItem key={component.id} value={component.id}>
                            {component.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="assignedEngineerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Engineer</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Assign an engineer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {engineerOptions.map(engineer => (
                          <SelectItem key={engineer.id} value={engineer.id}>
                            {engineer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheduled Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
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
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter additional details about the job"
                      className="h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
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
                {isLoading ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default JobForm;
