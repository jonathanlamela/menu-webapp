import { getDb } from "../utils/db";

const request = require("supertest")
import app from "../app";

import { Category } from "@shared/types";
import { describe, expect, beforeAll, test, afterAll } from 'vitest';
import { FindCategoryResponse } from "@shared/dtos/category";
import CategoryService from "../services/category";
import { Db } from "mongodb";



describe("Category API Tests", () => {

    let db: Db;


    async function startMocking() {

        await cleanCategoryTable();

        var categoryService = new CategoryService();

        await categoryService.create({ name: "Pizze", });
        await categoryService.create({ name: "Panini" });
    }

    async function cleanCategoryTable() {
        return await db.collection<Category>("categories").deleteMany({});
    }

    async function stopMocking() {
        return cleanCategoryTable();
    }

    beforeAll(async () => {
        db = await getDb();
        await startMocking();
    });

    afterAll(async () => {
        await stopMocking();
    });

    test("mocking succes", async () => {
        const categories = await db.collection<Category>("categories").find({}).toArray();
        expect(categories).toHaveLength(2);
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
        const category = await db.collection<Category>("categories").findOne({});
        const id = category?._id;

        const response = await request(app)
            .get(`/api/v1/categories/${id}`)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("category");
        expect(response.body.category.name).toBe(category?.name);
    });

    test("should update a category by id", async () => {
        const category = await db.collection<Category>("categories").findOne({});
        const id = category?._id;

        const updatedData = { name: category?.name };
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




});
