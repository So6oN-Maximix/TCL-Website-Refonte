// Remplit la base avec des membres de test (table User uniquement).
//
//   npx tsx prisma/seed.ts        # 30 membres par défaut
//   npx tsx prisma/seed.ts 60     # 60 membres
//
// Relançable à volonté : les anciens membres de test (e-mail en @seed.tcl.test) sont d'abord supprimés.
// Mot de passe de tous les comptes de test : 123456789

import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/lib/generated/prisma/client.js";
import { generateUsers, EMAIL_DOMAIN } from "./seedData";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
	if (process.env.NODE_ENV === "production") throw new Error("Seed refusé en production.");

	const count = Number(process.argv[2] ?? 30);
	if (!Number.isInteger(count) || count < 1 || count > 500) {
		throw new Error("Nombre d'utilisateurs invalide (1 à 500).");
	}

	const deleted = await prisma.user.deleteMany({ where: { email: { endsWith: EMAIL_DOMAIN } } });
	if (deleted.count > 0) { console.log(`${deleted.count} ancien(s) utilisateur(s) de test supprimé(s).`); }

	const password = await bcrypt.hash("123456789", 10);
	const users = generateUsers(count).map(u => ({
		...u,
		password
	}));

	const created = await prisma.user.createMany({ data: users });

	console.log(`${created.count} utilisateurs créés. Mot de passe : 123456789`);
}

main()
	.catch(err => {
		console.error(err);
		process.exitCode = 1;
	})
	.finally(() => prisma.$disconnect());