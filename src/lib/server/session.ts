import jwt from "jsonwebtoken";
import type { Cookies } from "@sveltejs/kit";
import { JWT_SECRET } from "$app/env/private";

export function startSession(cookies: Cookies, userId: number) {
	const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
	cookies.set("token", token, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24
	});
}