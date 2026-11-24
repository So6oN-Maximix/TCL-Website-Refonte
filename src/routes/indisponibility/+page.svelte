<script lang="ts">
	import type { PageProps } from "./$types";
	import { START_HOURS, END_HOURS } from "#lib/constants.ts";
	import { enhance } from "$app/forms";
	import { showToast } from "#lib/utils.ts";

	let { data }: PageProps = $props();
	console.log(data.indisponibilites);

	function getMonday(fromDate: Date = new Date()): Date {
		const date = new Date(fromDate);
		const day = date.getDay();
		const diff = day === 0 ? -6 : 1 - day;
		date.setDate(date.getDate() + diff);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	
	let currentMonday = $state(getMonday());
	let selectedDate = $state(new Date(new Date().setHours(0, 0, 0, 0)));
	let weekDays = $derived(
		Array.from({ length: 7 }, (_, i) => {
			const date = new Date(currentMonday);
			date.setDate(currentMonday.getDate() + i);

			const weekday = date.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "");
			const dayNum = date.getDate();
			const month = date.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "");

			return {
				date,
				iso: date.toISOString().slice(0, 10),
				topLabel: `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${dayNum}`,
				monthLabel: `${month}.`
			};
		})
	);
	let weekRangeLabel = $derived.by(() => {
		const first = weekDays[0].date;
		const last = weekDays[6].date;
		const sameMonth = first.getMonth() === last.getMonth();

		if (sameMonth) {
			const monthYear = last.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
			return `${first.getDate()} – ${last.getDate()} ${monthYear}`;
		}
		const startStr = first.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
		const endStr = last.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
		return `${startStr} – ${endStr}`;
	});

	function changeWeek(offsetWeek: number) {
		const next = new Date(currentMonday);
		next.setDate(next.getDate() + offsetWeek * 7);
		currentMonday = next;

		const nextSelected = new Date(selectedDate);
		nextSelected.setDate(nextSelected.getDate() + offsetWeek * 7);
		selectedDate = nextSelected;
	}

	const isSameDay = (a: Date, b: Date) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	let selectedHour = $state<number>(0);
	let showBlockModal = $state(false);

	type Indisponibilite = NonNullable<typeof data.indisponibilites>[number];
	let blockedMap = $derived.by(() => {
		const map = new Map<string, Indisponibilite>();

		for (const item of data.indisponibilites ?? []) {
			const d = new Date(item.dateDebut);
			const dateKey = d.toLocaleDateString("en-CA");
			const hour = d.getHours();
			map.set(`${item.courtId}-${dateKey}-${hour}`, item);
		}

		return map;
	});

	function getBlockedSlot(hour: number) {
		const dateKey = selectedDate.toLocaleDateString("en-CA");
		return blockedMap.get(`1-${dateKey}-${hour}`) ?? null;
	}
</script>

<svelte:head>
    <title>Indisponibilités - TCL</title>
</svelte:head>

<section class="page-hero">
	<svg class="court-lines" viewBox="0 0 1100 260" preserveAspectRatio="xMidYMid slice">
		<rect x="750" y="10" width="320" height="240" fill="none" stroke="#F6F4EC" stroke-width="2"/>
		<line x1="750" y1="130" x2="1070" y2="130" stroke="#F6F4EC" stroke-width="2"/>
	</svg>
	<div class="wrap">
		<span class="eyebrow">Administration</span>
		<h1>Disponibilités</h1>
		<p>Bloquez des créneaux pour l'entretien, les cours collectifs ou les tournois — les membres ne pourront plus les réserver.</p>
	</div>
</section>

<section id="admin-guard-message" hidden>
	<div class="wrap">
		<p class="auth-error" style="display:block;">Accès réservé aux administrateurs. Redirection…</p>
	</div>
</section>

<section id="admin-content">
	<div class="wrap booking">
		<div class="booking-panel">
			<h3>Court</h3>
			<div class="court-option selected">
				<div>
					<div class="name">Salle de la Forge</div>
					<div class="type">Intérieur</div>
				</div>
			</div>
		</div>

		<div>
			<h3 style="margin-bottom: 16px;">Date</h3>
			<div class="week-nav">
				<button type="button" class="week-nav-btn" aria-label="Semaine précédente" onclick={() => changeWeek(-1)} disabled={currentMonday <= new Date()}>&larr;</button>
				<span class="week-nav-label" id="week-nav-label">{weekRangeLabel}</span>
				<button type="button" class="week-nav-btn" aria-label="Semaine suivante" onclick={() => changeWeek(1)}>&rarr;</button>
			</div>
			<div class="date-picker">
				{#each weekDays as day (day.iso)}
					<button type="button" class="date-pill" class:selected={isSameDay(day.date, selectedDate)} onclick={() => (selectedDate = day.date)}>
						<span class="d">{day.topLabel}</span>
						<span class="m">{day.monthLabel}</span>
					</button>
				{/each}
			</div>

			<h3 style="margin: 28px 0 4px;" id="grid-title">Créneaux — Salle de la Forge, {selectedDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long"})}</h3>

			<div class="slot-legend">
				<span class="legend-item"><span class="legend-swatch swatch-free"></span>Libre — cliquer pour bloquer</span>
				<span class="legend-item"><span class="legend-swatch swatch-taken"></span>Réservé par un membre</span>
				<span class="legend-item"><span class="legend-swatch swatch-unavailable"></span>Bloqué — cliquer pour débloquer</span>
			</div>

			<div class="slot-grid">
				{#each { length: END_HOURS - START_HOURS } as _, i}
					{@const blocked = getBlockedSlot(START_HOURS + i)}
					<button type="button" class="slot" class:slot-blockable={!blocked} class:slot-unavailable={!!blocked} disabled={!!blocked} onclick={() => {selectedHour = START_HOURS + i; showBlockModal = true;}}>
						{START_HOURS + i}h – {START_HOURS + i + 1}h
						{#if blocked?.raison}
							<em class="slot-reason">{blocked.raison}</em>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
</section>

{#if showBlockModal}
<div class="modal-overlay">
	<div class="modal" role="dialog" aria-modal="true" aria-labelledby="block-modal-title">
		<div class="modal-head">
			<h3 id="block-modal-title">Bloquer un créneau</h3>
			<button type="button" class="modal-close" aria-label="Fermer" onclick={() => showBlockModal = false}>&times;</button>
		</div>
		<form method="POST" action="?/block" use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === "success") {
					showBlockModal = false;
					selectedHour = 0;
					showToast("Indisponibilité ajoutée");
				} else if (result.type === "failure") {
					const data = result.data as { error?: string } | undefined;
					const errorMessage = data?.error || "Erreur server";
					showToast(errorMessage, "error");
				}
				update();
			};
		}}>
			<input type="hidden" name="selectedHour" value={selectedHour}>
			<input type="hidden" name="selectedDate" value={selectedDate.toLocaleDateString("en-CA")}>
			<p class="modal-slot-label"><span id="block-form-court-label">Salle de la Forge · Intérieur</span> — <strong id="block-form-slot-label">{selectedHour}h – {selectedHour + 1}h</strong></p>
			<div class="form-group">
				<label for="block-raison">Raison du blocage</label>
				<input type="text" name="raison" id="block-raison" placeholder="Ex: Entretien, cours collectif, tournoi…" required>
			</div>
			<div class="form-group form-group-submit">
				<button type="submit" class="btn-primary">Bloquer ce créneau</button>
				<button type="button" class="btn-outline btn-small" onclick={() => showBlockModal = false}>Annuler</button>
			</div>
		</form>
	</div>
</div>
{/if}

<!-- Modale de déblocage d'un créneau -->
<div class="modal-overlay" id="unblock-modal-overlay" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="unblock-modal-title">
        <div class="modal-head">
            <h3 id="unblock-modal-title">Débloquer un créneau</h3>
            <button type="button" class="modal-close" id="unblock-modal-close" aria-label="Fermer">&times;</button>
        </div>
        <form id="unblock-form">
            
            <!-- Encart d'informations structuré -->
            <div style="background-color: rgba(0, 0, 0, 0.03); border-left: 4px solid var(--clay); padding: 16px; margin-bottom: 20px; border-radius: 4px;">
                <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8; color: #333;">
                    <li><strong>Court :</strong> <span id="unblock-info-court">...</span></li>
                    <li><strong>Date :</strong> <span id="unblock-info-date">...</span></li>
                    <li><strong>Créneau :</strong> <span id="unblock-info-heure">...</span></li>
                    <li><strong>Raison :</strong> <span id="unblock-info-raison">...</span></li>
                </ul>
            </div>

            <div class="form-group">
                <p style="margin: 0; color: #555; font-size: 0.95em;">
                    Êtes-vous sûr de vouloir débloquer cette plage horaire ? Elle redeviendra immédiatement disponible pour les membres.
                </p>
				<p class="modal-status" hidden></p>
            </div>
            
            <div class="form-group form-group-submit" style="margin-top: 24px;">
                <button type="submit" class="btn-primary">Confirmer le déblocage</button>
                <button type="button" class="btn-outline btn-small" id="unblock-form-cancel">Annuler</button>
            </div>
        </form>
    </div>
</div>

<!-- Modale d'ajout d'une indisponibilité récurrente -->
<div class="modal-overlay" id="recurring-modal-overlay" hidden>
	<div class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="recurring-modal-title">
		<div class="modal-head">
			<h3 id="recurring-modal-title">Bloquer un créneau récurrent</h3>
			<button type="button" class="modal-close" id="recurring-modal-close" aria-label="Fermer">&times;</button>
		</div>

		<form id="recurring-form">
			<div class="form-group">
				<label for="recurring-court">Court</label>
				<select id="recurring-court" name="court" required>
					<option value="1">Court 1 · Extérieur</option>
					<option value="2">Court 2 · Couvert</option>
				</select>
			</div>

			<div class="form-group">
				<label for="recurring-raison">Raison</label>
				<input type="text" id="recurring-raison" name="raison" placeholder="Ex: Cours collectif du mardi" required>
			</div>

			<div class="form-group-cols">
				<div class="form-group">
					<label for="recurring-heure-debut">Heure de début</label>
					<select id="recurring-heure-debut" name="heureDebut" required>
						<option value="9">9h00</option>
						<option value="10">10h00</option>
						<option value="11">11h00</option>
						<option value="12">12h00</option>
						<option value="14" selected>14h00</option>
						<option value="15">15h00</option>
						<option value="16">16h00</option>
						<option value="17">17h00</option>
						<option value="18">18h00</option>
						<option value="19">19h00</option>
						<option value="20">20h00</option>
						<option value="21">21h00</option>
					</select>
				</div>
				<div class="form-group">
					<label for="recurring-heure-fin">Heure de fin</label>
					<select id="recurring-heure-fin" name="heureFin" required>
						<option value="10">10h00</option>
						<option value="11">11h00</option>
						<option value="12">12h00</option>
						<option value="13">13h00</option>
						<option value="15" selected>15h00</option>
						<option value="16">16h00</option>
						<option value="17">17h00</option>
						<option value="18">18h00</option>
						<option value="19">19h00</option>
						<option value="20">20h00</option>
						<option value="21">21h00</option>
						<option value="22">22h00</option>
					</select>
				</div>
			</div>

			<div class="form-group">
				<label>Se répète chaque</label>
				<div class="weekday-picker" id="weekday-picker">
					<button type="button" class="weekday-pill" data-day="1">L</button>
					<button type="button" class="weekday-pill" data-day="2">M</button>
					<button type="button" class="weekday-pill" data-day="3">M</button>
					<button type="button" class="weekday-pill" data-day="4">J</button>
					<button type="button" class="weekday-pill" data-day="5">V</button>
					<button type="button" class="weekday-pill" data-day="6">S</button>
					<button type="button" class="weekday-pill" data-day="0">D</button>
				</div>
			</div>

			<div class="form-group">
				<label for="recurring-start-date">À partir du</label>
				<input type="date" id="recurring-start-date" name="startDate" required>
			</div>

			<div class="form-group">
				<label>Se termine</label>
				<div class="recurrence-end-options">
					<label class="radio-line">
						<input type="radio" name="recurrenceEnd" value="on-date" checked>
						Le
						<input type="date" id="recurring-end-date" name="dateFin" class="inline-date">
					</label>
					<label class="radio-line">
						<input type="radio" name="recurrenceEnd" value="after-count">
						Dans
						<input type="number" id="recurring-occurrences" name="occurrences" class="inline-number" min="1" max="52" value="1" disabled>
						semaines
					</label>
				</div>
			</div>

			<p class="modal-note">Un créneau d'indisponibilité distinct sera créé pour chaque date correspondante. <br> Vous pourrez les débloquer individuellement depuis la liste ci-dessous.</p>
			<p class="modal-status" id="recurring-status" hidden></p>

			<div class="modal-actions">
				<button type="submit" class="btn-primary">Créer les indisponibilités</button>
				<button type="button" class="btn-outline btn-small" id="recurring-modal-cancel">Annuler</button>
			</div>
		</form>
	</div>
</div>

<section class="section-tinted" id="upcoming-section">
	<div class="wrap">
		<div class="block-head" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
            <div>
			    <h3 style="margin-bottom: 4px;">Indisponibilités à venir</h3>
			    <span class="block-count">0 créneau bloqué</span>
            </div>
            <div class="dispo-actions-row">
                <button type="button" class="btn-outline btn-small" id="open-recurring-modal">+ Bloquer un créneau récurrent</button>
            </div>
		</div>

		<div class="admin-table-wrap">
			<div class="dispo-table-head">
				<span>Court</span>
				<span>Date</span>
				<span>Créneau</span>
				<span>Raison</span>
				<span>Actions</span>
			</div>
			<div id="dispo-list"></div>
		</div>
	</div>
</section>

<style>
	button.date-pill {
		display: block;
		font: inherit;
		font-size: 100;
		line-height: inherit;
		text-align: inherit;
		appearance: none;
		-webkit-appearance: none;
	}

	.date-pill .m {
		display: block;
		font-size: 0.85rem;
		font-weight: 400;
		opacity: 0.9;
		margin-top: 2px;
	}

	.week-nav-btn:disabled {
		opacity: 0.38;
		pointer-events: none;
		background-color: transparent;
		border-color: #DAD2B8;
		color: var(--ink-soft, #5C6860);
		transform: none;
		box-shadow: none;
		cursor: not-allowed;
	}

	button.slot {
		display: block;
		width: 100%;
		margin: 0;
		color: inherit;
		font-family: inherit;
		appearance: none;
		-webkit-appearance: none;
	}

	button.slot.slot-unavailable {
		background: repeating-linear-gradient(45deg, #EFEBDD, #EFEBDD 6px, #E3DCC4 6px, #E3DCC4 12px);
		color: var(--ink-soft);
		cursor: not-allowed;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		padding: 8px 4px;
	}
</style>