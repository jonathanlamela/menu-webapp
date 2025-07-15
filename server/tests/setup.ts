
import { beforeAll, afterAll } from 'vitest';
import app from "../app";
import { CreateCategoryResponse } from 'shared/dtos/category';
import { getDb } from 'utils/db';


const request = require("supertest")

async function startMocking() {

    await cleanCategoryTable();
    await cleanProductTable();

    // Crea la categoria "Pizze" e salva l'id globale
    const pizzeRes: Response = await request(app)
        .post("/api/v1/categories")
        .send({ name: "Pizze" })
        .set("Accept", "application/json");
    var requestResponse = pizzeRes.body as CreateCategoryResponse;
    var pizzeCategoryId = requestResponse.id!;


    // Crea la categoria "Panini" e salva l'id globale
    const paniniRes: Response = await request(app)
        .post("/api/v1/categories")
        .send({ name: "Panini" })
        .set("Accept", "application/json");
    var requestResponse = paniniRes.body as CreateCategoryResponse;
    var paniniCategoryId = requestResponse.id!;


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
    var db = await getDb();

    try { await db.collection("categories").deleteMany({}); } catch { }
}

async function cleanProductTable() {
    var db = await getDb();

    try { await db.collection("products").deleteMany({}); } catch { }
}

async function stopMocking() {
    await cleanProductTable();
    await cleanCategoryTable();
}


beforeAll(async () => {
    await startMocking();
});

afterAll(async () => {
    await stopMocking();
});
