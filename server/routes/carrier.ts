import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import CarrierService from "../services/carrier";
import validateRequest from "../utils/validators/validateRequest";
import { CreateCarrierRequest, FindCarrierRequest, UpdateCarrierRequest } from "@shared/dtos/carrier";
import { postCarrier, putCarrier } from "../utils/validators/bodyValidators";

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
        console.error(err);
        response.status(400).json({ status: "error", error: err instanceof Error ? err.message : String(err) });
    }
});

carrierRoutes.get("/:id", async (request: Request, response: Response) => {
    const service = new CarrierService();
    try {
        const serviceResponse = await service.getById(ObjectId.createFromHexString(request.params.id));
        if (serviceResponse.carrier) {
            response.status(200).json({ status: "success", ...serviceResponse });
        } else {
            response.status(404).json({ status: "error", error: "No carrier found" });
        }
    } catch (err) {
        response.status(400).json({ status: "error", error: err instanceof Error ? err.message : String(err) });
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
        response.status(400).json({ status: "error", error: err instanceof Error ? err.message : String(err) });
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
        const serviceResponse = await service.update(ObjectId.createFromHexString(request.params.id), data);
        response.status(202).json({ status: "success", ...serviceResponse });
    } catch (err) {
        console.log(err);
        response.status(400).json({ status: "error", error: err instanceof Error ? err.message : String(err) });
    }
});

carrierRoutes.delete("/:id", async (request: Request, response: Response) => {
    const service = new CarrierService();
    try {
        const serviceResponse = await service.delete(ObjectId.createFromHexString(request.params.id));
        response.status(202).json({ status: "success", ...serviceResponse });
    } catch (err) {
        console.log(err);
        response.status(400).json({ status: "error", error: err instanceof Error ? err.message : String(err) });
    }
});

export default carrierRoutes;
