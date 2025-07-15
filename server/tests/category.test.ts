import { getDb } from "../utils/db";

const request = require("supertest")
import app from "../app";

import { Category } from "shared/types";
import { describe, expect, beforeAll, test, afterAll } from 'vitest';
import { CreateCategoryResponse, FindCategoryResponse } from "shared/dtos/category";
import { Db, ObjectId } from "mongodb";
import { CreateProductResponse } from "shared/dtos/product";

describe("Category API Tests", () => {

    let pizzeCategoryId: ObjectId;
    let paniniCategoryId: ObjectId;

    async function feedDb() {

        console.log("Feeding database with initial data...");

        // Crea la categoria "Pizze" e salva l'id globale
        const pizzeRes: Response = await request(app)
            .post("/api/v1/categories")
            .send({ name: "Pizze" })
            .set("Accept", "application/json");
        var requestResponse = pizzeRes.body as CreateCategoryResponse;
        pizzeCategoryId = requestResponse.id!;

        console.log("Pizze category created with ID:", pizzeCategoryId.toString());

        // Crea la categoria "Panini" e salva l'id globale
        const paniniRes: Response = await request(app)
            .post("/api/v1/categories")
            .send({ name: "Panini" })
            .set("Accept", "application/json");
        var requestResponse = paniniRes.body as CreateCategoryResponse;
        paniniCategoryId = requestResponse.id!;

        console.log("Panini category created with ID:", paniniCategoryId.toString());

        const createProductRequest1: Response = await request(app)
            .post("/api/v1/products")
            .send({
                name: "Diavola",
                price: 9.5,
                categoryId: pizzeCategoryId,
                descriptionShort: "Piccante"
            })
            .set("Accept", "application/json");

        var productCreateResponse1 = createProductRequest1.body as CreateProductResponse;
        console.log("Product created with ID:", productCreateResponse1.id);

        const createProductRequest2: Response = await request(app)
            .post("/api/v1/products")
            .send({
                name: "Panino Classico",
                price: 6,
                categoryId: paniniCategoryId,
                descriptionShort: "Prosciutto e formaggio"
            })
            .set("Accept", "application/json");
        var productCreateResponse2 = createProductRequest2.body as CreateProductResponse;
        console.log("Product created with ID:", productCreateResponse2.id);

        console.log("Database fed with initial data.");
    }



    beforeAll(async () => {
        await feedDb();
    });


    test("should return all categories", async () => {
        const response = await request(app)
            .get("/api/v1/categories")
            .set("Accept", "application/json");

        var responseBody: FindCategoryResponse = response.body;

        expect(response.statusCode).toBe(200);
        expect(responseBody.categories).toHaveLength(2);

    });

    test("should create a new category", async () => {
        const newCategory = { name: "Insalate" };
        const response = await request(app)
            .post("/api/v1/categories")
            .send(newCategory)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    test("should get a category by id", async () => {
        const response = await request(app)
            .get(`/api/v1/categories/${pizzeCategoryId}`)
            .set("Accept", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("category");
        expect(response.body.category.name).toBe("Pizze");
    });


    test("should get a category slug", async () => {
        const response = await request(app)
            .get(`/api/v1/categories?slug=pizze`)
            .set("Accept", "application/json");
        var responseBody: FindCategoryResponse = response.body;
        expect(response.statusCode).toBe(200);
        expect(responseBody.categories).toHaveLength(1);
    });

    test("should update a category by id", async () => {
        const updatedData = { name: "Pizze" };
        const response = await request(app)
            .put(`/api/v1/categories/${pizzeCategoryId}`)
            .send(updatedData)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
    });

    test("should delete a category by id", async () => {
        const db = await getDb();
        const category = await db.collection<Category>("categories").insertOne({ name: "Antipasti" });
        const id = category.insertedId.toString();
        const response = await request(app)
            .delete(`/api/v1/categories/${id}`)
            .set("Accept", "application/json");
        expect(response.statusCode).toBe(204);

        // Optionally, check that the category is actually deleted
        const deleted = await db.collection<Category>("categories").findOne({ _id: category.insertedId });
        expect(deleted).not.toBeNull();
        expect(deleted?.deleted).toBe(true);
    });

});
