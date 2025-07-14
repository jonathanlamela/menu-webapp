import { PaginationParams } from "dtos/common";
import { ObjectId } from "mongodb";
import { OrderState } from "types";

// OrderState

export type CreateOrderStateRequest = Omit<OrderState, "id" | "deleted">;
export type UpdateOrderStateRequest = Partial<Omit<OrderState, "id" | "deleted">>;
export type CreateOrderStateResponse = {
    status: string;
    orderState: OrderState;
};
export type UpdateOrderStateResponse = {
    status: string;
    orderState: OrderState;
};
export type DeleteOrderStateResponse = {
    status: string;
};
export type GetOrderStateByIdRequest = {
    orderStateId: ObjectId;
};
export type GetOrderStateByIdResponse = {
    status: string;
    orderState: OrderState;
};

export type FindOrderStateRequest = PaginationParams;
export type FindOrderStateResponse = {
    status: string;
    orderStates: OrderState[];
    params: FindOrderStateRequest;
};
