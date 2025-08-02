import express, { Request } from "express";
import { ObjectId } from "mongodb";
import CarrierService from "../services/carrier";
import validateRequest from "../utils/validators/validateRequest";
import { CreateCarrierRequest, CreateCarrierResponse, DeleteCarrierResponse, FindCarrierRequest, FindCarrierResponse, UpdateCarrierRequest, UpdateCarrierResponse } from "shared/dtos/carrier";
import { findCarriersValidator, postCarrierValidator, putCarrierValidator } from "../utils/validators/carrier";
import logger from "../utils/logger";
import { TypedRequest, TypedResponse } from "../types";


const carrierRoutes = express.Router()

carrierRoutes.get("/",
    validateRequest(findCarriersValidator),
    async (
        request: Request,
        response: TypedResponse<FindCarrierResponse>
    ) => {

        const {
            orderBy = "id",
            ascending = "false",
            search = "",
            deleted = "false",
            paginated = "true",
            page = "1",
            perPage = "10",
        } = request.query;

        const params: FindCarrierRequest = {
            orderBy: orderBy as string,
            ascending: String(ascending) === "true",
            search: search as string,
            deleted: String(deleted) === "true",
            paginated: String(paginated) === "true",
            page: parseInt(page as string),
            perPage: parseInt(perPage as string),
        }

        const service = new CarrierService();
        const serviceResponse = await service.find(params);
        response.status(200).json({ status: "success", ...serviceResponse });

    });

carrierRoutes.get("/:id", async (
    request: TypedRequest<{}, { id: string }>,
    response: TypedResponse<FindCarrierResponse>
) => {
    const service = new CarrierService();
    const serviceResponse = await service.getById(ObjectId.createFromHexString(request.params.id));
    if (serviceResponse.carrier && serviceResponse.carrier.deleted == false) {
        response.status(200).json({ status: "success", ...serviceResponse });
    } else {
        response.status(404).json({ status: "error" });
    }
});

//TODO: Require user logged with admin role
carrierRoutes.post(
    "/",
    validateRequest(postCarrierValidator),
    async (
        request: TypedRequest<{}, CreateCarrierRequest, {}>,
        response: TypedResponse<CreateCarrierResponse>
    ) => {
        const data = request.body;
        const service = new CarrierService();
        try {
            const serviceResponse = await service.create(data);
            response.status(201).json({ status: "success", ...serviceResponse });
        } catch (err) {
            logger.error("Error creating carrier", err);
            response.status(400).json({ status: "error" });
        }
    }
);

//TODO: Require user logged with admin role
carrierRoutes.put(
    "/:id",
    validateRequest(putCarrierValidator),
    async (
        request: TypedRequest<{}, UpdateCarrierRequest, { id: string }>,
        response: TypedResponse<UpdateCarrierResponse>
    ) => {
        const data = request.body as UpdateCarrierRequest;
        const service = new CarrierService();
        try {

            await service.update(ObjectId.createFromHexString(request.params!.id), data);
            response.status(202).json({ status: "success" });
        } catch (err) {
            logger.error("Error updating carrier", err);
            response.status(400).json({ status: "error" });
        }
    }
);

carrierRoutes.delete(
    "/:id",
    async (
        request: TypedRequest<{}, { id: string }>,
        response: TypedResponse<DeleteCarrierResponse>
    ) => {
        const service = new CarrierService();
        await service.delete(ObjectId.createFromHexString(request.params.id));
        response.status(202).json({ status: "success" });
    }
);

export default carrierRoutes;
