import { Toaster } from "@/components/ui/sonner";
import {
  NotFoundRoute,
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import ProfileSetupDialog from "./components/auth/ProfileSetupDialog";
import AppLayout from "./components/layout/AppLayout";
import AppErrorBoundary from "./components/system/AppErrorBoundary";
import { useGetCallerUserProfile } from "./hooks/useCurrentUser";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AdminPage from "./pages/AdminPage";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import TradingPage from "./pages/TradingPage";
import WalletPage from "./pages/WalletPage";
import { clearIntendedPath, getIntendedPath } from "./utils/postLoginRedirect";

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const tradingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trading",
  component: TradingPage,
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: WalletPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  tradingRoute,
  walletRoute,
  adminRoute,
]);

const hashHistory = createHashHistory();

const router = createRouter({
  routeTree,
  history: hashHistory,
  notFoundRoute,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function PostLoginRedirect() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isFetched } = useGetCallerUserProfile();

  useEffect(() => {
    // Only redirect after authentication is complete and profile is loaded
    if (identity && isFetched && userProfile !== null) {
      const intendedPath = getIntendedPath();
      if (intendedPath) {
        clearIntendedPath();
        // Use hash navigation
        window.location.hash = `#${intendedPath}`;
      }
    }
  }, [identity, userProfile, isFetched]);

  return null;
}

function AppContent() {
  const { identity } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <PostLoginRedirect />
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetupDialog />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppErrorBoundary>
        <AppContent />
        <Toaster />
      </AppErrorBoundary>
    </ThemeProvider>
  );
}
