import * as dotenv from "dotenv";
import { Db, MongoClient } from "mongodb";

export async function getDb(): Promise<Db> {
    var connection = await getConnection();
    return connection.db("menu")
}

export async function getConnection(): Promise<MongoClient> {
    dotenv.config();
    const client: MongoClient = new MongoClient(process.env.MONGO_URI!);
    await client.connect();
    return client;
}
