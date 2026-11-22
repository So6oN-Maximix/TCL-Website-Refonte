<svelte:head>
    <title>Contact - TCL</title>
</svelte:head>

<section class="page-hero">
	<svg class="court-lines" viewBox="0 0 1100 260" preserveAspectRatio="xMidYMid slice">
		<rect x="750" y="10" width="320" height="240" fill="none" stroke="#F6F4EC" stroke-width="2"/>
		<line x1="750" y1="130" x2="1070" y2="130" stroke="#F6F4EC" stroke-width="2"/>
	</svg>
	<div class="wrap">
		<span class="eyebrow">On vous répond vite</span>
		<h1>Contact</h1>
		<p>Une question sur les licences, les cours ou une réservation ? Écrivez-nous, ou passez directement au club.</p>
	</div>
</section>

<section>
	<div class="wrap contact-grid">
		<div class="contact-info">
			<h3>Le club</h3>
			<div class="contact-row">
				<div>
					<span class="k">Adresse</span>
					<span class="v">Mairie, 29290 Lanrivoaré</span>
				</div>
			</div>
			<div class="contact-row">
				<div>
					<span class="k">Téléphone</span>
					<span class="v">02 98 84 36 43</span>
				</div>
			</div>
			<div class="contact-row">
				<div>
					<span class="k">E-mail</span>
					<span class="v">tc.lanrivoare.site@gmail.com</span>
				</div>
			</div>
			<div class="contact-row">
				<div>
					<span class="k">Accès</span>
					<span class="v">PMR · parking adapté</span>
				</div>
			</div>
			<svg class="courts-diagram" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet" style="margin-top: 28px;">
				<rect x="20" y="20" width="260" height="260" fill="none" stroke="#F6F4EC" stroke-width="2"/>
				<rect x="45" y="20" width="210" height="260" fill="none" stroke="#F6F4EC" stroke-width="1.4"/>
				<line x1="20" y1="150" x2="280" y2="150" stroke="var(--ball)" stroke-width="2"/>
				<line x1="45" y1="75" x2="255" y2="75" stroke="#F6F4EC" stroke-width="1.2"/>
				<line x1="45" y1="225" x2="255" y2="225" stroke="#F6F4EC" stroke-width="1.2"/>
				<line x1="150" y1="75" x2="150" y2="225" stroke="#F6F4EC" stroke-width="1.2"/>
			</svg>
		</div>

		<div class="contact-form-card">
			<form id="contact-form">
				<div class="form-group">
					<label for="contact-nom">Nom et prénom</label>
					<input type="text" id="contact-nom" placeholder="Max Leost">
				</div>
				<div class="form-group">
					<label for="contact-email">Adresse e-mail</label>
					<input type="email" id="contact-email" placeholder="adresse.mail@email.fr">
				</div>
				<div class="form-group">
					<label for="contact-sujet">Sujet</label>
					<select id="contact-sujet">
						<option value="licence">Licence / inscription</option>
						<option value="ecole">École de tennis</option>
						<option value="reservation">Réservation de court</option>
						<option value="autre">Autre demande</option>
					</select>
				</div>
				<div class="form-group">
					<label for="contact-message">Message</label>
					<textarea id="contact-message" placeholder="Votre message..."></textarea>
				</div>
				<p class="auth-error" id="contact-error" style="display: none;"></p>
				<p class="auth-error" id="contact-success" style="display: none; color: var(--court-green);"></p>
				<button type="submit" class="btn-primary btn-block">Envoyer le message</button>
			</form>
		</div>
	</div>
</section>