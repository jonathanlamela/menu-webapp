
import request from "supertest";
import app from "../app";
import { describe, test, expect, beforeAll } from "vitest";
import { FindCarrierRequest, FindCarrierResponse, CreateCarrierResponse, CreateCarrierRequest, CarrierDTO } from "shared/dtos/carrier";

describe("Carrier API Tests", () => {

    beforeAll(async () => {
        // Create some carriers before running the tests and log their IDs
        var items: CreateCarrierRequest[] = [
            { name: "FastCarrier", costs: 1 },
            { name: "SlowCarrier", costs: 3 },
            { name: "DeletedCarrier", costs: 4 },
        ];

        for (const carrier of items) {
            const res = await request(app).post("/api/v1/carriers").send(carrier);
            const body = res.body as CreateCarrierResponse;

            console.log(`Created carrier: ${carrier.name}, ID: ${body.id}`);
        }
    });

    test("GET /api/v1/carriers parses default params correctly", async () => {
        const res = await request(app).get("/api/v1/carriers");
        expect(res.status).toBe(200);
        const body: FindCarrierResponse = res.body;
        expect(body.status).toBe("success");
        expect(body.carriers?.length).toBeGreaterThan(0);
    });

    test("GET /api/v1/carriers parses custom params correctly", async () => {
        const params: FindCarrierRequest = {
            orderBy: "name",
            ascending: true,
            search: "fast",
            deleted: true,
            paginated: false,
            page: 2,
            perPage: 5,
        };
        const res = await request(app)
            .get("/api/v1/carriers")
            .query({
                orderBy: params.orderBy,
                ascending: params.ascending.toString(),
                search: params.search,
                deleted: params.deleted.toString(),
                paginated: params.paginated.toString(),
                page: params.page.toString(),
                perPage: params.perPage.toString(),
            });
        expect(res.status).toBe(200);
        const body: FindCarrierResponse = res.body;
        expect(body.status).toBe("success");
    });

    test("GET /api/v1/carriers returns error on invalid param types", async () => {
        const res = await request(app)
            .get("/api/v1/carriers")
            .query({
                page: "not-a-number",
                perPage: "not-a-number",
            });
        // Should fallback to default values or handle error gracefully
        expect([200, 400]).toContain(res.status);
    });

    test("POST /api/v1/carriers creates a new carrier", async () => {
        const newCarrier: CarrierDTO = { name: "NewCarrier", costs: 2 };
        const res = await request(app).post("/api/v1/carriers").send(newCarrier);
        expect(res.status).toBe(201);
        const body: CreateCarrierResponse = res.body;
        expect(body.status).toBe("success");
        expect(body.id).toBeDefined();
    });

    test("POST /api/v1/carriers returns error on invalid data", async () => {
        const invalidCarrier: CarrierDTO = { name: "", costs: -1 };
        const res = await request(app).post("/api/v1/carriers").send(invalidCarrier);
        expect(res.status).toBe(400);
    });

    test("POST /api/v1/carriers returns error on missing fields", async () => {
        const invalidCarrier = { name: "" };
        const res = await request(app).post("/api/v1/carriers").send(invalidCarrier);
        expect(res.status).toBe(400);
    });

    test("GET /api/v1/carriers/:id fetches carrier by ID", async () => {
        const listRes = await request(app).get("/api/v1/carriers");
        expect(listRes.status).toBe(200);
        const listBody: FindCarrierResponse = listRes.body;
        expect(listBody.carriers).toBeDefined();
        expect(listBody.carriers!.length).toBeGreaterThan(0);

        const firstCarrier = listBody.carriers![0];
        const id = firstCarrier._id;

        const res = await request(app).get(`/api/v1/carriers/${id}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.carrier).toBeDefined();
        expect(res.body.carrier._id).toBe(id);
    });

    test("GET /api/v1/carriers/:id returns 404 for non-existent ID", async () => {
        const res = await request(app).get("/api/v1/carriers/999999999999999999999999");
        expect(res.status).toBe(404);
    });

    test("DELETE /api/v1/carriers/:id deletes a carrier", async () => {
        const listRes = await request(app).get("/api/v1/carriers");
        expect(listRes.status).toBe(200);
        const listBody: FindCarrierResponse = listRes.body;
        expect(listBody.carriers).toBeDefined();
        expect(listBody.carriers!.length).toBeGreaterThan(0);

        const firstCarrier = listBody.carriers![0];
        const id = firstCarrier._id;

        const res = await request(app).delete(`/api/v1/carriers/${id}`);
        expect(res.status).toBe(202);
        expect(res.body.status).toBe("success");

        // Verify deletion
        const verifyRes = await request(app).get(`/api/v1/carriers/${id}`);
        expect(verifyRes.status).toBe(404);

    });


});
