import { Db, MongoClient } from "mongodb";
import { loadEnv } from "./functions";
import { MongoMemoryServer } from 'mongodb-memory-server';
import test from "node:test";

export async function getDb(): Promise<Db> {
    var connection = await getConnection();
    return connection.db(process.env.MONGO_DB_NAME);
}

let memoryServer: MongoClient | null = null;

export async function getConnection(): Promise<MongoClient> {
    loadEnv()
    if (process.env.NODE_ENV && process.env.NODE_ENV === "test") {

        const mongod = await MongoMemoryServer.create({
            instance: {
                dbName: process.env.MONGO_DB_NAME,
            }
        });

        if (memoryServer) {
            return memoryServer;
        } else {
            memoryServer = new MongoClient(mongod.getUri());
            await memoryServer.connect();
            return memoryServer;
        }
    }

    const client: MongoClient = new MongoClient(process.env.MONGO_URI!);
    await client.connect();
    return client;
}
