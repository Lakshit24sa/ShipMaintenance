import React from 'react';
import { Link } from 'wouter';
import { Job } from '../../types';
import { formatDateForDisplay, formatTimeAgo } from '../../utils/dateUtils';
import { 
  WrenchIcon, 
  ClockIcon, 
  UserIcon,
  ShipIcon,
  Drill,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  ArrowRightIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface JobDetailProps {
  job: Job;
  shipName: string;
  componentName: string;
  engineerName: string;
  onStatusUpdate: (jobId: string, newStatus: Job['status']) => void;
  isUpdating: boolean;
}



const JobDetail: React.FC<JobDetailProps> = ({
  job,
  shipName,
  componentName,
  engineerName,
  onStatusUpdate,
  isUpdating
}) => {
  return (
    <div className="space-y-6">
      {/* Job Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="h-12 w-12 flex-shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900 dark:text-amber-300">
            <WrenchIcon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.type}</h1>
              <Badge 
                variant="outline" 
                className={`ml-3
                  ${job.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                  ${job.priority === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : ''}
                  ${job.priority === 'Low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                `}
              >
                {job.priority} Priority
              </Badge>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              #{job.id.substring(0, 8)} • Created {formatTimeAgo(job.createdAt)}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link href={`/jobs/${job.id}?edit=true`}>
            <Button variant="outline">Edit Job</Button>
          </Link>
          {job.status !== 'Completed' && job.status !== 'Cancelled' && (
            <>
              <Button
                onClick={() => onStatusUpdate(job.id, 'Completed')}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Mark Completed
              </Button>
              <Button
                onClick={() => onStatusUpdate(job.id, 'Cancelled')}
                disabled={isUpdating}
                variant="destructive"
              >
                <XCircleIcon className="h-4 w-4 mr-2" />
                Cancel Job
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Job Status */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Badge 
              className={`text-sm py-1 px-3
                ${job.status === 'Open' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : ''}
                ${job.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                ${job.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                ${job.status === 'Cancelled' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' : ''}
              `}
            >
              {job.status}
            </Badge>
            {job.status !== 'Completed' && job.status !== 'Cancelled' && job.status !== 'In Progress' && (
              <Button
                onClick={() => onStatusUpdate(job.id, 'In Progress')}
                disabled={isUpdating}
                size="sm"
                className="ml-4"
              >
                <ArrowRightIcon className="h-4 w-4 mr-2" />
                Start Work
              </Button>
            )}
            <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
              Last updated: {formatTimeAgo(job.updatedAt)}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Maintenance Type</div>
              <div className="flex items-center mt-1">
                <WrenchIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-900 dark:text-gray-100">{job.type}</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</div>
              <div className="mt-1">
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
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled Date</div>
              <div className="flex items-center mt-1">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-900 dark:text-gray-100">{formatDateForDisplay(job.scheduledDate)}</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Engineer</div>
              <div className="flex items-center mt-1">
                <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-900 dark:text-gray-100">{engineerName}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Related Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Ship</div>
              <div className="flex items-center mt-1">
                <ShipIcon className="h-4 w-4 mr-2 text-gray-400" />
                <Link href={`/ships/${job.shipId}`}>
                  <a className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                    {shipName}
                  </a>
                </Link>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Component</div>
              <div className="flex items-center mt-1">
                <Drill className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-900 dark:text-gray-100">{componentName}</span>
              </div>
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</div>
              <div className="flex items-center mt-1">
                <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-900 dark:text-gray-100">
                  {formatDateForDisplay(job.createdAt)} ({formatTimeAgo(job.createdAt)})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Job Description */}
      {job.description && (
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobDetail;
