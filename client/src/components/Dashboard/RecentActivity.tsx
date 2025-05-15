import React from 'react';
import { formatTimeAgo } from '../../utils/dateUtils';
import { ShipIcon, CheckCircleIcon, AlertTriangleIcon, UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'ship_added' | 'job_completed' | 'maintenance_due' | 'engineer_assigned';
}


interface RecentActivityProps {
  activities: ActivityItem[];
}

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'ship_added':
      return (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 dark:bg-blue-900 dark:text-blue-300">
          <ShipIcon className="h-4 w-4" />
        </div>
      );
    case 'job_completed':
      return (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 dark:bg-green-900 dark:text-green-300">
          <CheckCircleIcon className="h-4 w-4" />
        </div>
      );
    case 'maintenance_due':
      return (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 dark:bg-amber-900 dark:text-amber-300">
          <AlertTriangleIcon className="h-4 w-4" />
        </div>
      );
    case 'engineer_assigned':
      return (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 dark:bg-purple-900 dark:text-purple-300">
          <UserIcon className="h-4 w-4" />
        </div>
      );
    default:
      return null;
  }
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="mt-6">
      <CardHeader className="px-0 pt-0 pb-3">
        <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-300">
          Recent Activity
        </CardTitle>
      </CardHeader>
      
      <Card className="bg-white dark:bg-gray-800 overflow-hidden">
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <li key={activity.id} className="px-4 py-3 flex items-center hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  {getActivityIcon(activity.type)}
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.description}</p>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{formatTimeAgo(activity.timestamp)}</div>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                No recent activities
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivity;
