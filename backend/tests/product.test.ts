
const request = require("supertest")
import app from "../app";

import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { Response } from "supertest";
import { Product } from "shared/types";
import { CreateProductResponse, GetProductByIdResponse, GetProductsResponse } from "shared/dtos/product";
import { Db, ObjectId } from "mongodb";
import { CreateCategoryResponse } from "shared/dtos/category";
import { getDb } from "utils/db";


describe("Product API Tests", () => {
    // --- PRODUCT TESTS ---

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
        const createBody = createRes.body as CreateProductResponse;
        const id = createBody.id;

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
        const createBody = createRes.body as CreateProductResponse;
        const id = createBody.id;

        const updatedData = { name: "Bufala Speciale", price: 12 };
        const response: Response = await request(app)
            .put(`/api/v1/products/${id}`)
            .send(updatedData)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(204);

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
        const createBody = createRes.body as CreateProductResponse;
        const id = createBody.id;

        const response: Response = await request(app)
            .delete(`/api/v1/products/${id}`)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(204);

        const deletedRes: Response = await request(app)
            .get(`/api/v1/products/${id}`)
            .set("Accept", "application/json");
        expect(deletedRes.status).toBe(404);
    });

    test("should get products by category slug", async () => {
        const response: Response = await request(app)
            .get(`/api/v1/products?categorySlug=pizze`)
            .set("Accept", "application/json");

        const body = response.body as GetProductsResponse;

        expect(response.statusCode).toBe(200);
        expect(body.products.length).toBeGreaterThanOrEqual(1);
        expect(body.products[0].category!.name).toBe("Pizze");
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

    test("should return 400 if params are invalid (invalid page/perPage)", async () => {
        const response: Response = await request(app)
            .get("/api/v1/products?paginated=true&page=notanumber&perPage=notanumber")
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("error");
    });

    test("should return 400 if params are invalid (negative page/perPage)", async () => {
        const response: Response = await request(app)
            .get("/api/v1/products?paginated=true&page=-1&perPage=-5")
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("error");
    });

    test("should return 404 when getting a product with non-existent id", async () => {
        const nonExistentId = "64b7f9c2e1b8c2a1f8e1b8c2";
        const response: Response = await request(app)
            .get(`/api/v1/products/${nonExistentId}`)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe("error");
    });

    test("should return 400 when getting a product with invalid id format", async () => {
        const invalidId = "ajejebrazorf";
        const response: Response = await request(app)
            .get(`/api/v1/products/${invalidId}`)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("error");
    });

    test("should return 400 when creating a product with invalid productData", async () => {
        // Missing required fields: name, price, categoryId
        const invalidProductData = {
            descriptionShort: "Invalid product"
        };
        const response: Response = await request(app)
            .post("/api/v1/products")
            .send(invalidProductData)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("error");
    });

    test("should return 204 when updating a product with valid id but not exists", async () => {
        const invalidId = "64b7f9c2e1b8c2a1f8e1b8c2";
        const updatedData = { name: "Invalid Update", price: 15 };
        const response: Response = await request(app)
            .put(`/api/v1/products/${invalidId}`)
            .send(updatedData)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(204);
    });
});



