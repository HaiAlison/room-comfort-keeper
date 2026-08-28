export interface IApiResponse<T> {
    statusCode: number;
    data: T;
    duration: number | string;
    message?: string;
}

export interface ICursorPagination<T> {
    results: T[];
    nextCursor: string | null;
    limit: number;
    hasMore: boolean;
}

export interface IPagination<T> {
    results: T[];
    offset: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}