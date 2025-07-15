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


});
