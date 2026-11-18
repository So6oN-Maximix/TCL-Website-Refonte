<script lang="ts">
    import favicon from "#lib/assets/favicon.svg";
	import { page } from "$app/state";

    interface User {
        firstName?: string;
        email?: string;
    }
    let { user = null }: { user?: User | null } = $props();
</script>

<header>
	<nav class="wrap">
		<div class="logo">
			<img src={favicon} alt="Logo TC Lanrivoaré" class="logo-mark">
			TC Lanrivoaré
		</div>
		<button type="button" class="nav-toggle" id="nav-toggle" aria-label="Menu" aria-expanded="false">
			<span></span><span></span><span></span>
		</button>
		<div class="nav-collapsible">
			<div class="nav-links">
				<a href="/" class:active={page.url.pathname === "/"}>Accueil</a>
				<a href="/" class:active={page.url.pathname === "/"}>École de tennis</a>
				<a href="/" class:active={page.url.pathname === "/"}>Actualités</a>
				<a href="/team" class:active={page.url.pathname === "/team"}>Equipe</a>
				<a href="/" class:active={page.url.pathname === "/"}>Contact</a>
			</div>
			<div class="nav-actions">
				<a href="/" class="btn-reserve">Réserver un court</a>
				{#if user}
				<a href="/profile" class="nav-account">Mon profil</a>
				{:else}
				<a href="/auth" class="nav-account">Connexion</a>
				{/if}
			</div>
		</div>
	</nav>
</header>