import { User, Ship, ShipComponent, Job, Notification } from "../types";

// Local Storage Keys
const USERS_KEY = 'entnt_users';
const SHIPS_KEY = 'entnt_ships';
const COMPONENTS_KEY = 'entnt_components';
const JOBS_KEY = 'entnt_jobs';
const NOTIFICATIONS_KEY = 'entnt_notifications';
const CURRENT_USER_KEY = 'entnt_current_user';

// Initialize local storage with default data if empty
export function initializeLocalStorage() {
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUsers: User[] = [
      { id: '1', name: 'Admin', email: 'admin@entnt.in', password: 'admin123', role: 'Admin' },
      { id: '2', name: 'Inspector', email: 'inspector@entnt.in', password: 'inspect123', role: 'Inspector' },
      { id: '3', name: 'Engineer', email: 'engineer@entnt.in', password: 'engine123', role: 'Engineer' }
    ];
    setUsers(defaultUsers);
  }
  
  if (!localStorage.getItem(SHIPS_KEY)) {
    const defaultShips: Ship[] = [
      { id: 's1', name: 'Ever Given', imo: '9811000', flag: 'Panama', status: 'Active' },
      { id: 's2', name: 'Maersk Alabama', imo: '9164263', flag: 'USA', status: 'Under Maintenance' }
    ];
    setShips(defaultShips);
  }
  
  if (!localStorage.getItem(COMPONENTS_KEY)) {
    const defaultComponents: ShipComponent[] = [
      { 
        id: 'c1', 
        shipId: 's1', 
        name: 'Main Engine', 
        serialNumber: 'ME-1234', 
        installDate: '2020-01-10', 
        lastMaintenanceDate: '2024-03-12' 
      },
      { 
        id: 'c2', 
        shipId: 's2', 
        name: 'Radar', 
        serialNumber: 'RAD-5678', 
        installDate: '2021-07-18', 
        lastMaintenanceDate: '2023-12-01' 
      }
    ];
    setComponents(defaultComponents);
  }
  
  if (!localStorage.getItem(JOBS_KEY)) {
    const defaultJobs: Job[] = [
      { 
        id: 'j1', 
        componentId: 'c1', 
        shipId: 's1', 
        type: 'Inspection', 
        priority: 'High', 
        status: 'Open', 
        assignedEngineerId: '3', 
        scheduledDate: '2025-05-05',
        description: 'Regular inspection of main engine components',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    setJobs(defaultJobs);
  }
  
  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    setNotifications([]);
  }
}

// User Functions
export function getUsers(): User[] {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function setUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.email === email);
}

export function createUser(user: Omit<User, 'id'>): User {
  const users = getUsers();
  const newUser: User = { 
    ...user, 
    id: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  };
  
  setUsers([...users, newUser]);
  return newUser;
}

export function updateUser(user: User): User {
  const users = getUsers();
  const updatedUsers = users.map(u => u.id === user.id ? user : u);
  setUsers(updatedUsers);
  return user;
}

export function deleteUser(id: string): void {
  const users = getUsers();
  const updatedUsers = users.filter(user => user.id !== id);
  setUsers(updatedUsers);
}

// Ship Functions
export function getShips(): Ship[] {
  const ships = localStorage.getItem(SHIPS_KEY);
  return ships ? JSON.parse(ships) : [];
}

export function setShips(ships: Ship[]): void {
  localStorage.setItem(SHIPS_KEY, JSON.stringify(ships));
}

export function getShipById(id: string): Ship | undefined {
  const ships = getShips();
  return ships.find(ship => ship.id === id);
}

export function createShip(ship: Omit<Ship, 'id'>): Ship {
  const ships = getShips();
  const newShip: Ship = { 
    ...ship, 
    id: `ship_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  };
  
  setShips([...ships, newShip]);
  return newShip;
}

export function updateShip(ship: Ship): Ship {
  const ships = getShips();
  const updatedShips = ships.map(s => s.id === ship.id ? ship : s);
  setShips(updatedShips);
  return ship;
}

export function deleteShip(id: string): void {
  const ships = getShips();
  const updatedShips = ships.filter(ship => ship.id !== id);
  setShips(updatedShips);
  
  // Also delete associated components and jobs
  const components = getComponents();
  const updatedComponents = components.filter(component => component.shipId !== id);
  setComponents(updatedComponents);
  
  const jobs = getJobs();
  const updatedJobs = jobs.filter(job => job.shipId !== id);
  setJobs(updatedJobs);
}

// Component Functions
export function getComponents(): ShipComponent[] {
  const components = localStorage.getItem(COMPONENTS_KEY);
  return components ? JSON.parse(components) : [];
}

export function setComponents(components: ShipComponent[]): void {
  localStorage.setItem(COMPONENTS_KEY, JSON.stringify(components));
}

export function getComponentById(id: string): ShipComponent | undefined {
  const components = getComponents();
  return components.find(component => component.id === id);
}

export function getComponentsByShipId(shipId: string): ShipComponent[] {
  const components = getComponents();
  return components.filter(component => component.shipId === shipId);
}

export function createComponent(component: Omit<ShipComponent, 'id'>): ShipComponent {
  const components = getComponents();
  const newComponent: ShipComponent = { 
    ...component, 
    id: `component_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  };
  
  setComponents([...components, newComponent]);
  return newComponent;
}

export function updateComponent(component: ShipComponent): ShipComponent {
  const components = getComponents();
  const updatedComponents = components.map(c => c.id === component.id ? component : c);
  setComponents(updatedComponents);
  return component;
}

export function deleteComponent(id: string): void {
  const components = getComponents();
  const updatedComponents = components.filter(component => component.id !== id);
  setComponents(updatedComponents);
  
  // Also delete associated jobs
  const jobs = getJobs();
  const updatedJobs = jobs.filter(job => job.componentId !== id);
  setJobs(updatedJobs);
}

// Job Functions
export function getJobs(): Job[] {
  const jobs = localStorage.getItem(JOBS_KEY);
  return jobs ? JSON.parse(jobs) : [];
}

export function setJobs(jobs: Job[]): void {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function getJobById(id: string): Job | undefined {
  const jobs = getJobs();
  return jobs.find(job => job.id === id);
}

export function getJobsByShipId(shipId: string): Job[] {
  const jobs = getJobs();
  return jobs.filter(job => job.shipId === shipId);
}

export function getJobsByComponentId(componentId: string): Job[] {
  const jobs = getJobs();
  return jobs.filter(job => job.componentId === componentId);
}

export function getJobsByEngineer(engineerId: string): Job[] {
  const jobs = getJobs();
  return jobs.filter(job => job.assignedEngineerId === engineerId);
}

export function createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job {
  const jobs = getJobs();
  const now = new Date().toISOString();
  const newJob: Job = { 
    ...job, 
    id: `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    createdAt: now,
    updatedAt: now
  };
  
  setJobs([...jobs, newJob]);
  
  // Create notification for new job
  createNotification({
    type: 'Job Created',
    message: `New ${job.type} job created for ${getShipById(job.shipId)?.name || 'Unknown Ship'}`,
    isRead: false,
    relatedEntityId: newJob.id
  });
  
  return newJob;
}

export function updateJob(job: Job): Job {
  const jobs = getJobs();
  const updatedJobs = jobs.map(j => {
    if (j.id === job.id) {
      // Check if status has changed
      if (j.status !== job.status) {
        // Create notification for status change
        if (job.status === 'Completed') {
          createNotification({
            type: 'Job Completed',
            message: `${job.type} job for ${getShipById(job.shipId)?.name || 'Unknown Ship'} has been completed`,
            isRead: false,
            relatedEntityId: job.id
          });
        } else {
          createNotification({
            type: 'Job Updated',
            message: `${job.type} job for ${getShipById(job.shipId)?.name || 'Unknown Ship'} updated to ${job.status}`,
            isRead: false,
            relatedEntityId: job.id
          });
        }
      }
      
      return { ...job, updatedAt: new Date().toISOString() };
    }
    return j;
  });
  
  setJobs(updatedJobs);
  return job;
}

export function deleteJob(id: string): void {
  const jobs = getJobs();
  const updatedJobs = jobs.filter(job => job.id !== id);
  setJobs(updatedJobs);
}

// Notification Functions
export function getNotifications(): Notification[] {
  const notifications = localStorage.getItem(NOTIFICATIONS_KEY);
  return notifications ? JSON.parse(notifications) : [];
}

export function setNotifications(notifications: Notification[]): void {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

export function getNotificationById(id: string): Notification | undefined {
  const notifications = getNotifications();
  return notifications.find(notification => notification.id === id);
}

export function createNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Notification {
  const notifications = getNotifications();
  const newNotification: Notification = { 
    ...notification, 
    id: `notification_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString()
  };
  
  setNotifications([...notifications, newNotification]);
  return newNotification;
}

export function markNotificationAsRead(id: string): Notification | undefined {
  const notifications = getNotifications();
  let updatedNotification: Notification | undefined;
  
  const updatedNotifications = notifications.map(notification => {
    if (notification.id === id) {
      updatedNotification = { ...notification, isRead: true };
      return updatedNotification;
    }
    return notification;
  });
  
  setNotifications(updatedNotifications);
  return updatedNotification;
}

export function markAllNotificationsAsRead(): void {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => ({
    ...notification,
    isRead: true
  }));
  
  setNotifications(updatedNotifications);
}

export function deleteNotification(id: string): void {
  const notifications = getNotifications();
  const updatedNotifications = notifications.filter(notification => notification.id !== id);
  setNotifications(updatedNotifications);
}

// Current User Functions
export function getCurrentUser(): User | null {
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  return currentUser ? JSON.parse(currentUser) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}
