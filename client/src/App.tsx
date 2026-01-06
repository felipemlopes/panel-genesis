import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Metrics from "./pages/Metrics";
import Financial from "./pages/Financial";
import UsersManagement from "./pages/UsersManagement";
import ParametersManagement from "./pages/ParametersManagement";
import LastlinkIntegration from "./pages/LastlinkIntegration";
import AsaasIntegration from "./pages/AsaasIntegration";
import CheckoutPage from "./pages/CheckoutPage";
import DashboardLayout from "./components/DashboardLayout";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => (
        <ProtectedRoute>
          <DashboardLayout><Dashboard /></DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/metrics" component={() => (
        <ProtectedRoute>
          <DashboardLayout><Metrics /></DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/financial" component={() => (
        <ProtectedRoute>
          <DashboardLayout><Financial /></DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/users" component={() => (
        <ProtectedRoute>
          <DashboardLayout><UsersManagement /></DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/analytics" component={() => (
        <ProtectedRoute>
          <DashboardLayout><LastlinkIntegration /></DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/asaas" component={() => (
        <ProtectedRoute>
          <DashboardLayout><AsaasIntegration /></DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/parameters" component={() => (
        <ProtectedRoute>
          <DashboardLayout><ParametersManagement /></DashboardLayout>
        </ProtectedRoute>
      )} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
