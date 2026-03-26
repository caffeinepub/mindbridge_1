import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import LoginPrompt from "./components/LoginPrompt";
import ProfileSetupWizard from "./components/ProfileSetupWizard";
import { AppProvider } from "./context/AppContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useProfile } from "./hooks/useProfile";
import ActivitiesPage from "./pages/ActivitiesPage";
import AssessmentPage from "./pages/AssessmentPage";
import GuardianDashboard from "./pages/GuardianDashboard";
import LandingPage from "./pages/LandingPage";
import LinkGuardianPage from "./pages/LinkGuardianPage";
import MindfulKitchenPage from "./pages/MindfulKitchenPage";
import OnboardingPage from "./pages/OnboardingPage";
import ResourcesPage from "./pages/ResourcesPage";
import ResultsPage from "./pages/ResultsPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

// Root layout component
function RootComponent() {
  const { isInitializing, identity } = useInternetIdentity();
  const { profile, hasProfile, saveProfile } = useProfile(identity);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background mesh-bg">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AppProvider>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster position="top-right" richColors />
      {/* Profile setup wizard shown as full-screen overlay when logged in but no profile */}
      {identity && !hasProfile && (
        <ProfileSetupWizard
          identity={identity}
          onComplete={(p) => {
            saveProfile(p);
          }}
        />
      )}
      {/* Show role-relevant info once profile is set (passed via context for consumers) */}
      {identity && hasProfile && profile && (
        <ProfileReadyBanner profile={profile} />
      )}
    </AppProvider>
  );
}

// Invisible component that stores profile role in a global for dashboards to consume
function ProfileReadyBanner({
  profile,
}: {
  profile: { role: string; name: string };
}) {
  // Store in sessionStorage so dashboards can read without prop drilling
  if (typeof window !== "undefined") {
    sessionStorage.setItem("lumiProfileRole", profile.role);
    sessionStorage.setItem("lumiProfileName", profile.name);
  }
  return null;
}

// Auth-guarded wrapper
function AuthGuarded({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  if (!identity) return <LoginPrompt />;
  return <>{children}</>;
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
  component: () => (
    <AuthGuarded>
      <OnboardingPage />
    </AuthGuarded>
  ),
});

// Student Dashboard
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <AuthGuarded>
      <StudentDashboard />
    </AuthGuarded>
  ),
});

// Assessment
const assessmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/assessment",
  component: () => (
    <AuthGuarded>
      <AssessmentPage />
    </AuthGuarded>
  ),
});

// Results
const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: () => (
    <AuthGuarded>
      <ResultsPage />
    </AuthGuarded>
  ),
});

// Guardian Dashboard
const guardianDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/guardian-dashboard",
  component: () => (
    <AuthGuarded>
      <GuardianDashboard />
    </AuthGuarded>
  ),
});

// Teacher Dashboard
const teacherDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teacher-dashboard",
  component: () => (
    <AuthGuarded>
      <TeacherDashboard />
    </AuthGuarded>
  ),
});

// Resources
const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resources",
  component: () => (
    <AuthGuarded>
      <ResourcesPage />
    </AuthGuarded>
  ),
});

// Activities
const activitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/activities",
  component: () => (
    <AuthGuarded>
      <ActivitiesPage />
    </AuthGuarded>
  ),
});

// Link Guardian
const linkGuardianRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/link-guardian",
  component: () => (
    <AuthGuarded>
      <LinkGuardianPage />
    </AuthGuarded>
  ),
});

// Mindful Kitchen
const mindfulKitchenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mindful-kitchen",
  component: () => (
    <AuthGuarded>
      <MindfulKitchenPage />
    </AuthGuarded>
  ),
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
  linkGuardianRoute,
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
