import { ObjectId } from "mongodb";
import { Carrier } from "../types";
import { GenericResponse, PaginationParams } from "./common";

export type CarrierDTO = {
    name: string;
    costs: number;
};

// Requests
export type CreateCarrierRequest = CarrierDTO;
export type UpdateCarrierRequest = CarrierDTO;
export type FindCarrierRequest = PaginationParams;

//Response
export type CreateCarrierResponse = GenericResponse & {
    id?: ObjectId;
};
export type UpdateCarrierResponse = GenericResponse;
export type DeleteCarrierResponse = GenericResponse;
export type GetCarrierByIdResponse = GenericResponse & {
    carrier?: Carrier;
};
export type FindCarrierResponse = GenericResponse & {
    carriers?: Carrier[];
    params?: FindCarrierRequest;
};
