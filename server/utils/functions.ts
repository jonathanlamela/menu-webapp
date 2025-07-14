import * as dotenv from "dotenv";

export function loadEnv() {
    dotenv.config({ path: `.env.${process.env.NODE_ENV}`, quiet: true });

}
