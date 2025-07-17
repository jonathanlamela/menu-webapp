import * as dotenv from "dotenv";

export function loadEnv() {
    if (!process.env.NODE_ENV) {
        dotenv.config({ path: `.env`, quiet: true });
    } else {
        dotenv.config({ path: `.env.${process.env.NODE_ENV}`, quiet: true });
    }

}
