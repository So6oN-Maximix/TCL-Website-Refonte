import type { SectionRole } from "#lib/generated/prisma/client.ts";
import { ROLE_LABELS } from "./constants";
import { toasts } from "#lib/stores/toast.ts";

type ToastType = "success" | "error" | "info";
export function showToast(msg: string, type = "success") { toasts.send(msg, type as ToastType); }

export function formatPhoneGlobal(phone: string | null) {
	if (!phone) return null;
	const digits = phone.replace(/[\s.\-()]/g, "");
 
	if (/^0[1-9]\d{8}$/.test(digits)) return `+33${digits.slice(1)}`;
	if (/^\+33[1-9]\d{8}$/.test(digits)) return digits;
	return null;
}

export function formatPhoneUX(phone: string | null) {
    if (!phone) return null;
    const digits = phone.replace("+33", "0");
    return digits.match(/\d{2}/g)?.join(" ");
}

export function isValidRole(role: string): role is SectionRole { return Object.hasOwn(ROLE_LABELS, role); }