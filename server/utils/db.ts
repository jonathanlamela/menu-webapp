import * as dotenv from "dotenv";
import { Db, MongoClient } from "mongodb";

export async function getDbConnection(): Promise<Db> {
    dotenv.config();

    const client: MongoClient = new MongoClient(process.env.MONGO_URI!);

    await client.connect();

    return client.db("menu")
}
