import { error, fail } from "@sveltejs/kit";
import { prisma } from "#lib/server/prisma.ts";
import type { PageServerLoad, Actions } from "./$types";
import bcrypt from "bcrypt";
import { NOT_ADMIN } from "#lib/constants.ts";
import { isValidRole, formatPhoneGlobal } from "#lib/utils.ts";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || NOT_ADMIN.includes(locals.user.role)) return fail(403, "Non autorisé");

    const users = await prisma.user.findMany({
        omit: { password: true },
        include: {
            team: true,
            section: true
        },
        orderBy: { lastName: "asc" }
    });

    return { users };
};

export const actions: Actions = {
    addUser: async ({ request, locals }) => {
        if (!locals.user || NOT_ADMIN.includes(locals.user.role)) return fail(403, "Non autorisé");

        const formData = await request.formData();

        const firstName = String(formData.get("firstName") ?? "").trim();
        const lastName = String(formData.get("lastName") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "").trim();
        const sexe = Boolean(formData.get("sexe") ?? true);
        let role = String(formData.get("role"));
        if (role === "ADMIN") role = String(formData.get("roleDesc"));
        const licence = String(formData.get("licence") ?? "").trim() || null;
        const cotisationPayed = Boolean(formData.get("cotisation"));

        if (!firstName || !lastName || !email || !password) return fail(400, { error: "Champs manquants" });
        if (!isValidRole(role)) return fail(400, { error: "Rôle non valide" });
		if (!/^\S+@\S+\.\S+$/.test(email)) return fail(400, { error: "Adresse e-mail invalide" });
		if (password.length < 8) return fail(400, { error: "Le mot de passe doit faire au moins 8 caractères" });
		if (Buffer.byteLength(password) > 72) return fail(400, { error: "Le mot de passe est trop long (72 caractères max)" });

        const passwordHashed = await bcrypt.hash(password, 12);

        try {
            await prisma.user.create({
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
        } catch (error) { throw error }
    },
    saveUser: async ({ request, locals }) => {
        if (!locals.user || NOT_ADMIN.includes(locals.user.role)) return fail(403, "Non autorisé");

        const formData = await request.formData();
        
        const userId = Number(formData.get("userId") ?? 0);
        const firstName = String(formData.get("firstName") ?? "").trim();
        const lastName = String(formData.get("lastName") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        let role = String(formData.get("role"));
        if (role === "ADMIN") role = String(formData.get("roleDesc"));
        const phone = String(formData.get("phone") ?? "").trim() || null;
        const licence = String(formData.get("licence") ?? "").trim() || null;
        const cotisationPayed = Boolean(formData.get("cotisation"));
        
        if (userId === 0) return fail(400, { error: "Identifiant utilisateur introuvable" });
        if (!firstName || !lastName || !email) return fail(400, { error: "Champs manquants" });
        if (!isValidRole(role)) return fail(400, { error: "Rôle non valide" });
		if (!/^\S+@\S+\.\S+$/.test(email)) return fail(400, { error: "Adresse e-mail invalide" });

        try {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    firstName,
                    lastName,
                    email,
                    role,
                    phone: formatPhoneGlobal(phone),
                    licence,
                    cotisationPayed
                }
            });
            
            return { success: true };
        } catch (error) { throw error }
    },
    deleteUser: async ({ request, locals }) => {
        if (!locals.user || NOT_ADMIN.includes(locals.user.role)) return fail(403, "Non autorisé");

        const formData = await request.formData();
        const userId = Number(formData.get("userId") ?? 0);

        if (userId === 0) return fail(400, { error: "Identifiant utilisateur introuvable" });
        if (userId === locals.user.id) return fail(400, { error: "Vous ne pouvez pas supprimer votre propre compte" });

        try {
            await prisma.user.delete({ where: { id: userId } });
        } catch (error) { throw error };
    }
};