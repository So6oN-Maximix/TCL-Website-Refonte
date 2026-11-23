import { SectionRole } from "../src/lib/generated/prisma/client.js";

export const EMAIL_DOMAIN = "@seed.tcl.test";

const FIRST_NAMES_M = ["Yann", "Erwan", "Thomas", "Marc", "Lucas", "Hugo", "Loïc", "Gwendal", "Corentin", "Mathieu", "Antoine", "Julien", "Nicolas", "Maxime", "Ronan"];
const FIRST_NAMES_F = ["Claire", "Maëlle", "Alice", "Léa", "Sophie", "Camille", "Chloé", "Manon", "Marine", "Nolwenn", "Élodie", "Morgane", "Anaïs", "Sarah", "Inès"];
const LAST_NAMES = ["Lepage", "Kergoat", "Tanguy", "Morvan", "Bernard", "Dupont", "Leroy", "Abiven", "Le Gall", "Martin", "Péron", "Guillou", "Riou", "Coz", "Le Roux", "Quéré", "Floch", "Caroff"];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function slugify(str: string): string {
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "-");
}

function randomLicence(): string {
	const digits = Math.floor(1000000 + Math.random() * 9000000);
	const letter = "ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.floor(Math.random() * 24)];
	return `${digits}${letter}`;
}

function randomPhone(): string {
	const prefix = Math.random() > 0.3 ? "06" : "07";
	const pairs = Array.from({ length: 4 }, () => String(Math.floor(Math.random() * 100)).padStart(2, "0"));
	return `${prefix} ${pairs.join(" ")}`;
}

export function generateUsers(count: number) {
	const users = [];

	for (let i = 1; i <= count; i++) {
		const sexe = Math.random() > 0.5;
		const firstName = sexe ? pick(FIRST_NAMES_M) : pick(FIRST_NAMES_F);
		const lastName = pick(LAST_NAMES);

		const rand = Math.random();
		let role: SectionRole;
		if (rand < 0.15) {
			const adminRoles: SectionRole[] = sexe
				? [SectionRole.PRESIDENT, SectionRole.VICE_PRESIDENT, SectionRole.TRESORIER, SectionRole.SECRETAIRE, SectionRole.COACH]
				: [SectionRole.PRESIDENTE, SectionRole.VICE_PRESIDENTE, SectionRole.TRESORIERE, SectionRole.SECRETAIRE, SectionRole.COACH];
			role = pick(adminRoles);
		}
        else if (rand < 0.8) { role = SectionRole.MEMBRE; } 
        else { role = SectionRole.VISITEUR; }

		const isVisiteur = role === SectionRole.VISITEUR;
		const cotisationPayed = isVisiteur ? false : role !== SectionRole.MEMBRE ? true : Math.random() > 0.25;
		const licence = isVisiteur ? null : randomLicence();
		const phone = Math.random() > 0.15 ? randomPhone() : null;

		const memberSince = new Date(
			Date.now() - Math.floor(Math.random() * 5 * 365 * 24 * 60 * 60 * 1000)
		);

		users.push({
			sexe,
			email: `${slugify(firstName)}.${slugify(lastName)}.${i}${EMAIL_DOMAIN}`,
			firstName,
			lastName,
			licence,
			phone,
			cotisationPayed,
			role,
			memberSince
		});
	}

	return users;
}