import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "#lib/server/prisma.ts";
import bcrypt from "bcrypt";
import type { PageServerLoad, Actions } from "./$types";
import { startSession } from "#lib/server/session.ts";
import { formatPhoneGlobal } from "#lib/utils.ts";

const DUMMY_HASH = bcrypt.hashSync("dummy-password", 12);

export const actions: Actions = {
    signup: async ({ request, cookies }) => {
        const formData = await request.formData();

		const firstName = String(formData.get("firstName") ?? "").trim();
		const lastName = String(formData.get("lastName") ?? "").trim();
		const email = String(formData.get("email") ?? "").trim().toLowerCase();
        const licence = String(formData.get("licence") ?? "").trim() || null;
		const phone = String(formData.get("phone") ?? "").trim() || null;
		const password = String(formData.get("password") ?? "");
		const confirmPassword = String(formData.get("confirmPassword") ?? "");

		if (!firstName || !lastName || !email || !password || !confirmPassword) return fail(400, { error: "Champs invalides" });
        if (password !== confirmPassword) return fail(400, { error: "Les mots de passe doivent être identiques"})
		if (!/^\S+@\S+\.\S+$/.test(email)) return fail(400, { error: "Adresse e-mail invalide" });
		if (password.length < 8) return fail(400, { error: "Le mot de passe doit faire au moins 8 caractères" });
		if (Buffer.byteLength(password) > 72) return fail(400, { error: "Le mot de passe est trop long (72 caractères max)" });

		const passwordHash = await bcrypt.hash(password, 12);

		try {
			const userAddedId = await prisma.user.create({
				data: {
					email,
					password: passwordHash,
					firstName,
					lastName,
					licence,
					phone: formatPhoneGlobal(phone)
				},
				select: { id: true }
			});

            startSession(cookies, userAddedId.id);
		} catch (error) {
			if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") return fail(400, { error: "Un compte existe déjà avec cet e-mail." });
			throw error;
		}

		redirect(303, "/profile");
    },
	login: async ({ request, cookies }) => {
		const data = await request.formData();

        const email = String(data.get("email") ?? "").trim();
        const password = String(data.get("password") ?? "");
        
		if (!email || !password) return fail(400, { error: "Champs invalides" });

        try {
            const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
            const ok = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);
            if (!user || !ok) return fail(400, { error: "Utilisateur ou mot de passe incorrect" });

            startSession(cookies, user.id);
			console.log("LOGIN ok, session pour l'utilisateur", user.id);
        } catch (error) { throw error; }
		
		redirect(303, "/profile");
    }
};