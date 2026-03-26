import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import { AppProvider } from "./context/AppContext";
import ActivitiesPage from "./pages/ActivitiesPage";
import AssessmentPage from "./pages/AssessmentPage";
import GuardianDashboard from "./pages/GuardianDashboard";
import LandingPage from "./pages/LandingPage";
import MindfulKitchenPage from "./pages/MindfulKitchenPage";
import OnboardingPage from "./pages/OnboardingPage";
import ResourcesPage from "./pages/ResourcesPage";
import ResultsPage from "./pages/ResultsPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

// Root layout component
function RootComponent() {
  return (
    <AppProvider>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster position="top-right" richColors />
    </AppProvider>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: RootComponent,
});

// Landing
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

// Onboarding
const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

// Student Dashboard
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: StudentDashboard,
});

// Assessment
const assessmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/assessment",
  component: AssessmentPage,
});

// Results
const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: ResultsPage,
});

// Guardian Dashboard
const guardianDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/guardian-dashboard",
  component: GuardianDashboard,
});

// Teacher Dashboard
const teacherDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teacher-dashboard",
  component: TeacherDashboard,
});

// Resources
const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resources",
  component: ResourcesPage,
});

// Activities
const activitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/activities",
  component: ActivitiesPage,
});

// Mindful Kitchen
const mindfulKitchenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mindful-kitchen",
  component: MindfulKitchenPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  onboardingRoute,
  dashboardRoute,
  assessmentRoute,
  resultsRoute,
  guardianDashboardRoute,
  teacherDashboardRoute,
  resourcesRoute,
  activitiesRoute,
  mindfulKitchenRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
