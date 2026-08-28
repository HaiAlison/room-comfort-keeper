
export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        email: string;
        name?: string;
        avatar?: string;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isMfaEnabled?: boolean;
}

export interface UserDetailResponse {
    data: UserData;
}