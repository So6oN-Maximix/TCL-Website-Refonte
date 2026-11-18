import { error, fail } from "@sveltejs/kit";
import { prisma } from "#lib/server/prisma.ts";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    console.log("PROFILE load, user:", locals.user?.id ?? null);
    if (!locals.user) throw error(403, "Accès refusé");

    return { user: locals.user };
};