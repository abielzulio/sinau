import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";

const connectionString = env.DATABASE_URL;
const db = drizzle(postgres(connectionString));

export * from "@/../drizzle/schema";
export default db;
