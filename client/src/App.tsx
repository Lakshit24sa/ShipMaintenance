import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./contexts/AuthContext";
import { ShipsProvider } from "./contexts/ShipsContext";
import { ComponentsProvider } from "./contexts/ComponentsContext";
import { JobsProvider } from "./contexts/JobsContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ShipsPage from "./pages/ShipsPage";
import ShipDetailPage from "./pages/ShipDetailPage";
import ComponentsPage from "./pages/ComponentsPage";
import JobsPage from "./pages/JobsPage";
import CalendarPage from "./pages/CalendarPage";
import AppLayout from "./components/Layout/AppLayout";
import { useAuth } from "./hooks/useAuth";

// Auth check will be handled within AppLayout

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      
      {/* Dashboard route */}
      <Route path="/">
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      </Route>
      
      {/* Ships routes */}
      <Route path="/ships/:id">
        {(params) => (
          <AppLayout>
            <ShipDetailPage id={params.id} />
          </AppLayout>
        )}
      </Route>
      
      <Route path="/ships">
        <AppLayout>
          <ShipsPage />
        </AppLayout>
      </Route>
      
      {/* Components route */}
      <Route path="/components">
        <AppLayout>
          <ComponentsPage />
        </AppLayout>
      </Route>
      
      {/* Jobs route */}
      <Route path="/jobs">
        <AppLayout>
          <JobsPage />
        </AppLayout>
      </Route>
      
      {/* Calendar route */}
      <Route path="/calendar">
        <AppLayout>
          <CalendarPage />
        </AppLayout>
      </Route>
      
      {/* 404 route */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ShipsProvider>
            <ComponentsProvider>
              <JobsProvider>
                <NotificationsProvider>
                  <Toaster />
                  <Router />
                </NotificationsProvider>
              </JobsProvider>
            </ComponentsProvider>
          </ShipsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
