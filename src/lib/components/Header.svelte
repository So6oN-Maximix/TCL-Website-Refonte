<script lang="ts">
    import favicon from "#lib/assets/favicon.svg";
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
		<div class="nav-collapsible" id="nav-collapsible">
			<div class="nav-links">
				<a href="/" class="active">Accueil</a>
				<a href="/">École de tennis</a>
				<a href="/">Actualités</a>
				<a href="/">Equipe</a>
				<a href="/">Contact</a>
			</div>
			<div class="nav-actions">
				<a href="/" class="btn-reserve">Réserver un court</a>
				<a href="/auth" class="nav-account" id="nav-account-link">Connexion</a>
			</div>
		</div>
	</nav>
</header>