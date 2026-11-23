<script lang="ts">
	import { showToast } from "#lib/utils.ts";
	import { enhance } from "$app/forms";
    import type { PageProps } from "./$types";
    let { data }: PageProps = $props();

    type UserOption = {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        licence: string | null;
        sexe: boolean;
        teamId: number | null;
        team?: { name: string } | null;
    };

    function normalize(str: string) {
		return str
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.trim();
	}

	function filterUsers(query: string, excludeIds: number[] = []) {
		const q = normalize(query);
		return data.users
			.filter(u => !excludeIds.includes(u.id))
			.filter(u => {
				if (!q) return true;
				const fullName = normalize(`${u.firstName} ${u.lastName}`);
				const reverseName = normalize(`${u.lastName} ${u.firstName}`);
				const email = normalize(u.email);
				const licence = normalize(u.licence ?? "");
				return (
					fullName.includes(q) ||
					reverseName.includes(q) ||
					email.includes(q) ||
					licence.includes(q)
				);
			})
			.slice(0, 8);
	}

    let captainSearch = $state("");
	let playersSearch = $state("");
	let captain = $state<UserOption | null>(null);
	let players = $state<UserOption[]>([]);

	let filteredCaptains = $derived(filterUsers(captainSearch, captain ? [captain.id] : []));
	let filteredPlayers = $derived(filterUsers(playersSearch, players.map(p => p.id)));

	function selectCaptain(user: UserOption | null) {
		captain = user;
		captainSearch = "";
		if (user && !players.some(p => p.id === user.id)) players = [...players, user];
	}

	function addPlayer(user: UserOption) {
		players = [...players, user];
		playersSearch = "";
	}

	function removePlayer(id: number) {
		players = players.filter(p => p.id !== id);
		if (captain?.id === id) captain = null;
	}

	type Team = NonNullable<typeof data.teams>[number];

	let showAddTeamForm = $state(false);
	let showDeleteConfirm = $state(false);
	let selectedTeam = $state<Team | null>(null);

	function openModal(team: Team) {
        selectedTeam = { ...team, members: [...team.members] };
        players = [...team.members];
	    selectCaptain(team.captain);
    }
</script>

<svelte:head>
	<title>Administration Équipes - TCL</title>
</svelte:head>

<section class="page-hero">
	<svg class="court-lines" viewBox="0 0 1100 260" preserveAspectRatio="xMidYMid slice">
		<rect x="750" y="10" width="320" height="240" fill="none" stroke="#F6F4EC" stroke-width="2"/>
		<line x1="750" y1="130" x2="1070" y2="130" stroke="#F6F4EC" stroke-width="2"/>
	</svg>
	<div class="wrap">
		<span class="eyebrow">Administration</span>
		<h1>Gestion des équipes</h1>
		<p>Équipes engagées en championnat, catégorie, capitaine et joueurs — modifiable directement ici.</p>
	</div>
</section>

<section>
	<div class="wrap">
		<div class="filter-group" style="align-items: flex-end;">
			<span class="team-member-count">{data.teams.filter(t => t.isEngaged).length} équipes engagées</span>
			<button type="button" class="btn-primary" onclick={() => showAddTeamForm = !showAddTeamForm}>+ Ajouter une équipe</button>
		</div>

		{#if showAddTeamForm}
		<form method="POST" action="?/addTeam" class="member-create-form" style="margin-top: -8px; position: relative;" use:enhance={() => {
            return async ({ result, update }) => {
                if (result.type === "success") {
                    showAddTeamForm = false;
                    captain = null;
                    showToast("Equipe créée");
                }
                else if (result.type === "failure") {
                    const data = result.data as { error?: string } | undefined;
                    const errorMessage = data?.error || "Erreur server";
                    showToast(errorMessage, "error");
                }
                update();
            }
        }}>
			<button type="button" class="modal-close" aria-label="Fermer" onclick={() => (showAddTeamForm = false)} style="position: absolute; top: 16px; right: 20px;">&times;</button>
			<h3 style="grid-column: 1 / -1; font-size: 16px; margin-bottom: 8px;">Nouvelle équipe</h3>
			<div class="form-group">
				<label for="newTeamName">Nom de l'équipe</label>
				<input type="text" id="newTeamName" name="name" placeholder="Équipe 3" required>
			</div>
			<div class="form-group">
				<label for="newTeamCategory">Catégorie</label>
				<select id="newTeamCategory" name="category">
					<option value="HOMMES">Hommes</option>
					<option value="DAMES">Dames</option>
					<option value="MIXTE">Mixte</option>
					<option value="JEUNES">Jeunes</option>
				</select>
			</div>
			<div class="form-group">
				<label for="newTeamDivision">Division</label>
				<input type="text" id="newTeamDivision" name="division" placeholder="Départementale 3">
			</div>
			<div class="form-group">
				<label for="newTeamMatchDay">Jour des rencontres</label>
				<select id="newTeamMatchDay" name="matchDay">
					<option>Samedi</option>
					<option>Dimanche</option>
				</select>
			</div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label for="newTeamCaptainSearch">Capitaine</label>
                <input type="hidden" name="captainId" value={captain?.id ?? ""} />
                {#if captain}
                    <div class="selected-captain-card">
                        <div class="picker-person-info">
                            <strong>{captain.firstName} {captain.lastName.toUpperCase()}</strong>
                            <span>{captain.email} {captain.licence ? `· Lic. ${captain.licence}` : ""}</span>
                        </div>
                        <button type="button" class="chip-remove" onclick={() => (captain = null)} aria-label="Retirer le capitaine">
                            &times;
                        </button>
                    </div>
                {/if}

                <div class="member-picker">
                    <input
                        type="search"
                        id="TeamCaptainSearch"
                        class="picker-search-input"
                        bind:value={captainSearch}
                        placeholder="Rechercher un licencié par nom, e-mail ou licence..."
                    />
                    {#if captainSearch.length > 0}
                    <div class="picker-results">
                        {#each filteredCaptains as user (user.id)}
                            <div class="picker-result-item">
                                <div class="picker-person-info">
                                    <strong>{user.firstName} {user.lastName.toUpperCase()}</strong>
                                    <span>{user.email} · {user.team ? user.team.name : "Sans équipe"}</span>
                                </div>
                                <button type="button" class="btn-picker-action" onclick={() => selectCaptain(user)}>
                                    Affecter
                                </button>
                            </div>
                        {:else}
                            <div class="picker-result-item">
                                <span style="font-size: 13px; color: var(--ink-soft);">Aucun licencié trouvé</span>
                            </div>
                        {/each}
                    </div>
                    {/if}
                </div>
            </div>
			<div class="form-group form-group-submit">
				<button type="submit" class="btn-primary">Créer l'équipe</button>
				<button type="button" class="btn-outline" onclick={() => showAddTeamForm = false}>Annuler</button>
			</div>
		</form>
		{/if}

		<div class="members-directory">
			{#each data.teams as team}
			<div class="member-list-item" role="button" tabindex="0" onclick={() => openModal(team)} onkeydown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					openModal(team);
				}
			}}>
				<div class="member-info">
					<strong class="member-name">{team.name}</strong>
					<span class="member-email">{team.category} · rencontres le {team.matchDay.toLowerCase()} · capitaine {team.captain?.lastName.toUpperCase()} {team.captain?.firstName}</span>
				</div>
				<div class="member-badges">
					<span class={`role-badge ${team.category === "DAMES" ? "role-badge-admin" : "role-badge-membre"}`}>{team.category}</span>
					<span class="role-badge role-badge-membre" style="background: transparent; border: 1px solid var(--court-green); color: var(--court-green);">
						{team.members.length} {team.category === "DAMES" ? "joueuses" : "joueurs"}
					</span>
					{#if !team.isEngaged}
					<span class="role-badge" style="background: #FBEFE6; color: var(--clay);">Non engagée</span>
					{/if}
				</div>
				<span class="member-action-link">Modifier &rarr;</span>
			</div>
			{/each}
		</div>
	</div>
</section>

{#if selectedTeam}
<div class="modal-overlay">
	<div class="modal">
		<div class="modal-head">
			<h3>Modifier l'équipe</h3>
			<button type="button" class="modal-close" aria-label="Fermer" onclick={() => (selectedTeam = null)}>&times;</button>
		</div>

		<form method="POST" action=?/saveTeam use:enhance={() => {
            return async ({ result, update }) => {
                if (result.type === "success") {
                    selectedTeam = null;
                    showToast("Equipe modifiée");
                }
                else if (result.type === "failure") {
                    const data = result.data as { error?: string } | undefined;
                    const errorMessage = data?.error || "Erreur server";
                    showToast(errorMessage, "error");
                }
                update();
            }
        }}>
            <input type="hidden" name="teamId" value={selectedTeam.id} />
			<div class="form-group-cols">
				<div class="form-group">
					<label for="editTeamName">Nom de l'équipe</label>
					<input type="text" id="editTeamName" name="name" value={selectedTeam.name} required>
				</div>
				<div class="form-group">
					<label for="editTeamCategory">Catégorie</label>
					<select id="editTeamCategory" name="category" value={selectedTeam.category}>
						<option value="HOMMES">Hommes</option>
						<option value="DAMES">Dames</option>
						<option value="MIXTE">Mixte</option>
						<option value="JEUNES">Jeunes</option>
					</select>
				</div>
			</div>

			<div class="form-group-cols">
				<div class="form-group">
					<label for="editTeamDivision">Division</label>
					<input type="text" id="editTeamDivision" name="division" value={selectedTeam.division}>
				</div>
				<div class="form-group">
					<label for="editTeamMatchDay">Jour des rencontres</label>
					<select id="editTeamMatchDay" name="matchDay" value={selectedTeam.matchDay}>
						<option>Samedi</option>
						<option>Dimanche</option>
					</select>
				</div>
			</div>

            <div class="form-group">
                <label for="editTeamCaptainSearch">Capitaine</label>
                <input type="hidden" name="captainId" value={captain?.id ?? ""} />
                {#if captain}
                <div class="selected-captain-card">
                    <div class="picker-person-info">
                        <strong>{captain.lastName.toUpperCase()} {captain.firstName}</strong>
                        <span>{captain.licence ?? "Pas de licence"}</span>
                    </div>
                    <button type="button" class="chip-remove" aria-label="Retirer le capitaine">&times;</button>
                </div>
                {/if}

                <div class="member-picker">
                    <input type="search" id="editTeamCaptainSearch" bind:value={captainSearch} class="picker-search-input" placeholder="Rechercher un licencié par nom ou e-mail..." />
                    {#if captainSearch.length > 0}
                    <div class="picker-results">
                        {#each filteredCaptains as user (user.id)}
                            <div class="picker-result-item">
                                <div class="picker-person-info">
                                    <strong>{user.firstName} {user.lastName.toUpperCase()}</strong>
                                    <span>{user.email} · {user.team ? user.team.name : "Sans équipe"}</span>
                                </div>
                                <button type="button" class="btn-picker-action" onclick={() => selectCaptain(user)}>
                                    Affecter
                                </button>
                            </div>
                        {:else}
                            <div class="picker-result-item">
                                <span style="font-size: 13px; color: var(--ink-soft);">Aucun licencié trouvé</span>
                            </div>
                        {/each}
                    </div>
                    {/if}
                </div>
            </div>

			<div class="form-group">
                <label for="editTeamPlayersSearch">
                    Effectif de l'équipe ({players.length})
                </label>
                <input type="hidden" name="playerIds" value={JSON.stringify(players.map(p => p.id))} />
                <div class="selected-players-list">
                    {#each players as player}
                        <span class="player-chip">
                            {player.lastName.toUpperCase()} {player.firstName}
                            <button type="button" class="chip-remove" aria-label="Retirer {player}" onclick={() => removePlayer(player.id)}>&times;</button>
                        </span>
                    {/each}
                </div>

                <div class="member-picker">
                    <input
                        type="search"
                        id="editTeamPlayersSearch"
                        class="picker-search-input"
                        bind:value={playersSearch}
                        placeholder="Rechercher un licencié à ajouter..."
                    />
                    {#if playersSearch.length > 0}
                    <div class="picker-results">
                        {#each filteredPlayers as user (user.id)}
                            <div class="picker-result-item">
                                <div class="picker-person-info">
                                    <strong>{user.firstName} {user.lastName.toUpperCase()}</strong>
                                    <span>{user.email} · {user.team ? user.team.name : "Sans équipe"}</span>
                                </div>
                                <button type="button" class="btn-picker-action btn-picker-add" onclick={() => addPlayer(user)}>
                                    + Ajouter
                                </button>
                            </div>
                        {:else}
                            <div class="picker-result-item">
                                <span style="font-size: 13px; color: var(--ink-soft);">Aucun licencié trouvé</span>
                            </div>
                        {/each}
                    </div>
                    {/if}
                </div>
            </div>

			<div class="form-group">
				<div style="display: flex; align-items: center; gap: 8px;">
					<input type="checkbox" id="editTeamActive" name="isEngaged" checked={selectedTeam.isEngaged} style="width: 16px; height: 16px; accent-color: var(--clay);">
					<label for="editTeamActive" style="margin: 0; font-size: 14px;">Engagée en championnat</label>
				</div>
			</div>

			<div class="modal-actions modal-actions-split" style="margin-top: 24px; justify-content: space-between;">
				<div class="modal-actions-main">
					<button type="submit" class="btn-primary">Enregistrer</button>
				</div>
				<button type="button" class="btn-danger-link" onclick={() => (showDeleteConfirm = true)}>Supprimer l'équipe</button>
			</div>
		</form>
	</div>
</div>

	{#if showDeleteConfirm}
	<div
		class="modal-overlay modal-overlay-confirm"
		role="button"
		tabindex="-1"
		onclick={(event) => { if (event.target === event.currentTarget) showDeleteConfirm = false; }}
		onkeydown={(event) => { if (event.key === "Escape") showDeleteConfirm = false; }}
	>
		<div class="modal modal-confirm">
			<div class="modal-head">
				<h3>Confirmer la suppression</h3>
				<button type="button" class="modal-close" aria-label="Fermer" onclick={() => (showDeleteConfirm = false)}>
					&times;
				</button>
			</div>

			<p class="confirm-text">
				Êtes-vous sûr de vouloir supprimer définitivement l'équipe
				<strong>{selectedTeam.name}</strong> ?
			</p>
			<p class="confirm-warning">
				Cette action est irréversible : l'équipe sera retirée du championnat et la composition perdue.
			</p>

			<form onsubmit={event => { event.preventDefault(); showDeleteConfirm = false; selectedTeam = null; }}>
				<div class="confirm-actions">
					<button type="button" class="btn-outline" onclick={() => (showDeleteConfirm = false)}>
						Annuler
					</button>
					<button type="submit" class="btn-danger-solid">
						Oui, supprimer définitivement
					</button>
				</div>
			</form>
		</div>
	</div>
	{/if}
{/if}

<style>
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(26, 36, 30, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        z-index: 1000;
        overflow-y: auto;
        overscroll-behavior: contain; /* Empêche la propagation du scroll à la page */
    }

    .modal {
        width: 100%;
        max-width: 580px;
        max-height: calc(100dvh - 40px); /* Garde 20px de marge en haut et en bas */
        overflow-y: auto;
        overscroll-behavior: contain;
        background: var(--chalk, #F6F4EC);
        border-radius: 16px;
        padding: 24px;
    }
	.members-directory {
		border: 1px solid #DAD2B8;
		background: var(--chalk);
		display: flex;
		flex-direction: column;
	}

	.member-list-item {
		display: grid;
		grid-template-columns: 1fr auto auto;
		align-items: center;
		gap: 20px;
		padding: 16px 20px;
		border-bottom: 1px solid #DAD2B8;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.member-list-item:last-child { border-bottom: none; }
	.member-list-item:hover, .member-list-item:focus { background: #FBEFE6; outline: none; }

	.member-info { display: flex; flex-direction: column; }
	.member-name { font-size: 15px; font-weight: 600; color: var(--ink); }
	.member-email { font-size: 13px; color: var(--ink-soft); }

	.member-badges { display: flex; gap: 8px; align-items: center; }

	.member-action-link {
		font-size: 12px; font-weight: 600; color: var(--clay);
		text-transform: uppercase; letter-spacing: 0.05em;
		opacity: 0; transition: opacity 0.2s ease;
	}

	/* Survol : on fait apparaître le bouton "Modifier ->" */
	.member-list-item:hover .member-action-link,
	.member-list-item:focus .member-action-link { opacity: 1; }

	.btn-danger-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 10px 18px;
		border-radius: 999px;
		border: 1.5px solid #b83227;
		background-color: #fdf2f1;
		color: #b83227;
		font-family: inherit;
		font-size: 13.5px;
		font-weight: 600;
		letter-spacing: 0.02em;
		text-decoration: none;
		cursor: pointer;
		transition: background-color 0.18s ease, color 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease;
	}

	.btn-danger-link:hover {
		background-color: #b83227;
		color: #ffffff;
		box-shadow: 0 6px 16px -4px rgba(184, 50, 39, 0.35);
	}

	.btn-danger-link:active {
		transform: translateY(1px);
	}

	/* Modale de confirmation au premier plan */
	.modal-overlay-confirm {
		z-index: 1100;
		background: rgba(26, 36, 30, 0.72);
	}

	.modal-confirm {
		max-width: 440px;
	}

	.confirm-text {
		font-size: 15px;
		line-height: 1.5;
		color: var(--ink, #1A241E);
		margin: 8px 0 10px;
	}

	.confirm-warning {
		font-size: 13px;
		line-height: 1.45;
		color: #b83227;
		background: #fdf2f1;
		border-left: 3px solid #b83227;
		padding: 10px 12px;
		border-radius: 6px;
		margin-bottom: 22px;
	}

	.confirm-actions {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 12px;
	}

	.btn-danger-solid {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 10px 18px;
		border-radius: 999px;
		border: 1.5px solid #b83227;
		background-color: #b83227;
		color: #ffffff;
		font-family: inherit;
		font-size: 13.5px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease;
	}

	.btn-danger-solid:hover {
		background-color: #96251c;
		border-color: #96251c;
		box-shadow: 0 6px 16px -4px rgba(184, 50, 39, 0.4);
	}

	.btn-danger-solid:active {
		transform: translateY(1px);
	}

    /* Carte du capitaine sélectionné */
    .selected-captain-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 14px;
        margin-bottom: 10px;
        background: #FBEFE6;
        border: 1px solid var(--clay, #C85A32);
        border-radius: 10px;
    }

    /* Liste de chips pour les joueurs sélectionnés */
    .selected-players-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 10px;
        margin-bottom: 10px;
        background: var(--chalk, #F6F4EC);
        border: 1px solid #DAD2B8;
        border-radius: 10px;
        min-height: 44px;
    }

    .player-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px 5px 12px;
        background: #ffffff;
        border: 1px solid #DAD2B8;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 500;
        color: var(--ink, #1A241E);
    }

    .chip-remove {
        background: none;
        border: none;
        padding: 0 2px;
        font-size: 16px;
        line-height: 1;
        color: var(--ink-soft, #5C6860);
        cursor: pointer;
        transition: color 0.15s ease;
    }

    .chip-remove:hover {
        color: #b83227;
    }

    /* Conteneur de recherche BDD */
    .member-picker {
        border: 1px solid #DAD2B8;
        border-radius: 10px;
        background: #ffffff;
        overflow: hidden;
    }

    .picker-search-input {
        width: 100%;
        border: none !important;
        border-bottom: 1px solid #DAD2B8 !important;
        border-radius: 0 !important;
        padding: 10px 14px;
        font-size: 13.5px;
        background: #ffffff;
        margin: 0 !important;
    }

    .picker-search-input:focus {
        outline: none;
        background: #fcfbf7;
    }

    /* Liste déroulante des résultats */
    .picker-results {
        max-height: 165px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }

    .picker-result-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 9px 14px;
        border-bottom: 1px solid rgba(218, 210, 184, 0.5);
        transition: background 0.15s ease;
    }

    .picker-result-item:last-child {
        border-bottom: none;
    }

    .picker-result-item:hover {
        background: var(--chalk, #F6F4EC);
    }

    .picker-person-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .picker-person-info strong {
        font-size: 13.5px;
        font-weight: 600;
        color: var(--ink, #1A241E);
    }

    .picker-person-info span {
        font-size: 12px;
        color: var(--ink-soft, #5C6860);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* Boutons d'action dans les résultats ("Affecter" / "+ Ajouter") */
    .btn-picker-action {
        flex-shrink: 0;
        padding: 5px 12px;
        border-radius: 999px;
        border: 1px solid var(--clay, #C85A32);
        background: transparent;
        color: var(--clay, #C85A32);
        font-family: inherit;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease;
    }

    .btn-picker-action:hover {
        background: var(--clay, #C85A32);
        color: #ffffff;
    }

    .btn-picker-add {
        border-color: var(--court-green, #1E4632);
        color: var(--court-green, #1E4632);
    }

    .btn-picker-add:hover {
        background: var(--court-green, #1E4632);
        color: #ffffff;
    }

	/* Responsive Mobile (max-width: 480px) */
	@media (max-width: 480px) {
		.member-list-item {
			grid-template-columns: 1fr;
			gap: 12px;
			padding: 18px 16px;
		}
		.member-action-link { opacity: 1; display: inline-block; margin-top: 4px; }

		.confirm-actions {
			flex-direction: column-reverse;
			align-items: stretch;
		}
	}
</style>