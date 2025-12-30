import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
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
      <Route path="/" component={() => <DashboardLayout><Dashboard /></DashboardLayout>} />
      <Route path="/metrics" component={() => <DashboardLayout><Metrics /></DashboardLayout>} />
      <Route path="/financial" component={() => <DashboardLayout><Financial /></DashboardLayout>} />
      <Route path="/users" component={() => <DashboardLayout><UsersManagement /></DashboardLayout>} />
      <Route path="/analytics" component={() => <DashboardLayout><LastlinkIntegration /></DashboardLayout>} />
      <Route path="/asaas" component={() => <DashboardLayout><AsaasIntegration /></DashboardLayout>} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/parameters" component={() => <DashboardLayout><ParametersManagement /></DashboardLayout>} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
