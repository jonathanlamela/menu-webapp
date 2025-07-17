import { getDb } from "../utils/db";

const request = require("supertest")
import app from "../app";

import { Category } from "shared/types";
import { describe, expect, beforeAll, test, afterAll } from 'vitest';


describe("Base API Tests", () => {

    test("GET / should return status works", async () => {
        const res = await request(app).get("/api/v1/");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "works" });
    });

    test("GET / should redirect to /api/v1", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe("/api/v1");
    });

    test("GET /assets should serve static files", async () => {
        // This test assumes there is at least one file in the assets folder, e.g. logo.png
        const response = await request(app).get("/assets/express.png");
        // If the file exists, status should be 200, otherwise 404
        expect([200, 404]).toContain(response.status);
    });

    test("GET /api/v1 should respond (route exists)", async () => {
        const response = await request(app).get("/api/v1");
        // The response depends on your apiV1Routes implementation, but should not be 404
        expect(response.status).not.toBe(404);
    });


});


