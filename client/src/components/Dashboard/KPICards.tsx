import React from 'react';
import { 
  Ship as ShipIcon, 
  Drill as ToolIcon, 
  Settings as SettingsIcon, 
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  AlertTriangle as AlertTriangleIcon,
  Clock as ClockIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';


interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  additionalInfo?: React.ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  additionalInfo
}) => {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <div className={`p-2 rounded-full ${iconBgColor} ${iconColor}`}>
            {icon}
          </div>
        </div>
        <div className="flex items-end">
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</span>
          {additionalInfo && (
            <span className="ml-2 text-xs flex items-center">
              {additionalInfo}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface KPICardsProps {
  totalShips: number;
  componentsCount: number;
  componentsNeedingMaintenance: number;
  jobsInProgress: number;
  highPriorityJobs: number;
  completedJobs: number;
  completedThisWeek: number;
}

const KPICards: React.FC<KPICardsProps> = ({
  totalShips,
  componentsCount,
  componentsNeedingMaintenance,
  jobsInProgress,
  highPriorityJobs,
  completedJobs,
  completedThisWeek
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KPICard
        title="Total Ships"
        value={totalShips}
        icon={<ShipIcon className="h-5 w-5" />}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-500"
        additionalInfo={
          <span className="text-green-500 flex items-center">
            <TrendingUpIcon className="h-3 w-3 mr-1" /> Active fleet
          </span>
        }
      />
      
      <KPICard
        title="Components"
        value={componentsCount}
        icon={<ToolIcon className="h-5 w-5" />}
        iconBgColor="bg-purple-100"
        iconColor="text-purple-500"
        additionalInfo={
          <span className="text-amber-500 flex items-center">
            <AlertTriangleIcon className="h-3 w-3 mr-1" /> {componentsNeedingMaintenance} maintenance due
          </span>
        }
      />
      
      <KPICard
        title="Jobs in Progress"
        value={jobsInProgress}
        icon={<SettingsIcon className="h-5 w-5" />}
        iconBgColor="bg-amber-100"
        iconColor="text-amber-500"
        additionalInfo={
          <span className="text-red-500 flex items-center">
            <AlertTriangleIcon className="h-3 w-3 mr-1" /> {highPriorityJobs} high priority
          </span>
        }
      />
      
      <KPICard
        title="Completed Jobs"
        value={completedJobs}
        icon={<CheckCircleIcon className="h-5 w-5" />}
        iconBgColor="bg-green-100"
        iconColor="text-green-500"
        additionalInfo={
          <span className="text-green-500 flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" /> {completedThisWeek} this week
          </span>
        }
      />
    </div>
  );
};

export default KPICards;
