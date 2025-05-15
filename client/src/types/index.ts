// User types
export type UserRole = 'Admin' | 'Inspector' | 'Engineer';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}


// Ship types
export type ShipStatus = 'Active' | 'Under Maintenance' | 'Inactive';

export interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: string;
  status: ShipStatus;
}

// Component types
export interface ShipComponent {
  id: string;
  shipId: string;
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
}

// Job types
export type JobPriority = 'High' | 'Medium' | 'Low';
export type JobStatus = 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
export type JobType = 'Inspection' | 'Repair' | 'Replacement' | 'Overhaul';

export interface Job {
  id: string;
  componentId: string;
  shipId: string;
  type: JobType;
  priority: JobPriority;
  status: JobStatus;
  assignedEngineerId: string;
  scheduledDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export type NotificationType = 'Job Created' | 'Job Updated' | 'Job Completed';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  isRead: boolean;
  relatedEntityId?: string; // Can be job ID, ship ID, etc.
}

// Dashboard stats
export interface DashboardStats {
  totalShips: number;
  componentsNeedingMaintenance: number;
  jobsInProgress: number;
  completedJobs: number;
}

// Calendar event
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  jobId: string;
  shipId: string;
  priority: JobPriority;
}
