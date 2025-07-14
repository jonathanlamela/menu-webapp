import { Db, MongoClient } from "mongodb";
import { loadEnv } from "./functions";

export async function getDb(): Promise<Db> {
    var connection = await getConnection();
    return connection.db(process.env.MONGO_DB_NAME);
}

export async function getConnection(): Promise<MongoClient> {
    loadEnv()
    const client: MongoClient = new MongoClient(process.env.MONGO_URI!);
    await client.connect();
    return client;
}
