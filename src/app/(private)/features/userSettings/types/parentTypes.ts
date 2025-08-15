export interface DbResponse<T> {
    data: T | null;
    error: string | null;
}