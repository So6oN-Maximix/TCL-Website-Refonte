import { error, fail } from "@sveltejs/kit";
import { prisma } from "#lib/server/prisma.ts";
import type { PageServerLoad, Actions } from "./$types";

const POSTE_RANK: Record<string, number> = {
	PRESIDENT: 1, PRESIDENTE: 1,
	VICE_PRESIDENT: 2, VICE_PRESIDENTE: 2,
	TRESORIER: 3, TRESORIERE: 3,
	SECRETAIRE: 4,
	DEVELOPPEUR: 5,
};

export const load: PageServerLoad = async ({}) => {
    try {
        const admins = await prisma.user.findMany({
            where: { section: { } },
            select: { firstName: true, lastName: true, email: true, role: true }
        });

        const byRank = (a: typeof admins[number], b: typeof admins[number]) =>
            (POSTE_RANK[a.role] ?? 99) - (POSTE_RANK[b.role] ?? 99) ||
            a.lastName.localeCompare(b.lastName);

        const coaches = admins.filter(a => a.role === "COACH").sort(byRank);
        const bureau = admins.filter(a => a.role !== "COACH").sort(byRank);

        return { bureau, coaches };
    } catch (error) { throw error }
};