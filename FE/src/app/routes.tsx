import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { DashboardLayout } from "../features/dashboard/pages/DashboardLayout";
import { DashboardHomePage } from "../features/dashboard/pages/DashboardHomePage";
import { ConnectionsPage } from "../features/connections/pages/ConnectionsPage";
import { MessagesPage } from "../features/chat/pages/MessagesPage";
import { CustomersPage } from "../features/customers/pages/CustomersPage";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";
import { PrivacyPage, TermsPage, DataDeletionPage } from "../features/pages/StaticPages";
import { LandingPage } from "../features/dashboard/pages/LandingPage";

function RedirectToLogin() {
  return <Navigate to="/login" replace />;
}

function RedirectToDashboard() {
  return <Navigate to="/dashboard" replace />;
}

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/login", Component: LoginPage },
  { path: "/logic", Component: LoginPage },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, Component: DashboardHomePage },
      { path: "connections", Component: ConnectionsPage },
      { path: "customers", Component: CustomersPage },
      { path: "messages", Component: MessagesPage },
      { path: "*", Component: RedirectToDashboard },
    ],
  },
  { path: "/privacy.html", Component: PrivacyPage },
  { path: "/privacy", Component: PrivacyPage },
  { path: "/terms.html", Component: TermsPage },
  { path: "/terms", Component: TermsPage },
  { path: "/data-deletion.html", Component: DataDeletionPage },
  { path: "/data-deletion", Component: DataDeletionPage },
  { path: "*", Component: RedirectToLogin },
]);
