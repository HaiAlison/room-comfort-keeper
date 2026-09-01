import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth";
import { getAccessToken } from "@/lib/auth-tokens";

export function useAuth() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const signIn = useAuthStore((s) => s.signIn);
  const signOut = useAuthStore((s) => s.signOut);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      const publicUser = authService.persistSession(data);
      signIn(publicUser);
      const firstName = publicUser.firstName ?? publicUser.email.split("@")[0];
      toast.success(`Welcome back, ${firstName}!`);
      void navigate({ to: "/dashboard" });
    },
    onError: (error: Error) => toast.error("Sign in failed", { description: error.message }),
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authService.register(credentials),
    onSuccess: (data) => {
      const publicUser = authService.persistSession(data);
      signIn(publicUser);
      const firstName = publicUser.firstName ?? publicUser.email.split("@")[0];
      toast.success(`Account created. Welcome, ${firstName}!`);
      void navigate({ to: "/dashboard" });
    },
    onError: (error: Error) => toast.error("Registration failed", { description: error.message }),
  });

  const handleSignOut = () => {
    authService.clearSession();
    signOut();
    void navigate({ to: "/login", replace: true });
  };

  return {
    user,
    isAuthenticated: Boolean(getAccessToken()),
    hydrated,
    loginMutation,
    registerMutation,
    signOut: handleSignOut,
  };
}
