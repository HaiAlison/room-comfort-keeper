/** Shape returned by POST /auth/login and POST /auth/register */
export interface AuthResponse {
  user: PublicUser;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

/** Shape returned by GET /auth/me */
export interface PublicUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  picture: string | null;
}

/** Shape returned by POST /auth/refresh */
export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}