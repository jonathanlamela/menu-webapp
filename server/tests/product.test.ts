
const request = require("supertest")
import app from "../app";

import { describe, expect, test } from 'vitest';
import { Response } from "supertest";
import { Product } from "shared/types";
import { CreateProductResponse, GetProductByIdResponse, GetProductsResponse } from "shared/dtos/product";


describe("Product API Tests", () => {
    // --- PRODUCT TESTS ---

    test("should create a new product", async () => {

        const categoryRes: Response = await request(app)
            .get("/api/v1/categories?slug=pizze")
            .set("Accept", "application/json");
        const pizzeCategory = categoryRes.body.categories?.[0];
        const pizzeCategoryId = pizzeCategory?._id;
        expect(pizzeCategoryId).toBeDefined();

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


        const categoryRes: Response = await request(app)
            .get("/api/v1/categories?slug=pizze")
            .set("Accept", "application/json");
        const pizzeCategory = categoryRes.body.categories?.[0];
        const pizzeCategoryId = pizzeCategory?._id;
        expect(pizzeCategoryId).toBeDefined();

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
        const categoryRes: Response = await request(app)
            .get("/api/v1/categories?slug=pizze")
            .set("Accept", "application/json");
        const pizzeCategory = categoryRes.body.categories?.[0];
        const pizzeCategoryId = pizzeCategory?._id;
        expect(pizzeCategoryId).toBeDefined();

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
        const categoryRes: Response = await request(app)
            .get("/api/v1/categories?slug=pizze")
            .set("Accept", "application/json");
        const pizzeCategory = categoryRes.body.categories?.[0];
        const pizzeCategoryId = pizzeCategory?._id;
        expect(pizzeCategoryId).toBeDefined();

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
        const deletedBody = deletedRes.body as GetProductByIdResponse;
        expect(deletedBody.product.deleted).toBe(true);
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
        const categoryRes: Response = await request(app)
            .get("/api/v1/categories?slug=pizze")
            .set("Accept", "application/json");
        const pizzeCategory = categoryRes.body.categories?.[0];
        const pizzeCategoryId = pizzeCategory?._id;
        expect(pizzeCategoryId).toBeDefined();

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
