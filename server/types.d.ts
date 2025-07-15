import { Send } from "express-serve-static-core";

export interface TypedResponse<ResBody> extends Express.Response {
    json: Send<ResBody, this>;
    status(code: number): this;
}

export interface TypedRequest<T extends Query, U, P = Record<string, string>> extends Express.Request {
    body: U = any;
    query: T = any;
    params: P = any;
}

