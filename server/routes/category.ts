import { CreateCategoryRequest } from "@shared/dtos";
import express, { Request, Response } from "express";
import { categoryValidator } from "../validators/validators";
import CategoryService from "../services/category";

const categoryRoutes = express.Router()
const multer = require('multer');
const upload = multer();

//TODO: Require user logged with admin role
categoryRoutes.post("/", upload.single("image"), async (request: Request, response: Response) => {

    var data = request.body as CreateCategoryRequest;

    try {
        //Validate the data received
        await categoryValidator.validate(data, { abortEarly: false });

        //Create category
        var categoryService = new CategoryService()
        try {

            if (request.file) {
                data.image = request.file
            }

            var id = await categoryService.createCategory(data);
            response.status(200).json({ "status": "success", "message": "category created", "_id": id });
        } catch (err) {
            console.log(err);
            response.status(400).json({ "status": "error", "message": "unable to create category" });
        }
    } catch (err: any) {
        const errs: any[] = [];
        if (err.inner) {
            // Return validation errors to response
            err.inner.forEach((e: any) => {
                errs.push({ message: e.message, path: e.path });
            });
        } else {
            errs.push({ message: err.message });
        }
        response.status(400).json({ "status": "error", "errors": errs });
    }


});

export default categoryRoutes;
