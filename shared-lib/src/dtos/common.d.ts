import { ObjectId } from "mongodb";
import { ProductWithCategory } from "dtos/product";
import { Category, OrderState, Carrier } from "types";

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





