import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { login, logout, type LoginPayload } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const signIn = useAuthStore((s) => s.signIn);
  const signOut = useAuthStore((s) => s.signOut);

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (session, variables) => {
      signIn(session, variables.remember ?? true);
      toast.success(`Welcome back, ${session.user.name.split(" ")[0]}`);
      navigate({ to: "/dashboard" });
    },
    onError: (error: Error) => toast.error("Sign in failed", { description: error.message }),
  });

  const handleSignOut = async () => {
    await logout(user?.email ?? "unknown");
    signOut();
    navigate({ to: "/", replace: true });
  };

  return {
    user,
    isAuthenticated: Boolean(token),
    hydrated,
    loginMutation,
    signOut: handleSignOut,
  };
}
