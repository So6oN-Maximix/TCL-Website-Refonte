<script lang="ts">
	import { enhance } from "$app/forms";
    import type { PageProps } from "./$types";
    import { showToast, formatPhoneUX } from "#lib/utils.ts";
    import { NOT_ADMIN } from "#lib/constants.ts";

    let { data, form }: PageProps = $props();
    console.log(data.users);

    let showAddUserForm = $state(false);
	let showDeleteConfirm = $state(false)
    let newRoleValue = $state("MEMBRE");
    let editRoleValue = $state("MEMBRE");
    let newSexValue = $state(true);

	type Member = NonNullable<typeof data.users>[number];
	let selectedUser = $state<Member | null>(null);

	function openEditModal(user: Member) {
		selectedUser = { ...user };
		editRoleValue = ["MEMBRE", "VISITEUR"].includes(user.role) ? user.role : "ADMIN";
	}
</script>

<svelte:head>
    <title>Administration Membres - TCL</title>
</svelte:head>

<section class="page-hero">
	<svg class="court-lines" viewBox="0 0 1100 260" preserveAspectRatio="xMidYMid slice">
		<rect x="750" y="10" width="320" height="240" fill="none" stroke="#F6F4EC" stroke-width="2"/>
		<line x1="750" y1="130" x2="1070" y2="130" stroke="#F6F4EC" stroke-width="2"/>
	</svg>
	<div class="wrap">
		<span class="eyebrow">Administration</span>
		<h1>Gestion des membres</h1>
		<p>Cotisation, licence, équipe et rôle de chaque utilisateur — modifiable directement ici.</p>
	</div>
</section>

<section id="admin-guard-message" hidden>
	<div class="wrap">
		<p class="auth-error" style="display:block;">Accès réservé aux administrateurs. Redirection…</p>
	</div>
</section>

<section id="admin-content">
	<div class="wrap">
		<div class="filter-group" style="align-items: flex-end;">
			<div style="flex: 1; max-width: 420px;">
				<label for="search-input" class="reservations-label" style="margin-top: 0; display: block;">Rechercher</label>
				<input type="text" id="search-input" placeholder="Nom, e-mail..." class="search-input" style="margin-bottom: 0; max-width: 100%;">
			</div>
			<button type="button" class="btn-primary" onclick={() => showAddUserForm = !showAddUserForm}>+ Ajouter un membre</button>
		</div>

        {#if showAddUserForm}
		<form method="POST" action="?/addUser" class="member-create-form" style="margin-top: -8px; position: relative;" use:enhance={() => {
            return async ({ result, update }) => {
                if (result.type === "success") {
                    showAddUserForm = false;
                    showToast("Utilisateur ajouté");
                }
                else if (result.type === "failure") {
                    const data = result.data as { error?: string } | undefined;
                    const errorMessage = data?.error || "Erreur server";
                    showToast(errorMessage, "error");
                }
                update();
            };
        }}>
			<button type="button" class="modal-close" aria-label="Fermer" onclick={() => showAddUserForm = false} style="position: absolute; top: 16px; right: 20px;">&times;</button>
			<h3 style="grid-column: 1 / -1; font-size: 16px; margin-bottom: 8px;">Nouveau licencié</h3>
            <div class="form-group">
				<label for="newFirstName">Prénom</label>
				<input type="text" id="newFirstName" name="firstName" required>
			</div>
			<div class="form-group">
				<label for="newLastName">Nom</label>
				<input type="text" id="newLastName" name="lastName" required>
			</div>
			<div class="form-group">
				<label for="newEmail">E-mail</label>
				<input type="email" id="newEmail" name="email" required>
			</div>
			<div class="form-group">
				<label for="newPassword">Mot de passe temporaire</label>
				<input type="text" id="newPassword" name="password" required>
			</div>
			<div class="form-group">
				<label for="newSexe">Sexe</label>
				<select id="newSexe" bind:value={newSexValue} name="sexe">
					<option value={true}>Homme</option>
					<option value={false}>Femme</option>
				</select>
			</div>
			<div class="form-group">
				<label for="newRole">Rôle</label>
				<select id="newRole" bind:value={newRoleValue} name="role">
					<option value="VISITER">Visiteu{!newSexValue ? "se" : "r"}</option>
					<option value="MEMBRE" selected>Licencié{!newSexValue ? "e" : ""}</option>
					<option value="ADMIN">Administrat{!newSexValue ? "rice" : "eur"}</option>
				</select>
			</div>
            {#if newRoleValue === "ADMIN"}
			<div class="form-group">
				<select name="roleDesc">
                    <option value="DEVELOPPEUR" selected>Développeur</option>
                    <option value={`PRESIDENT${!newSexValue ? "E" : ""}`}>Président{!newSexValue ? "e" : ""}</option>
                    <option value={`VICE_PRESIDENT${!newSexValue ? "E" : ""}`}>Vice-Président{!newSexValue ? "e" : ""}</option>
                    <option value={`TRESORIER${!newSexValue ? "E" : ""}`}>Trésorier{!newSexValue ? "e" : ""}</option>
                    <option value="SECRETAIRE">Secrétaire</option>
                    <option value="COACH">Coach</option>
                </select>
			</div>
            {/if}
			<div class="form-group">
				<label for="newLicence">N° de licence FFT</label>
				<input type="text" id="newLicence" name="licence" placeholder="Facultatif">
			</div>
			<div class="form-group">
				<label for="new-cotisation">Cotisation</label>
				<div style="display:flex; align-items:center; gap:6px; height:42px;">
					<input type="checkbox" id="newCotisation" name="cotisation" style="margin:0; width:auto; flex-shrink:0;">
					<label for="newCotisation" style="display:inline; margin:0; padding:0; font-weight:400; text-transform:none; letter-spacing:normal; color:var(--ink); font-size:14px; white-space:nowrap;">À jour</label>
				</div>
			</div>
			<div class="form-group form-group-submit">
				<button type="submit" class="btn-primary">Créer le compte</button>
				<button type="button" class="btn-outline" onclick={() => showAddUserForm = false}>Annuler</button>
                {#if form?.error}
				<span class="save-status">{form.error}</span>
                {/if}
			</div>
		</form>
        {/if}

		<div class="members-directory">
            {#each data.users as user}
			{@const formattedRole = NOT_ADMIN.includes(user.role) ? user.role : "Admin"}
            <div class="member-list-item" role="button" tabindex="0" onclick={() => openEditModal(user)} onkeydown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					openEditModal(user);
				}
			}}>
                <div class="member-info">
                    <strong class="member-name">{user.lastName.toUpperCase()} {user.firstName}</strong>
                    <span class="member-email">{user.email}</span>
                </div>
                <div class="member-badges">
                    <span class={`role-badge role-badge-${formattedRole.toLowerCase()}`}>{formattedRole}</span>
                    {#if !NOT_ADMIN.includes(user.role)}
                    <span class="role-badge role-badge-admin" style="background: transparent; border: 1px solid var(--clay); color: var(--clay);">{user.role}</span>
                    {/if}
					{#if !user.cotisationPayed}
                    <span class="role-badge" style="background: #FBEFE6; color: var(--clay);">Cotisation impayée</span>
					{/if}
                    <span class="role-badge role-badge-membre" style="background: transparent; border: 1px solid var(--court-green); color: var(--court-green);">Équipe 1 (H)</span>
                </div>
				<span class="member-action-link">Modifier &rarr;</span>
            </div>
            {/each}
        </div>
	</div>
</section>

{#if selectedUser}
<div class="modal-overlay">
	<div class="modal">
		<div class="modal-head">
			<h3 id="edit-modal-name">Modifier le profil</h3>
			<button type="button" class="modal-close" onclick={() => selectedUser = null}>&times;</button>
		</div>
		
		<form method="POST" action="?/saveUser" use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === "success") {
					selectedUser = null;
					showToast("Informations enregistrées");
				}
                else if (result.type === "failure") {
                    const data = result.data as { error?: string } | undefined;
                    const errorMessage = data?.error || "Erreur server";
                    showToast(errorMessage, "error");
                }
				update();
			}
		}}>
			<input name="userId" hidden value={selectedUser.id}>
			<div class="form-group-cols">
				<div class="form-group">
					<label for="editFirstName">Prénom</label>
					<input type="text" id="editFirstName" name="firstName" value={selectedUser.firstName} required>
				</div>
				<div class="form-group">
					<label for="editLastName">Nom</label>
					<input type="text" id="editLastName" name="lastName" value={selectedUser.lastName} required>
				</div>
			</div>
			
			<div class="form-group">
				<label for="editEmail">Email</label>
				<input type="text" id="editEmail" name="email" value={selectedUser.email}>
			</div>

			<div class="form-group-cols">
				<div class="form-group">
					<label for="editRole">Rôle</label>
					<select id="editRole" class="role-select" name="role" bind:value={editRoleValue}>
						<option value="VISITEUR">Visiteu{!selectedUser.sexe ? "se" : "r"}</option>
						<option value="MEMBRE">Licencié{!selectedUser.sexe ? "e" : ""}</option>
						<option value="ADMIN">Administrat{!selectedUser.sexe ? "rice" : "eur"}</option>
					</select>
				</div>
				{#if editRoleValue === "ADMIN"}
				<div class="form-group">
					<label for="editPrecision" style="color: transparent;">Titre</label>
					<select id="editPrecision" class="role-precision" name="roleDesc" value={selectedUser.role}>
						<option value="DEVELOPPEUR">Développeur</option>
						<option value={`PRESIDENT${!selectedUser.sexe ? "e" : ""}`}>Président{!selectedUser.sexe ? "e" : ""}</option>
						<option value={`VICE-PRESIDENT${!selectedUser.sexe ? "e" : ""}`}>Vice-Président{!selectedUser.sexe ? "e" : ""}</option>
						<option value={`TRESORIER${!selectedUser.sexe ? "e" : ""}`}>Trésorier{!selectedUser.sexe ? "e" : ""}</option>
						<option value="SECRETAIRE">Secrétaire</option>
						<option value="COACH">Coach</option>
					</select>
				</div>
				{/if}
			</div>

			<div class="form-group-cols">
				<div class="form-group">
					<label for="editPhone">Numéro de tél.</label>
					<input type="tel" id="editPhone" name="phone" placeholder="06 00 00 00 00" value={formatPhoneUX(selectedUser.phone)}>
				</div>
				<div class="form-group">
					<label for="editTeam">Équipe</label>
					<select id="editTeam" name="team">
						<option value="">Aucune</option>
						<option value="1">Équipe 1 (F)</option>
						<option value="2">Équipe 1 (H)</option>
					</select>
				</div>
			</div>

			<div class="form-group">
				<label for="editLicence">N° de licence FFT</label>
				<input type="text" id="editLicence" name="licence" value={selectedUser.licence}>
			</div>

			<div class="form-group">
				<div class="checkbox-field" style="display: flex; align-items: center; gap: 8px;">
					<input type="checkbox" id="editCotisation" name="cotisation" checked={selectedUser.cotisationPayed} style="width: 16px; height: 16px; accent-color: var(--clay);">
					<label for="editCotisation" style="margin: 0; font-size: 14px;">Cotisation à jour</label>
				</div>
			</div>

			<div class="modal-actions modal-actions-split" style="margin-top: 24px;">
				<div class="modal-actions-main">
					<button type="submit" class="btn-primary">Enregistrer</button>
				</div>
				<button type="button" class="btn-danger-link" onclick={() => showDeleteConfirm = true}>Supprimer le compte</button>
			</div>
		</form>
	</div>
</div>

	{#if showDeleteConfirm}
	<div
		class="modal-overlay modal-overlay-confirm"
		role="button"
		tabindex="-1"
		onclick={event => { if (event.target === event.currentTarget) showDeleteConfirm = false; }}
		onkeydown={event => { if (event.key === "Escape") showDeleteConfirm = false; }}
	>
		<div class="modal modal-confirm">
			<div class="modal-head">
				<h3>Confirmer la suppression</h3>
				<button type="button" class="modal-close" onclick={() => (showDeleteConfirm = false)}>
					&times;
				</button>
			</div>

			<p class="confirm-text">
				Êtes-vous sûr de vouloir supprimer définitivement le compte de
				<strong>{selectedUser.firstName} {selectedUser.lastName.toUpperCase()}</strong> ?
			</p>
			<p class="confirm-warning">
				Cette action est irréversible et supprimera également ses réservations associées.
			</p>

			<form method="POST" action="?/deleteUser" use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === "success") {
						showDeleteConfirm = false;
						selectedUser = null;
						showToast("Compte supprimé");
					} else if (result.type === "failure") {
						const data = result.data as { error?: string } | undefined;
						const errorMessage = data?.error || "Erreur server";
						showToast(errorMessage, "error");
					}
					update();
				};
			}}>
				<input type="hidden" name="userId" value={selectedUser.id} />

				<div class="confirm-actions">
					<button
						type="button"
						class="btn-outline"
						onclick={() => (showDeleteConfirm = false)}
					>
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