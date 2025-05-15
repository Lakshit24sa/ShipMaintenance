import React, { useState } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job, JobPriority } from '../../types';
import { 
  getDaysInMonth, 
  isCurrentMonth, 
  isSameDay,
  formatDateForDisplay
} from '../../utils/dateUtils';


interface SelectedDayJob extends Job {
  componentName: string;
  shipName: string;
}

interface MaintenanceCalendarProps {
  jobs: Job[];
  componentMap: Record<string, string>; // Map componentId to component name
  shipMap: Record<string, string>; // Map shipId to ship name
}

const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({
  jobs,
  componentMap,
  shipMap
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<SelectedDayJob[]>([]);
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Get the days in the current month/week view
  const daysInView = calendarView === 'month' 
    ? getDaysInMonth(currentYear, currentMonth)
    : getWeekDays(currentDate);
  
  // Map dates to jobs for quick lookup
  const jobsByDate = new Map<string, Job[]>();
  
  jobs.forEach(job => {
    const dateKey = job.scheduledDate.split('T')[0];
    if (!jobsByDate.has(dateKey)) {
      jobsByDate.set(dateKey, []);
    }
    jobsByDate.get(dateKey)?.push(job);
  });
  
  // Get days for the week view
  function getWeekDays(date: Date): Date[] {
    const result = [];
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for starting week on Monday
    
    const firstDay = new Date(date);
    firstDay.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(firstDay);
      nextDay.setDate(firstDay.getDate() + i);
      result.push(nextDay);
    }
    
    return result;
  }
  
  // Functions to navigate between months/weeks
  const prevMonth = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };
  
  const nextMonth = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Function to handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    
    // Find jobs scheduled for this date
    const dateKey = date.toISOString().split('T')[0];
    const jobsOnDate = jobsByDate.get(dateKey) || [];
    
    // Add component and ship names
    const detailedJobs = jobsOnDate.map(job => ({
      ...job,
      componentName: componentMap[job.componentId] || 'Unknown Component',
      shipName: shipMap[job.shipId] || 'Unknown Ship'
    }));
    
    setSelectedJobs(detailedJobs);
  };
  
  // Generate month name and year for header
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const yearNumber = currentDate.getFullYear();
  
  // Get priority color class
  const getPriorityColorClass = (priority: JobPriority): string => {
    switch (priority) {
      case 'High':
        return 'border-red-500 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Medium':
        return 'border-amber-500 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'Low':
        return 'border-primary-500 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300';
      default:
        return 'border-gray-500 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mx-4">
                {monthName} {yearNumber}
              </h3>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRightIcon className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <div className="flex border rounded-md overflow-hidden">
                <Button 
                  variant={calendarView === 'month' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setCalendarView('month')}
                  className="rounded-none"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Month
                </Button>
                <Button 
                  variant={calendarView === 'week' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setCalendarView('week')}
                  className="rounded-none"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Week
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Calendar Grid */}
      <Card className="bg-white dark:bg-gray-800 overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div 
              key={day} 
              className="bg-white dark:bg-gray-800 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days grid */}
        <div 
          className={`grid grid-cols-7 ${calendarView === 'month' ? 'grid-rows-5' : 'grid-rows-1'} gap-px bg-gray-200 dark:bg-gray-700`}
        >
          {daysInView.map((date, index) => {
            const dateKey = date.toISOString().split('T')[0];
            const dayJobs = jobsByDate.get(dateKey) || [];
            const isCurrentMonthDay = isCurrentMonth(date, currentMonth);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            
            return (
              <div 
                key={index}
                className={`min-h-[120px] ${
                  isCurrentMonthDay 
                    ? 'bg-white dark:bg-gray-800' 
                    : 'bg-gray-50 dark:bg-gray-900'
                  } ${isSelected ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''} p-2 cursor-pointer`}
                onClick={() => handleDateClick(date)}
              >
                <div className={`text-sm ${
                  isCurrentMonthDay 
                    ? 'font-medium text-gray-900 dark:text-gray-100' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {date.getDate()}
                </div>
                
                {/* Jobs for this day */}
                <div className="mt-1 space-y-1">
                  {dayJobs.slice(0, 2).map((job) => (
                    <div 
                      key={job.id} 
                      className={`text-xs rounded p-1 truncate border-l-2 ${getPriorityColorClass(job.priority)}`}
                    >
                      {job.type} - {shipMap[job.shipId] || 'Unknown Ship'}
                    </div>
                  ))}
                  {dayJobs.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 pl-1">
                      +{dayJobs.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Selected Day Details */}
      {selectedDate && (
        <div className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Scheduled Jobs for {formatDateForDisplay(selectedDate.toISOString())}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedJobs.length > 0 ? (
                <div className="space-y-4">
                  {selectedJobs.map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900 dark:text-amber-300">
                            <CalendarIcon className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {job.type} - {job.componentName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {job.shipName} - {job.priority} Priority
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge 
                            variant="outline" 
                            className={`mr-4
                              ${job.status === 'Open' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : ''}
                              ${job.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                              ${job.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                              ${job.status === 'Cancelled' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' : ''}
                            `}
                          >
                            {job.status}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            asChild
                          >
                            <a href={`/jobs/${job.id}`}>View Details</a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No jobs scheduled for this date.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MaintenanceCalendar;
