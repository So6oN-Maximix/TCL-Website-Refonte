import { prisma } from "#lib/server/prisma.ts";
import type { Handle } from "@sveltejs/kit/hooks";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "$app/env/private";

export const handle: Handle = async ({ event, resolve }) => {
    console.log("HOOK", event.request.method, event.url.pathname, "token:", !!event.cookies.get("token"));
    event.locals.user = null;

    const token = event.cookies.get("token");
    if (token) {
        try {
            const { userId } = jwt.verify(token, JWT_SECRET) as { userId: number };
            event.locals.user = await prisma.user.findUnique({
                where: { id: userId },
                omit: { password: true, updatedAt: true, createdAt: true }
            });
        } catch (e) {
            console.error("jwt invalide :", e);
            event.cookies.delete("token", { path: "/" });
        }
    }

    const url = event.url;
    const protectedRoutes = ["/profile"];
    const isProtected = protectedRoutes.some(route => url.pathname.startsWith(route));

    if (isProtected && !event.locals.user) {
        return new Response(null, {
            status: 303,
            headers: { Location: "/" }
        });
    }

    return await resolve(event);
};