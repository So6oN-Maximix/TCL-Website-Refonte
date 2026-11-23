import { error, fail } from "@sveltejs/kit";
import { prisma } from "#lib/server/prisma.ts";
import type { PageServerLoad, Actions } from "./$types";
import { NOT_ADMIN } from "#lib/constants.ts";

export const load: PageServerLoad = async () => {
	const [teams, users] = await Promise.all([
		prisma.team.findMany({
			include: {
                members: { omit: { password: true } },
                captain: { omit: { password: true } }
            },
			orderBy: { name: "asc" }
		}),
		prisma.user.findMany({
			where: { role: { not: "VISITEUR" } },
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				licence: true,
				sexe: true,
				teamId: true,
				team: { select: { name: true } }
			},
			orderBy: { lastName: "asc" }
		})
	]);

	return { teams, users };
};

export const actions: Actions = {
    addTeam: async ({ request, locals }) => {
        if (!locals.user || NOT_ADMIN.includes(locals.user.role)) return fail (403, "Non autorisé");

        const formData = await request.formData();

        const name = String(formData.get("name") ?? "").trim() || null;
        const category = String(formData.get("category"));
        const division = String(formData.get("division") ?? "").trim() || null;
        const matchDay = String(formData.get("matchDay"));
        const captainId = Number(formData.get("captainId") ?? 0);

        if (captainId === 0) return fail(400, { error: "Identifiant du capitaine introuvable" });
        if (!name || !category || !division || !matchDay) return fail(400, { error: "Champs manquants" });

        try {
            const newTeam = await prisma.team.create({
                data: {
                    name,
                    captainId,
                    category,
                    division,
                    matchDay
                },
                select: { id: true }
            });
            await prisma.user.update({
                where: { id: captainId },
                data: { teamId: newTeam.id }
            });

            return { success: true };
        } catch (error) { throw error }
    },
    saveTeam: async ({ request, locals }) => {
        if (!locals.user || NOT_ADMIN.includes(locals.user.role)) return fail(403, "Non autorisé");

        const formData = await request.formData();

        const rawTeamId = Number(formData.get("captainId"));
        const teamId = Number.isInteger(rawTeamId) && rawTeamId > 0 ? rawTeamId : null;
        if (!teamId) return fail(400, { error: "Identifiant équipe introuvable" });

        const name = String(formData.get("name") ?? "").trim();
        const category = String(formData.get("category"));
        const division = String(formData.get("division") ?? "").trim();
        const matchDay = String(formData.get("matchDay"));
        const rawCaptainId = Number(formData.get("captainId"));
        const captainId = Number.isInteger(rawCaptainId) && rawCaptainId > 0 ? rawCaptainId : null;
        const rawPlayers = String(formData.get("playerIds") ?? "[]");
        const playersIds: number[] = JSON.parse(rawPlayers).map(Number).filter(Number.isInteger);
        const isEngaged = Boolean(formData.get("isEngaged"));

        if (!name || !category || !division || !matchDay || !captainId) return fail(400, { error: "Champs manquants" });
        if (!playersIds.includes(captainId)) return fail(400, { error: "Le capitaine doit être dans l'équipe" });

        try {
            const [previousTeamUsers, ] = await Promise.all([
                prisma.user.findMany({
                    where: { teamId },
                    select: { id: true }
                }),
                prisma.team.update({
                    where: { id: teamId },
                    data: {
                        name,
                        category,
                        division,
                        matchDay,
                        captainId,
                        isEngaged
                    }
                })
            ]);

            await prisma.user.updateMany({
                where: { id: { in: previousTeamUsers.map(user => user.id) } },
                data: { teamId: null }
            });
            await prisma.user.updateMany({
                where: { id: { in: playersIds } },
                data: { teamId }
            });

            return { success: true };
        } catch (error) { throw error }
    }
};