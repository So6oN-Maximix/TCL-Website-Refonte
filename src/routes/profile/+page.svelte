<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<section class="page-hero">
	<svg class="court-lines" viewBox="0 0 1100 260" preserveAspectRatio="xMidYMid slice">
		<rect x="750" y="10" width="320" height="240" fill="none" stroke="#F6F4EC" stroke-width="2"/>
		<line x1="750" y1="130" x2="1070" y2="130" stroke="#F6F4EC" stroke-width="2"/>
	</svg>
	<div class="wrap profile-hero-content">
		<div>
			<span class="eyebrow">Espace membres</span>
			<h1>Mon profil</h1>
			<p>Vos informations, votre licence et l'historique de vos réservations.</p>
		</div>
		<button type="button" class="btn-logout" id="logout-btn">Se déconnecter</button>
	</div>
</section>

<section class="profile-top">
	<div class="wrap">
		<div class="profile-header">
			<div class="avatar" id="profile-avatar">{(data.user.firstName[0] + data.user.lastName[0]).toUpperCase()}</div>
			<div>
				<div class="profile-name-row">
					<span class="profile-name" id="profile-name">{data.user.firstName} {data.user.lastName.toUpperCase()}</span>
					<span class="role-badge" id="role-badge">Licencié</span>
				</div>
				<div class="profile-meta" id="profile-meta">Licencié depuis 2021 · Membre actif</div>
			</div>
			<a href="/reservation" class="btn-primary profile-cta" data-role-visible="MEMBER,ADMIN">Réserver un créneau</a>
		</div>

		<!-- Visible pour les licenciés (membres et admins) -->
		<div class="profile-stats" data-role-visible="MEMBER,ADMIN">
			<div class="profile-stat">
				<div class="num">14</div>
				<div class="label">Réservations cette saison</div>
			</div>
			<div class="profile-stat">
				<div class="num">3</div>
				<div class="label">Créneaux à venir</div>
			</div>
			<div class="profile-stat">
				<div class="num">5</div>
				<div class="label">Années de licence</div>
			</div>
			<div class="profile-stat profile-stat-status">
				<div class="num">À jour</div>
				<div class="label">Cotisation 2025–2026</div>
			</div>
		</div>

		<!-- Visible uniquement pour les visiteurs (pas encore licenciés) -->
		<div class="visitor-banner" data-role-visible="VISITER" hidden>
			<div>
				<h3>Vous n'êtes pas encore licencié·e</h3>
				<p>Créez votre dossier de licence pour accéder aux réservations de courts, aux tarifs adhérents et à la vie du club.</p>
			</div>
			<a href="/" class="btn-primary">Devenir membre licencié</a>
		</div>
	</div>
</section>

<section id="informations">
	<div class="wrap">
		<div class="profile-grid">
			<div id="personal-info">
				<div class="block-head">
					<h3>Informations</h3>
					<button type="button" class="btn-outline btn-small">Modifier</button>
				</div>
				<div class="info-list">
					<div class="info-row"><span class="k">Prénom</span><span class="v">...</span></div>
					<div class="info-row"><span class="k">Nom</span><span class="v">...</span></div>
					<div class="info-row"><span class="k">E-mail</span><span class="v">...</span></div>
					<div class="info-row"><span class="k">Téléphone</span><span class="v">...</span></div>
					<div class="info-row" data-role-visible="MEMBER,ADMIN"><span class="k">N° de licence FFT</span><span class="v">...</span></div>
					<div class="info-row" data-role-visible="MEMBER,ADMIN"><span class="k">Cotisation 2025-2026</span><span class="v">...</span></div>
					<div class="info-row" data-role-visible="VISITER" hidden><span class="k">Statut</span><span class="v badge-pending">Compte visiteur</span></div>
				</div>
			</div>

			<div data-role-visible="MEMBER,ADMIN">
				<div class="block-head">
					<h3>Mes réservations</h3>
					<span class="block-count">3 à venir</span>
				</div>

				<div class="reservations-group">
					<div class="reservations-label">À venir</div>
					<div class="info-list"></div>

					<div class="reservations-label">Passées</div>
					<div class="info-list"></div>
				</div>
			</div>

			<!-- Modale de confirmation d'annulation -->
			<div class="modal-overlay" id="cancel-booking-modal-overlay" hidden>
				<div class="modal" role="dialog" aria-modal="true" aria-labelledby="cancel-booking-modal-title">
					<div class="modal-head">
						<h3 id="cancel-booking-modal-title">Annuler la réservation</h3>
						<button type="button" class="modal-close" id="cancel-booking-modal-close" aria-label="Fermer">&times;</button>
					</div>

					<div class="modal-body">
						<p class="modal-slot-label" id="cancel-booking-summary">Court 1 (extérieur) · Lun 21 juillet · <strong>15h – 16h</strong></p>
						<p class="modal-note">Cette action est définitive. Le créneau redeviendra disponible pour les autres membres.</p>
						<p class="modal-status" id="cancel-booking-status" hidden></p>
					</div>

					<div class="modal-actions">
						<button type="button" class="btn-primary" id="confirm-cancel-booking-btn">Oui, annuler la réservation</button>
						<button type="button" class="btn-outline btn-small" id="cancel-booking-modal-dismiss">Retour</button>
					</div>
				</div>
			</div>

			<!-- Modale d'édition des informations du compte -->
			<div class="modal-overlay" id="edit-profile-modal-overlay" hidden>
				<div class="modal" role="dialog" aria-modal="true" aria-labelledby="edit-profile-modal-title">
					<div class="modal-head">
						<h3 id="edit-profile-modal-title">Modifier mes informations</h3>
						<button type="button" class="modal-close" id="edit-profile-modal-close" aria-label="Fermer">&times;</button>
					</div>

					<form id="edit-profile-form">
						<div class="form-group">
							<label for="edit-prenom">Prénom</label>
							<input type="text" id="edit-prenom" name="prenom" required>
						</div>
						<div class="form-group">
							<label for="edit-nom">Nom</label>
							<input type="text" id="edit-nom" name="nom" required>
						</div>
						<div class="form-group">
							<label for="edit-email">E-mail</label>
							<input type="email" id="edit-email" name="email" required>
						</div>
						<div class="form-group">
							<label for="edit-phone">Téléphone</label>
							<input type="tel" id="edit-phone" name="phone" required>
						</div>

						<p class="modal-note">Le numéro de licence FFT, le rôle et le statut de cotisation ne sont modifiables que par le bureau du club.</p>
						<p class="modal-status" id="edit-profile-status" hidden></p>

						<div class="modal-actions">
							<button type="submit" class="btn-primary" id="save-profile-btn">Enregistrer</button>
							<button type="button" class="btn-outline btn-small" id="edit-profile-modal-cancel">Annuler</button>
						</div>
					</form>
				</div>
			</div>

			<!-- Visible uniquement pour les visiteurs -->
			<div data-role-visible="VISITER" hidden>
				<div class="block-head">
					<h3>Réservations</h3>
				</div>
				<div class="visitor-note">
					<p>La réservation de courts est réservée aux membres licenciés du club. Une fois votre dossier de licence validé, vous retrouverez ici vos créneaux.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="section-tinted" data-role-visible="ADMIN" hidden id="administration">
	<div class="wrap">
		<div class="block-head">
			<h3>Administration du club</h3>
			<span class="role-badge role-badge-admin">Administrateur</span>
		</div>

		<div class="admin-quick-links">
			<a href="/members" class="admin-quick-link">
				<strong>Membres</strong>
				<span>Rôles, cotisations, licences</span>
			</a>
			<a href="/equipes" class="admin-quick-link">
				<strong>Équipes</strong>
				<span>Composition, résultats</span>
			</a>
			<a href="/disponibilites" class="admin-quick-link">
				<strong>Indisponibilités</strong>
				<span>Bloquer des créneaux</span>
			</a>
		</div>

		<div class="profile-stats admin-stats">
			<div class="profile-stat">
				<div class="num">42</div>
				<div class="label">Licenciés actifs</div>
			</div>
			<div class="profile-stat">
				<div class="num">5</div>
				<div class="label">Visiteurs en attente</div>
			</div>
			<div class="profile-stat">
				<div class="num">9</div>
				<div class="label">Réservations aujourd'hui</div>
			</div>
			<div class="profile-stat">
				<div class="num">2</div>
				<div class="label">Admins</div>
			</div>
		</div>

		<div class="admin-table-wrap">
			<div class="admin-table-head">
				<span>Membre</span>
				<span>Statut</span>
				<span>Rôle</span>
				<span>Poste</span>
				<span>Actions</span>
			</div>
		</div>
	</div>
</section>

<section>
	<div class="wrap">
		<div class="block-head">
			<h3>Sécurité</h3>
		</div>
		<form class="security-form" id="password-form">
			<div class="form-group">
				<label for="current-password">Mot de passe actuel</label>
				<input type="password" id="current-password" placeholder="••••••••">
			</div>
			<div class="security-form-cols">
				<div class="form-group">
					<label for="new-password">Nouveau mot de passe</label>
					<input type="password" id="new-password" placeholder="••••••••">
				</div>
				<div class="form-group">
					<label for="confirm-new-password">Confirmer</label>
					<input type="password" id="confirm-new-password" placeholder="••••••••">
				</div>
			</div>
			<p class="auth-error" id="password-error" style="display: none;"></p>
			<button type="submit" class="btn-primary">Mettre à jour le mot de passe</button>
		</form>
	</div>
</section>