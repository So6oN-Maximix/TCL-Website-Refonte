import { error, fail } from "@sveltejs/kit";
import { prisma } from "#lib/server/prisma.ts";
import type { PageServerLoad, Actions } from "./$types";
import { NOT_ADMIN } from "#lib/constants.ts";
import { START_HOURS, END_HOURS } from "#lib/constants.ts";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || NOT_ADMIN.includes(locals.user.role)) return fail(403, "Non autorisé");

    const [indisponibilites] = await Promise.all([
        prisma.indisponibilite.findMany({ where: { courtId: 1 } })
    ]);

    return {
        indisponibilites: indisponibilites ?? []
    };
};

export const actions: Actions = {
    block: async ({ request, locals }) => {
        if (!locals.user || NOT_ADMIN.includes(locals.user.role)) return fail(403, "Non autorisé");

        const formData = await request.formData();
        const raison = String(formData.get("raison") ?? "").trim() || null;
        const selectedHour = Number(formData.get("selectedHour") ?? 0);
        const rawDate = String(formData.get("selectedDate") ?? "");
        const selectedDate = new Date(`${rawDate}T00:00:00`);

        if (!raison) return fail(400, { error: "Donnez une raison pour l'indisponibilité" });
        if (!Number.isInteger(selectedHour) || START_HOURS > selectedHour || END_HOURS < selectedHour) return fail(400, { error: "L'heure d'indisponibilité n'est pas dans la bonne plage" });
        if (!rawDate || Number.isNaN(selectedDate.getTime())) return fail(400, { error: "Date invalide" });
        
        selectedDate.setHours(selectedHour);

        try {
            await prisma.indisponibilite.create({
                data: {
                    courtId: 1,
                    createdUserId: locals.user.id,
                    dateDebut: selectedDate,
                    raison
                }
            });
            return { success: true };
        } catch (error) { throw error }
    },
    unblock: async ({ request, locals }) => {
        if (!locals.user || NOT_ADMIN.includes(locals.user.role)) return fail(403, "Non autorisé");

        const formData = await request.formData();
        const indispoId = Number(formData.get("indispoId") ?? 0);
        if (indispoId === 0) return fail(400, { error: "Identifiant de l'indisponibilité introuvable" });

        try {
            await prisma.indisponibilite.delete({ where: { id: indispoId } });
            return { success: true };
        } catch (error) { throw error }
    }
};