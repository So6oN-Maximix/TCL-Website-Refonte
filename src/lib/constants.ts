import type { SectionRole } from "#lib/generated/prisma/client.ts";

export const ROLE_LABELS: Record<SectionRole, string> = {
	DEVELOPPEUR: "Administrateur",
	PRESIDENT: "Administrateur",
	PRESIDENTE: "Administrateur",
	VICE_PRESIDENT: "Administrateur",
	VICE_PRESIDENTE: "Administrateur",
	TRESORIER: "Administrateur",
	TRESORIERE: "Administrateur",
	SECRETAIRE: "Administrateur",
	COACH: "Administrateur",
	MEMBRE: "Licencié",
	VISITEUR: "Visiteur"
};

export const NOT_ADMIN = ["VISITEUR", "MEMBRE"];