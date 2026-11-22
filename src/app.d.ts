// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { User, SectionRole } from "#lib/generated/prisma/client.ts";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
            user: (Omit<User, "password" | "updatedAt" | "createdAt">) | null;
        }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
