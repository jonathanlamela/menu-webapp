import { CreateCategoryRequest } from "@shared/dtos";
import express, { Request, Response } from "express";
import CategoryService from "../services/category";
import validateRequest from "../utils/validateRequest";
import { postCategory } from "../validators/bodyValidators";

const categoryRoutes = express.Router()
const multer = require('multer');
const upload = multer();

//TODO: Require user logged with admin role
categoryRoutes.post("/", validateRequest(postCategory), upload.single("image"), async (request: Request, response: Response) => {

    var data = request.body as CreateCategoryRequest;

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


});

export default categoryRoutes;
