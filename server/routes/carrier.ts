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

        response.status(200).json(await service.find(params));
    } catch (err) {
        console.error(err);
        response.status(400).json({ status: "error", message: "Unable to fetch categories" });
    }
});


carrierRoutes.get("/:id", async (request: Request, response: Response) => {
    //Create carrier
    var service = new CarrierService()
    try {

        //Create the carrier
        var carrier = await service.getById(ObjectId.createFromHexString(request.params.id))

        if (carrier) {
            //Return response
            response.status(200).json({ "status": "success", "carrier": carrier });
        } else {
            //Return response
            response.status(404).json({ "status": "no carrier found" });
        }

    } catch (err) {
        response.status(400).json({ "status": "error" });
    }

});



//TODO: Require user logged with admin role
carrierRoutes.post("/", validateRequest(postCarrier), async (request: Request, response: Response) => {

    //Map body to dtos
    var data = request.body as CreateCarrierRequest;

    //Create carrier
    var service = new CarrierService()
    try {
        //Create the carrier
        var id = await service.create(data);

        //Return response
        response.status(200).json({ "status": "success", "message": "carrier created", "_id": id });
    } catch (err) {
        console.log(err);
        response.status(400).json({ "status": "error", "message": "unable to create carrier" });
    }
});

//TODO: Require user logged with admin role
carrierRoutes.put("/:id", validateRequest(putCarrier), async (request: Request, response: Response) => {

    //Map body to dtos
    var data = request.body as UpdateCarrierRequest;

    //Create carrier
    var service = new CarrierService()
    try {

        //Inject the file in the data variable
        if (request.file) {
            data.image = request.file
        }

        //Update the carrier
        await service.update(ObjectId.createFromHexString(request.params.id), data);

        //Return response
        response.status(202).json({ "status": "success", "message": "carrier updated" });
    } catch (err) {
        console.log(err);
        response.status(400).json({ "status": "error", "message": "unable to update carrier" });
    }
});

carrierRoutes.delete("/:id", async (request: Request, response: Response) => {

    //Create carrier
    var service = new CarrierService()
    try {

        //Update the carrier
        await service.delete(ObjectId.createFromHexString(request.params.id));

        //Return response
        response.status(202).json({ "status": "success", "message": "carrier deleted" });
    } catch (err) {
        console.log(err);
        response.status(400).json({ "status": "error", "message": "unable to delete carrier" });
    }
});

export default carrierRoutes;
