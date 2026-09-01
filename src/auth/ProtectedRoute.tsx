import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageLoader } from "@/components/common/PageLoader";
import { PageError } from "@/components/common/PageError";
import { useUser } from "@/hooks/use-user";
import { getAccessToken } from "@/lib/auth-tokens";

/**
 * Wraps authenticated pages inside the _app layout.
 *
 * Guard layers (in order):
 *  1. No access token in localStorage → redirect to login immediately.
 *  2. GET /auth/me pending   → show full-screen spinner.
 *  3. GET /auth/me failed    → show error + retry (token expired / server down).
 *  4. All good               → render children.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const token = getAccessToken();

  const { isLoading, isError, refetch } = useUser();

  // Layer 1: no token at all — bail out immediately
  useEffect(() => {
    if (!token) {
      void navigate({ to: "/login", replace: true });
    }
  }, [token, navigate]);

  // Layer 3: surface server errors via toast as well
  useEffect(() => {
    if (isError) {
      toast.error("Session error", { description: "Could not verify your session. Please try again." });
    }
  }, [isError]);

  if (!token) return null;

  // Layer 2: verifying session with the server
  if (isLoading) {
    return (
      <div className="grid min-h-svh place-items-center bg-background p-6">
        <PageLoader label="Verifying session…" />
      </div>
    );
  }

  // Layer 3: server returned an error (token expired / network issue)
  if (isError) {
    return (
      <div className="grid min-h-svh place-items-center bg-background p-6">
        <PageError
          message="Cannot connect to the server or your session has expired."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;