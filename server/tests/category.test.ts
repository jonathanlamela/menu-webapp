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


    afterAll(async () => {
        var db = await getDb();
        await db.collection<Category>("categories").deleteMany({});
    });


});
