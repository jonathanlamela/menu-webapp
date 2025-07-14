import { PaginationParams } from "dtos/common";
import { ObjectId } from "mongodb";
import { Carrier } from "types";

// Carrier

export type CreateCarrierRequest = Omit<Carrier, "id" | "deleted">;
export type UpdateCarrierRequest = Partial<Omit<Carrier, "id" | "deleted">>;
export type CreateCarrierResponse = {
    status: string;
    id: ObjectId;
};
export type UpdateCarrierResponse = {
    status: string;
};

export type DeleteCarrierResponse = {
    status: string;
};

export type GetCarrierByIdResponse = {
    status: string;
    carrier: Carrier;
};

export type FindCarrierRequest = PaginationParams;
export type FindCarrierResponse = {
    status: string;
    carriers: Carrier[];
    params: FindCarrierRequest;
};
