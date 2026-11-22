import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
	default: async ({ cookies, locals }) => {
		cookies.delete("token", { path: "/" });
		locals.user = null;
		throw redirect(303, "/");
	}
};