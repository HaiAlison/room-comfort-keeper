import { userService } from "@/services/user.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: userService.getUserDetail,
        staleTime: 1000 * 60 * 5,
        retry: 0,
        enabled: !!localStorage.getItem('access_token'),
    });
}

export function useUpdateSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.updateSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });
}