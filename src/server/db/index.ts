import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../../drizzle/schema";
import { env } from "@/env";

const connectionString = env.DATABASE_URL;
const db = drizzle(postgres(connectionString), { schema });

export * as schema from "../../../drizzle/schema";
export default db;
