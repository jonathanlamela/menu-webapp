import { getDb } from "../utils/db";

const request = require("supertest")
import app from "../app";

import { Category } from "@shared/types";


describe("Category API Tests", () => {

    beforeAll(async () => {
        var db = await getDb();
        await db.collection<Category>("categories").insertMany([
            {
                name: "Pizze"
            },
            {
                name: "Panini"
            }
        ]);
    });

    test("should return all categories", async () => {
        const response = await request(app)
            .get("/api/v1/categories")
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("categories");
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
        const db = await getDb();
        const category = await db.collection<Category>("categories").insertOne({ name: "Dolci" });
        const id = category.insertedId.toString();

        const response = await request(app)
            .get(`/api/v1/categories/${id}`)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("category");
        expect(response.body.category.name).toBe("Dolci");
    });

    test("should update a category by id", async () => {
        const db = await getDb();
        const category = await db.collection<Category>("categories").insertOne({ name: "Bevande" });
        const id = category.insertedId.toString();

        const updatedData = { name: "Bibite" };
        const response = await request(app)
            .put(`/api/v1/categories/${id}`)
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


    afterAll(async () => {
        var db = await getDb();
        await db.collection<Category>("categories").deleteMany({});
    });


});
