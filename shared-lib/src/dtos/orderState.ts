import { ObjectId } from "mongodb";
import { OrderState } from "../types";
import { GenericResponse, PaginationParams } from "./common";

// OrderState

export type CreateOrderStateRequest = Omit<OrderState, "id" | "deleted">;
export type UpdateOrderStateRequest = Partial<Omit<OrderState, "id" | "deleted">>;

export type CreateOrderStateResponse = GenericResponse & {
    orderState: OrderState;
};

export type UpdateOrderStateResponse = GenericResponse & {
    orderState: OrderState;
};

export type DeleteOrderStateResponse = GenericResponse;

export type GetOrderStateByIdRequest = {
    orderStateId: ObjectId;
};

export type GetOrderStateByIdResponse = GenericResponse & {
    orderState: OrderState;
};

export type FindOrderStateRequest = PaginationParams;

export type FindOrderStateResponse = GenericResponse & {
    orderStates: OrderState[];
    params: FindOrderStateRequest;
};
