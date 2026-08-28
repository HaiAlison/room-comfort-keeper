import api from "@/lib/api";
import { UserDetailResponse } from "@/types/auth";

export const userService = {
    getUserDetail: async (): Promise<UserDetailResponse> => {
        const res = await api.get('/users');
        return res.data;
    },
    updateSettings: async (data: { rateLimitPerMinute?: number; dailyLimit?: number }) => {
        const res = await api.patch('/users/me/settings', data);
        return res.data;
    }
}