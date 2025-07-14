import express, { Request, Response } from "express";
import CategoryService from "../services/category";
import validateRequest from "../utils/validators/validateRequest";
import { postCategory, putCategory } from "../utils/validators/bodyValidators";
import { ObjectId } from "mongodb";
import { FindCategoryRequest, CreateCategoryRequest, UpdateCategoryRequest } from "@shared/dtos/category";

const categoryRoutes = express.Router()
const multer = require('multer');
const upload = multer();

categoryRoutes.get("/", async (request: Request, response: Response) => {
    const categoryService = new CategoryService();
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

        const params: FindCategoryRequest = {
            orderBy: orderBy as string,
            ascending: ascending === "true",
            search: search as string,
            deleted: deleted === "true",
            paginated: paginated === "true",
            page: parseInt(page as string),
            perPage: parseInt(perPage as string),
        }

        response.status(200).json(await categoryService.find(params));
    } catch (err) {
        console.error(err);
        response.status(400).json({ status: "error", message: "Unable to fetch categories" });
    }
});


categoryRoutes.get("/:id", async (request: Request, response: Response) => {
    //Create category
    var categoryService = new CategoryService()
    try {

        //Create the category
        var category = await categoryService.getById(ObjectId.createFromHexString(request.params.id))

        if (category) {
            //Return response
            response.status(200).json({ "status": "success", "category": category });
        } else {
            //Return response
            response.status(404).json({ "status": "no category found" });
        }

    } catch (err) {
        response.status(400).json({ "status": "error" });
    }

});

categoryRoutes.get("/bySlug/:slug", async (request: Request, response: Response) => {
    //Create category
    var categoryService = new CategoryService()
    try {

        //Create the category
        var category = await categoryService.getBySlug(request.params.slug)

        if (category) {
            //Return response
            response.status(200).json({ "status": "success", "category": category });
        } else {
            //Return response
            response.status(404).json({ "status": "no category found" });
        }

    } catch (err) {
        response.status(400).json({ "status": "error" });
    }

});


//TODO: Require user logged with admin role
categoryRoutes.post("/", upload.single("image"), validateRequest(postCategory), async (request: Request, response: Response) => {

    //Map body to dtos
    var data = request.body as CreateCategoryRequest;

    //Create category
    var categoryService = new CategoryService()
    try {

        //Inject the file in the data variable
        if (request.file) {
            data.image = request.file
        }

        //Create the category
        var id = await categoryService.create(data);

        //Return response
        response.status(200).json({ "status": "success", "message": "category created", "_id": id });
    } catch (err) {
        console.log(err);
        response.status(400).json({ "status": "error", "message": "unable to create category" });
    }
});

//TODO: Require user logged with admin role
categoryRoutes.put("/:id", upload.single("image"), validateRequest(putCategory), async (request: Request, response: Response) => {

    //Map body to dtos
    var data = request.body as UpdateCategoryRequest;

    //Create category
    var categoryService = new CategoryService()
    try {

        //Inject the file in the data variable
        if (request.file) {
            data.image = request.file
        }

        //Update the category
        await categoryService.update(ObjectId.createFromHexString(request.params.id), data);

        //Return response
        response.status(202).json({ "status": "success", "message": "category updated" });
    } catch (err) {
        console.log(err);
        response.status(400).json({ "status": "error", "message": "unable to update category" });
    }
});

categoryRoutes.delete("/:id", async (request: Request, response: Response) => {

    //Create category
    var categoryService = new CategoryService()
    try {

        //Update the category
        await categoryService.delete(ObjectId.createFromHexString(request.params.id));

        //Return response
        response.status(202).json({ "status": "success", "message": "category deleted" });
    } catch (err) {
        console.log(err);
        response.status(400).json({ "status": "error", "message": "unable to delete category" });
    }
});

export default categoryRoutes;
