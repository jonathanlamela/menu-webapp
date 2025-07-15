import { ObjectId } from "mongodb";
import { Carrier } from "../types";
import { GenericResponse, PaginationParams } from "./common";


// Carrier

export type CreateCarrierRequest = Omit<Carrier, "id" | "deleted">;
export type UpdateCarrierRequest = Partial<Omit<Carrier, "id" | "deleted">>;

export type CreateCarrierResponse = GenericResponse & {
    id?: ObjectId;
};

export type UpdateCarrierResponse = GenericResponse;

export type DeleteCarrierResponse = GenericResponse;

export type GetCarrierByIdResponse = GenericResponse & {
    carrier: Carrier;
};

export type FindCarrierRequest = PaginationParams;

export type FindCarrierResponse = GenericResponse & {
    carriers?: Carrier[];
    params?: FindCarrierRequest;
};
