<script lang=ts>
    import type { PageProps } from "./$types";
    const { data }: PageProps = $props();
</script>

<svelte:head>
    <title>L'équipe - TCL</title>
</svelte:head>

<section class="page-hero">
	<svg class="court-lines" viewBox="0 0 1100 260" preserveAspectRatio="xMidYMid slice">
		<rect x="750" y="10" width="320" height="240" fill="none" stroke="#F6F4EC" stroke-width="2"/>
		<line x1="750" y1="130" x2="1070" y2="130" stroke="#F6F4EC" stroke-width="2"/>
	</svg>
	<div class="wrap">
		<span class="eyebrow">Vie du club</span>
		<h1>Le bureau</h1>
		<p>Les bénévoles et coachs qui font vivre le club au quotidien.</p>
	</div>
</section>

<section id="bureau">
	<div class="wrap">
		<div class="section-head">
			<span class="section-eyebrow">Bureau</span>
			<h2>L'équipe dirigeante</h2>
		</div>
		<div class="team-grid">
            {#each data.bureau as bureau}
			<div class="team-card">
				<div class="avatar">{(bureau.firstName[0] + bureau.lastName[0]).toUpperCase()}</div>
				<div class="name">{bureau.firstName} {bureau.lastName.toUpperCase()}</div>
				<div class="role">{bureau.role.charAt(0) + bureau.role.slice(1).toLowerCase()}</div>
				<div class="email">{bureau.email}</div>
			</div>
            {/each}
		</div>
	</div>
</section>

<section class="section-tinted" id="coachs">
	<div class="wrap">
		<div class="section-head">
			<span class="section-eyebrow">École de tennis</span>
			<h2>Les coachs</h2>
		</div>
		<div class="team-grid">
            {#each data.coaches as coach}
			<div class="team-card">
				<div class="avatar">{(coach.firstName[0] + coach.lastName[0]).toUpperCase()}</div>
				<div class="name">{coach.firstName} {coach.lastName}</div>
				<div class="role">{coach.role.charAt(0) + coach.role.slice(1).toLowerCase()}</div>
				<div class="email">{coach.email}</div>
			</div>
            {/each}
		</div>
	</div>
</section>