import { error, fail } from "@sveltejs/kit";
import { prisma } from "#lib/server/prisma.ts";
import type { PageServerLoad, Actions } from "./$types";
import { formatPhoneGlobal, formatPhoneUX } from "#lib/utils.ts";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) throw error(403, "Accès refusé");
    console.log(locals.user);

    return { user: { ...locals.user, phone: formatPhoneUX(locals.user.phone) } };
};

export const actions: Actions = {
    saveInfos: async ({ request, locals }) => {
        if (!locals.user) throw error(403, "Accès refusé");

        const formData = await request.formData();

        const firstName = String(formData.get("firstName") ?? "").trim();
        const lastName = String(formData.get("lastName") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim().toLowerCase();
        const phone = String(formData.get("phone") ?? "").trim();

        try {
            await prisma.user.update({
                where: { id: locals.user.id },
                data: { firstName, lastName, email, phone: formatPhoneGlobal(phone) }
            });
            return { action: "saveInfos", success: true }
        } catch (error) { throw error }
    }
};