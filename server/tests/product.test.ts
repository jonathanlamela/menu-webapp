import { getDb } from "../utils/db";

const request = require("supertest")
import app from "../app";

import { describe, expect, beforeAll, test, afterAll } from 'vitest';
import { Db } from "mongodb";
import { Response } from "supertest";
import { Product, Category as CategoryType } from "@shared/types";
import { CreateProductResponse, GetProductByIdResponse, GetProductsResponse } from "@shared/dtos/product";
import { CreateCategoryResponse } from "@shared/dtos/category";



describe("Product API Tests", () => {

    let db: Db;
    let pizzeCategoryId: string;
    let paniniCategoryId: string;

    async function startMocking() {
        await cleanCategoryTable();
        await cleanProductTable();

        // Crea la categoria "Pizze" e salva l'id globale
        const pizzeRes: Response = await request(app)
            .post("/api/v1/categories")
            .send({ name: "Pizze" })
            .set("Accept", "application/json");
        pizzeCategoryId = (pizzeRes.body as CreateCategoryResponse).id;

        // Crea la categoria "Panini" e salva l'id globale
        const paniniRes: Response = await request(app)
            .post("/api/v1/categories")
            .send({ name: "Panini" })
            .set("Accept", "application/json");
        paniniCategoryId = (paniniRes.body as CreateCategoryResponse).id;

        await request(app)
            .post("/api/v1/products")
            .send({
                name: "Diavola",
                price: 9.5,
                categoryId: pizzeCategoryId,
                descriptionShort: "Piccante"
            })
            .set("Accept", "application/json");

        await request(app)
            .post("/api/v1/products")
            .send({
                name: "Panino Classico",
                price: 6,
                categoryId: paniniCategoryId,
                descriptionShort: "Prosciutto e formaggio"
            })
            .set("Accept", "application/json");
    }

    async function cleanCategoryTable() {
        try { await db.dropCollection("categories"); } catch { }
    }

    async function cleanProductTable() {
        try { await db.dropCollection("products"); } catch { }
    }

    async function stopMocking() {
        await cleanProductTable();
        await cleanCategoryTable();
    }

    beforeAll(async () => {
        db = await getDb();
        await startMocking();
    });

    afterAll(async () => {
        await stopMocking();
    });

    // --- PRODUCT TESTS ---

    test("should create a new product", async () => {
        const newProduct = {
            name: "Margherita",
            price: 8.5,
            categoryId: pizzeCategoryId,
            descriptionShort: "Pizza classica"
        };
        const response: Response = await request(app)
            .post("/api/v1/products")
            .send(newProduct)
            .set("Accept", "application/json");

        const body: CreateProductResponse = response.body as CreateProductResponse;
        const { id } = body;

        expect(response.statusCode).toBe(201);
        expect(id).toBeDefined();
    });

    test("should not create a product without categoryId", async () => {
        const newProduct = {
            name: "Senza Categoria",
            price: 5.0,
            descriptionShort: "No category"
        };
        const response: Response = await request(app)
            .post("/api/v1/products")
            .send(newProduct)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(400);
    });

    test("should return all products", async () => {
        const response: Response = await request(app)
            .get("/api/v1/products")
            .set("Accept", "application/json");

        const body = response.body as GetProductsResponse;

        expect(response.statusCode).toBe(200);
        expect(body.products.length).toBeGreaterThanOrEqual(1);
    });

    test("should get a product by id", async () => {
        const newProduct = {
            name: "Capricciosa",
            price: 10,
            categoryId: pizzeCategoryId,
            descriptionShort: "Con tutto"
        };
        const createRes: Response = await request(app)
            .post("/api/v1/products")
            .send(newProduct)
            .set("Accept", "application/json");
        const id = (createRes.body as CreateProductResponse).product._id;

        const response: Response = await request(app)
            .get(`/api/v1/products/${id}`)
            .set("Accept", "application/json");

        const body = response.body as GetProductByIdResponse;

        expect(response.statusCode).toBe(200);
        expect(body).toHaveProperty("product");
        expect(body.product.name).toBe("Capricciosa");
    });

    test("should update a product by id", async () => {
        const newProduct = {
            name: "Bufala",
            price: 11,
            categoryId: pizzeCategoryId,
            descriptionShort: "Mozzarella di bufala"
        };
        const createRes: Response = await request(app)
            .post("/api/v1/products")
            .send(newProduct)
            .set("Accept", "application/json");
        const id = (createRes.body as CreateProductResponse).insertedId;

        const updatedData = { name: "Bufala Speciale", price: 12 };
        const response: Response = await request(app)
            .put(`/api/v1/products/${id}`)
            .send(updatedData)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);

        const updatedRes: Response = await request(app)
            .get(`/api/v1/products/${id}`)
            .set("Accept", "application/json");
        const updatedBody = updatedRes.body as GetProductByIdResponse;
        expect(updatedBody.product.name).toBe("Bufala Speciale");
        expect(updatedBody.product.price).toBe(12);
    });

    test("should soft-delete a product by id", async () => {
        const newProduct = {
            name: "Vegetariana",
            price: 9,
            categoryId: pizzeCategoryId,
            descriptionShort: "Verdure"
        };
        const createRes: Response = await request(app)
            .post("/api/v1/products")
            .send(newProduct)
            .set("Accept", "application/json");
        const id = (createRes.body as CreateProductResponse).insertedId;

        const response: Response = await request(app)
            .delete(`/api/v1/products/${id}`)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(204);

        const deletedRes: Response = await request(app)
            .get(`/api/v1/products/${id}`)
            .set("Accept", "application/json");
        const deletedBody = deletedRes.body as GetProductByIdResponse;
        expect(deletedBody.product.deleted).toBe(true);
    });

    test("should get products by category slug", async () => {
        const response: Response = await request(app)
            .get(`/api/v1/products/byCategorySlug/pizze`)
            .set("Accept", "application/json");

        const body = response.body as GetProductsResponse;

        expect(response.statusCode).toBe(200);
        expect(body.products.length).toBeGreaterThanOrEqual(1);
        expect(body.products[0].category.name).toBe("Pizze");
    });

    test("should search products by name", async () => {
        const newProduct = {
            name: "Quattro Formaggi",
            price: 10,
            categoryId: pizzeCategoryId,
            descriptionShort: "Tanti formaggi"
        };
        await request(app)
            .post("/api/v1/products")
            .send(newProduct)
            .set("Accept", "application/json");

        const response: Response = await request(app)
            .get("/api/v1/products?search=Formaggi")
            .set("Accept", "application/json");

        const body = response.body as GetProductsResponse;

        expect(response.statusCode).toBe(200);
        expect(body.products.some((p: Product) => p.name.includes("Formaggi"))).toBe(true);
    });

    test("should paginate products", async () => {
        const response: Response = await request(app)
            .get("/api/v1/products?paginated=true&page=1&perPage=2")
            .set("Accept", "application/json");

        const responseBody: GetProductsResponse = response.body as GetProductsResponse;

        expect(response.statusCode).toBe(200);
        expect(responseBody.products.length).toBe(2);
        expect(responseBody).toHaveProperty("totalPages");
        expect(responseBody).toHaveProperty("page");
    });

});
