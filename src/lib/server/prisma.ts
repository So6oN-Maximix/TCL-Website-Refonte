import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#lib/generated/prisma/client.ts";
import { DATABASE_URL } from "$app/env/private";

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
export const prisma = new PrismaClient({ adapter });