<script lang="ts">
	import { enhance } from "$app/forms";
    import type { PageProps } from "./$types";
    import { showToast } from "#lib/utils.ts";

    let { data, form }: PageProps = $props();

    let showAddUserForm = $state(false);
    let newRoleValue = $state("MEMBRE");
    let newSexValue = $state(true);
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
			<button type="button" class="btn-primary" onclick={() => showAddUserForm = true}>+ Ajouter un membre</button>
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

		<div class="members-directory" id="members-list">
            
            <!-- Exemple Brut 1 : Admin (Président) -->
            <div class="member-list-item">
                <div class="member-info">
                    <strong class="member-name">Alice Dupont</strong>
                    <span class="member-email">alice.dupont@email.com</span>
                </div>
                <div class="member-badges">
                    <span class="role-badge role-badge-admin">Admin</span>
                    <span class="role-badge role-badge-admin" style="background: transparent; border: 1px solid var(--clay); color: var(--clay);">Président</span>
                </div>
                <span class="member-action-link">Modifier &rarr;</span>
            </div>

            <!-- Exemple Brut 2 : Admin (Coach) avec équipe -->
            <div class="member-list-item">
                <div class="member-info">
                    <strong class="member-name">Thomas Bernard</strong>
                    <span class="member-email">thomas.b@email.com</span>
                </div>
                <div class="member-badges">
                    <span class="role-badge role-badge-admin">Admin</span>
                    <span class="role-badge role-badge-admin" style="background: transparent; border: 1px solid var(--clay); color: var(--clay);">Coach</span>
                    <span class="role-badge role-badge-membre" style="background: transparent; border: 1px solid var(--court-green); color: var(--court-green);">Équipe 1 (H)</span>
                </div>
                <span class="member-action-link">Modifier &rarr;</span>
            </div>

            <!-- Exemple Brut 3 : Licencié classique (Non à jour de cotisation) -->
            <div class="member-list-item">
                <div class="member-info">
                    <strong class="member-name">Marc Leroy</strong>
                    <span class="member-email">marc.leroy@email.com</span>
                </div>
                <div class="member-badges">
                    <span class="role-badge role-badge-membre">Licencié</span>
                    <!-- Badge optionnel pour alerter sur la cotisation -->
                    <span class="role-badge" style="background: #FBEFE6; color: var(--clay);">Cotisation impayée</span>
                </div>
                <span class="member-action-link">Modifier &rarr;</span>
            </div>

            <!-- Exemple Brut 4 : Visiteur -->
            <div class="member-list-item">
                <div class="member-info">
                    <strong class="member-name">Sophie Martin</strong>
                    <span class="member-email">sophie.m@email.com</span>
                </div>
                <div class="member-badges">
                    <span class="role-badge role-badge-visiteur">Visiteur</span>
                </div>
                <span class="member-action-link">Modifier &rarr;</span>
            </div>

        </div>
	</div>
</section>

<!-- MODALE D'ÉDITION (Totalement invisible par défaut) -->
<div class="modal-overlay" id="edit-member-modal" hidden>
	<div class="modal">
		<div class="modal-head">
			<h3 id="edit-modal-name">Modifier le profil</h3>
			<button type="button" class="modal-close" id="close-edit-modal">&times;</button>
		</div>
		
		<form id="edit-member-form">
			<!-- Ligne 1 : Identité -->
			<div class="form-group-cols">
				<div class="form-group">
					<label for="edit-prenom">Prénom</label>
					<input type="text" id="edit-prenom" required>
				</div>
				<div class="form-group">
					<label for="edit-nom">Nom</label>
					<input type="text" id="edit-nom" required>
				</div>
			</div>

			<!-- Ligne 2 : Rôle et Précision -->
			<div class="form-group-cols">
				<div class="form-group">
					<label for="edit-role">Rôle</label>
					<select id="edit-role" class="role-select">
						<option value="VISITER">Visiteur</option>
						<option value="MEMBER">Licencié</option>
						<option value="ADMIN">Administrateur</option>
					</select>
				</div>
				<!-- Précision (masquée si non-admin) -->
				<div class="form-group">
					<label for="edit-precision" style="color: transparent;">Titre</label>
					<select id="edit-precision" class="role-precision" style="display: none;">
						<option value="PRESIDENT">Président</option>
						<option value="SECRETAIRE">Secrétaire</option>
						<option value="TRESORIER">Trésorier</option>
						<option value="COACH">Coach</option>
					</select>
				</div>
			</div>

			<!-- Ligne 3 : Contact et Équipe -->
			<div class="form-group-cols">
				<div class="form-group">
					<label for="edit-telephone">Numéro de tél.</label>
					<input type="tel" id="edit-telephone" placeholder="06 00 00 00 00">
				</div>
				<div class="form-group">
					<label for="edit-equipe">Équipe</label>
					<select id="edit-equipe">
						<option value="">Aucune</option>
						<option value="1">Équipe 1 (F)</option>
						<option value="2">Équipe 1 (H)</option>
					</select>
				</div>
			</div>

			<!-- Ligne 4 : Licence FFT -->
			<div class="form-group">
				<label for="edit-licence">N° de licence FFT</label>
				<input type="text" id="edit-licence">
			</div>

			<!-- Ligne 5 : Statut cotisation -->
			<div class="form-group">
				<div class="checkbox-field" style="display: flex; align-items: center; gap: 8px;">
					<input type="checkbox" id="edit-cotisation" style="width: 16px; height: 16px; accent-color: var(--clay);">
					<label for="edit-cotisation" style="margin: 0; font-size: 14px;">Cotisation à jour</label>
				</div>
			</div>

			<!-- Actions -->
			<div class="modal-actions modal-actions-split" style="margin-top: 24px;">
				<div class="modal-actions-main">
					<button type="submit" class="btn-primary">Enregistrer</button>
				</div>
				<button type="button" class="btn-danger-link" id="delete-member-btn">Supprimer le compte</button>
			</div>
		</form>
	</div>
</div>

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

    /* Responsive Mobile (max-width: 480px) */
    @media (max-width: 480px) {
        .member-list-item { 
            grid-template-columns: 1fr; 
            gap: 12px; 
            padding: 18px 16px;
        }
        .member-action-link { opacity: 1; display: inline-block; margin-top: 4px; }
    }
</style>