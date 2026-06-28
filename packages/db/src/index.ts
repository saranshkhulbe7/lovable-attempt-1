import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// const connectionString = process.env["DATABASE_URL"]; // TODO
const connectionString =
  "postgresql://app:app@localhost:5432/lovable?schema=public";
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
