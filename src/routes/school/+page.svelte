<svelte:head>
	<title>Page en construction · TCL Lanrivoaré</title>
</svelte:head>

<section class="wip-section">
	<svg class="court-bg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
		<rect x="80" y="50" width="640" height="400" fill="none" stroke="currentColor" stroke-width="1.5" />
		<line x1="400" y1="50" x2="400" y2="450" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 6" />
		<line x1="220" y1="50" x2="220" y2="450" stroke="currentColor" stroke-width="1" />
		<line x1="580" y1="50" x2="580" y2="450" stroke="currentColor" stroke-width="1" />
		<line x1="220" y1="250" x2="580" y2="250" stroke="currentColor" stroke-width="1" />
	</svg>

	<div class="wrap wip-container">
		<div class="ball-badge" aria-hidden="true">
			<svg viewBox="0 0 64 64" width="44" height="44">
				<circle cx="32" cy="32" r="28" fill="var(--ball, #D4E137)" />
				<path
					d="M 12 14 C 24 24, 24 40, 12 50"
					fill="none"
					stroke="#F6F4EC"
					stroke-width="3"
					stroke-linecap="round"
				/>
				<path
					d="M 52 14 C 40 24, 40 40, 52 50"
					fill="none"
					stroke="#F6F4EC"
					stroke-width="3"
					stroke-linecap="round"
				/>
			</svg>
		</div>

		<span class="eyebrow">Entraînement en cours · TCL Lanrivoaré</span>
		
		<h1>Cette page est encore <br />à <span>l'échauffement</span></h1>
		
		<p>
			Nous préparons actuellement cet espace pour vous offrir le meilleur service possible. 
			Revenez d'ici quelques échanges, le match commence bientôt !
		</p>

		<div class="wip-actions">
			<a href="/" class="btn-primary">Retour à l'accueil</a>
			<a href="/contact" class="btn-outline">Nous contacter</a>
		</div>
	</div>
</section>

<style>
	.wip-section {
		position: relative;
		min-height: calc(100vh - 160px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5rem 0;
		overflow: hidden;
		background-color: var(--bg, #F6F4EC);
		color: var(--ink, #1A241E);
	}

	.court-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		color: var(--green, #1E4632);
		opacity: 0.06;
		pointer-events: none;
	}

	.wip-container {
		position: relative;
		z-index: 1;
		max-width: 620px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.ball-badge {
		width: 76px;
		height: 76px;
		border-radius: 50%;
		background-color: var(--green, #1E4632);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.75rem;
		box-shadow: 0 12px 24px -8px rgba(30, 70, 50, 0.25);
		animation: gentle-bounce 2.8s ease-in-out infinite;
	}

	.wip-container h1 {
		font-size: clamp(2rem, 4vw, 3rem);
		line-height: 1.15;
		margin: 0.5rem 0 1.25rem;
		color: var(--green, #1E4632);
	}

	.wip-container h1 span {
		font-style: italic;
		position: relative;
		display: inline-block;
	}

	.wip-container h1 span::after {
		content: "";
		position: absolute;
		left: 0;
		bottom: 4px;
		width: 100%;
		height: 6px;
		background-color: var(--ball, #D4E137);
		z-index: -1;
		border-radius: 3px;
	}

	.wip-container p {
		font-size: 1.05rem;
		line-height: 1.65;
		color: var(--muted, #4E5B53);
		margin: 0 0 2.25rem;
		max-width: 500px;
	}

	.wip-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
	}

	/* Style de secours au cas où .btn-outline n'est pas défini globalement */
	.btn-outline {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.5rem;
		border-radius: 999px;
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
		color: var(--green, #1E4632);
		border: 1.5px solid var(--green, #1E4632);
		background: transparent;
		transition: background-color 0.2s, color 0.2s;
	}

	.btn-outline:hover {
		background-color: var(--green, #1E4632);
		color: #F6F4EC;
	}

	@keyframes gentle-bounce {
		0%, 100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-8px) rotate(12deg);
		}
	}
</style>