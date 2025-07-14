import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import CarrierService from "../services/carrier";
import validateRequest from "../utils/validators/validateRequest";
import { CreateCarrierRequest, FindCarrierRequest, UpdateCarrierRequest } from "@shared/dtos/carrier";
import { postCarrier, putCarrier } from "../utils/validators/bodyValidators";
import logger from "../utils/logger";

const carrierRoutes = express.Router()

carrierRoutes.get("/", async (request: Request, response: Response) => {
    const service = new CarrierService();
    try {
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
            ascending: ascending === "true",
            search: search as string,
            deleted: deleted === "true",
            paginated: paginated === "true",
            page: parseInt(page as string),
            perPage: parseInt(perPage as string),
        }

        const serviceResponse = await service.find(params);
        response.status(200).json({ status: "success", ...serviceResponse });
    } catch (err) {
        logger.error("Error fetching carriers", err);
        response.status(400).json({ status: "error" });
    }
});

carrierRoutes.get("/:id", async (request: Request, response: Response) => {
    const service = new CarrierService();
    try {
        const serviceResponse = await service.getById(ObjectId.createFromHexString(request.params.id));
        if (serviceResponse.carrier) {
            response.status(200).json({ status: "success", ...serviceResponse });
        } else {
            response.status(404).json({ status: "error" });
        }
    } catch (err) {
        logger.error("Error fetching carrier by ID", err);
        response.status(400).json({ status: "error" });
    }
});

//TODO: Require user logged with admin role
carrierRoutes.post("/", validateRequest(postCarrier), async (request: Request, response: Response) => {
    const data = request.body as CreateCarrierRequest;
    const service = new CarrierService();
    try {
        const serviceResponse = await service.create(data);
        response.status(200).json({ status: "success", ...serviceResponse });
    } catch (err) {
        logger.error("Error creating carrier", err);
        response.status(400).json({ status: "error" });
    }
});

//TODO: Require user logged with admin role
carrierRoutes.put("/:id", validateRequest(putCarrier), async (request: Request, response: Response) => {
    const data = request.body as UpdateCarrierRequest;
    const service = new CarrierService();
    try {
        if (request.file) {
            data.image = request.file;
        }
        await service.update(ObjectId.createFromHexString(request.params.id), data);
        response.status(202).json({ status: "success" });
    } catch (err) {
        logger.error("Error updating carrier", err);
        response.status(400).json({ status: "error" });
    }
});

carrierRoutes.delete("/:id", async (request: Request, response: Response) => {
    const service = new CarrierService();
    try {
        await service.delete(ObjectId.createFromHexString(request.params.id));
        response.status(202).json({ status: "success" });
    } catch (err) {
        logger.error("Error deleting carrier", err);
        response.status(400).json({ status: "error" });
    }
});

export default carrierRoutes;
