import { error, fail } from "@sveltejs/kit";
import { prisma } from "#lib/server/prisma.ts";
import type { PageServerLoad, Actions } from "./$types";