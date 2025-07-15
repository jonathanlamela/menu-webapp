

// Pagination & Find
export type PaginationParams = {
    orderBy: string;
    ascending: boolean | string;
    search: string;
    deleted: boolean | string;
    paginated: boolean | string;
    page: number;
    perPage: number;
};

export type GenericResponse = {
    status?: string;
    error?: string;
}





