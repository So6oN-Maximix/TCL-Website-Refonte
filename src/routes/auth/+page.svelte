<script lang="ts">
	import { enhance } from "$app/forms";
    import { fade } from "svelte/transition";
	import type { PageProps } from "./$types";

    let { data, form }: PageProps = $props();

	let panel = $state("login");

	const out = { duration: 180 };
	const into = { duration: 180, delay: 180 };
</script>

<svelte:head>
    <title>Connexion - TCL</title>
</svelte:head>

<section class="page-hero">
	<svg class="court-lines" viewBox="0 0 1100 260" preserveAspectRatio="xMidYMid slice">
		<rect x="750" y="10" width="320" height="240" fill="none" stroke="#F6F4EC" stroke-width="2"/>
		<line x1="750" y1="130" x2="1070" y2="130" stroke="#F6F4EC" stroke-width="2"/>
	</svg>
	<div class="wrap">
		<span class="eyebrow">Espace membres</span>
		<h1>Connexion</h1>
		<p>Accédez à vos réservations et gérez votre compte licencié.</p>
	</div>
</section>

<section>
	<div class="wrap auth-wrap">
		<div class="auth-card">
			<div class="auth-tabs">
				<button type="button" class="auth-tab" class:active={panel === "login"} onclick={() => panel = "login"}>Connexion</button>
				<button type="button" class="auth-tab" class:active={panel === "signup"} onclick={() => panel = "signup"}>Créer un compte</button>
			</div>

            {#if panel === "login"}
			<form method="POST" action="?/login" out:fade={out} in:fade={into} use:enhance>
				<div class="form-group">
					<label for="email">Adresse e-mail</label>
					<input type="email" id="email" placeholder="prenom.nom@email.fr" name="email">
				</div>
				<div class="form-group">
					<label for="password">Mot de passe</label>
					<input type="password" id="password" placeholder="••••••••" name="password">
					<div style="text-align: right; margin-top: 6px;">
						<a href="/" style="font-size: 13px; color: var(--ink-soft);" onclick={event => {
                            event.preventDefault();
                            panel = "forgot";
                        }}>Mot de passe oublié ?</a>
					</div>
				</div>
                {#if form?.error}
				<p class="auth-error">{form.error}</p>
                {/if}
				<button type="submit" class="btn-primary btn-block">Se connecter</button>
			</form>

			<div class="auth-foot">
			    Pas encore de compte ? <a href="/" onclick={event => {
                    event.preventDefault();
                    panel = "signup";
                }}>Créer un compte licencié</a>
			</div>
            {:else if panel === "signup"}
			<form method="POST" action="?/signup" out:fade={out} in:fade={into} use:enhance>
				<div class="form-group">
					<label for="firstName">Prénom <span class="required">*</span></label>
					<input type="text" id="firstName" placeholder="Max" name="firstName">
				</div>
				<div class="form-group">
					<label for="lastName">Nom <span class="required">*</span></label>
					<input type="text" id="lastName" placeholder="Leost" name="lastName">
				</div>
				<div class="form-group">
					<label for="email">Adresse e-mail <span class="required">*</span></label>
					<input type="email" id="email" placeholder="prenom.nom@email.fr" name="email">
				</div>
				<div class="form-group">
					<label for="licence">N° de licence FFT</label>
					<input type="text" id="licence" placeholder="01234567891011" name="licence">
				</div>
				<div class="form-group">
					<label for="phone">N° de téléphone</label>
					<input type="text" id="phone" placeholder="06-12-34-56-78" name="phone">
				</div>
				<div class="form-group">
					<label for="password">Mot de passe <span class="required">*</span></label>
					<input type="password" id="password" placeholder="••••••••" name="password">
				</div>
				<div class="form-group">
					<label for="confirmPassword">Confirmer le mot de passe <span class="required">*</span></label>
					<input type="password" id="confirmPassword" placeholder="••••••••" name="confirmPassword">
				</div>
                {#if form?.error}
				<p class="auth-error">{form.error}</p>
                {/if}
				<button type="submit" class="btn-primary btn-block">Créer mon compte</button>
			</form>

			<div class="auth-foot">
			    Déjà licencié ? <a href="/" onclick={event => {
                    event.preventDefault();
                    panel = "login";
                }}>Se connecter</a>
			</div>
            {:else if panel === "forgot"}
            <div class="auth-panel-block" out:fade={out} in:fade={into}>
				<div class="form-group">
					<label for="forgot-email">Adresse e-mail</label>
					<input type="email" id="forgot-email" placeholder="prenom.nom@email.fr">
				</div>
				<p class="auth-error" style="display: none; color: var(--ink-soft);"></p>
				<button type="button" class="btn-primary btn-block">Envoyer le lien</button>
				<div class="auth-foot">
					<a href="/" onclick={event => {
                        event.preventDefault();
                        panel = "login";
                    }}>Retour à la connexion</a>
				</div>
			</div>
            {/if}
		</div>
	</div>
</section>