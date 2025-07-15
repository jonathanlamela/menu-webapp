

// Pagination & Find
export type PaginationParams = {
    orderBy: string;
    ascending: boolean;
    search: string;
    deleted: boolean;
    paginated: boolean;
    page: number;
    perPage: number;
};

export type GenericResponse = {
    status?: string;
    error?: string;
}





