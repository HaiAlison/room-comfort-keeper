import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { getAccessToken } from "@/lib/auth-tokens";

export function useUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: userService.me,
    staleTime: 1000 * 60 * 5, // 5 min
    retry: 0,
    enabled: Boolean(getAccessToken()),
  });
}