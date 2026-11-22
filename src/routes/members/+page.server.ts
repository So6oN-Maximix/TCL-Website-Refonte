import { error, fail } from "@sveltejs/kit";
import { prisma } from "#lib/server/prisma.ts";
import type { PageServerLoad, Actions } from "./$types";
import bcrypt from "bcrypt";
import { ROLE_LABELS } from "#lib/constants.ts";
import { isValidRole } from "#lib/utils.ts";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || ROLE_LABELS[locals.user.role] !== "Administrateur") return fail(403, "Non autorisé");
};

export const actions: Actions = {
    addUser: async ({ request, locals }) => {
        if (!locals.user || ROLE_LABELS[locals.user.role] !== "Administrateur") return fail(403, "Non autorisé");

        const formData = await request.formData();

        const firstName = String(formData.get("firstName") ?? "").trim();
        const lastName = String(formData.get("lastName") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "").trim();
        const sexe = Boolean(formData.get("sexe") ?? true);
        let role = String(formData.get("role"));
        if (role === "ADMIN") role = String(formData.get("roleDesc"));
        const licence = String(formData.get("Licence") ?? "").trim() || null;
        const cotisationPayed = Boolean(formData.get("cotisation"));

        if (!firstName || !lastName || !email || !password) return fail(400, { error: "Champs manquants" });
        if (!isValidRole(role)) return fail(400, { error: "Rôle non valide" });
		if (!/^\S+@\S+\.\S+$/.test(email)) return fail(400, { error: "Adresse e-mail invalide" });
		if (password.length < 8) return fail(400, { error: "Le mot de passe doit faire au moins 8 caractères" });
		if (Buffer.byteLength(password) > 72) return fail(400, { error: "Le mot de passe est trop long (72 caractères max)" });

        const passwordHashed = await bcrypt.hash(password, 12);

        try {
            const userAdded = await prisma.user.create({
                data: {
                    email,
                    password: passwordHashed,
                    firstName,
                    lastName,
                    sexe,
                    role,
                    licence,
                    cotisationPayed
                }
            });

            return { success: true };
        } catch { throw error }
    }
};