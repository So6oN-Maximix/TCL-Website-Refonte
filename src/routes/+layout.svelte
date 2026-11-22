<script lang="ts">
	import "../app.css";
	import favicon from "#lib/assets/favicon.svg";
	import type { LayoutProps } from "./$types";

	import Header from "#lib/components/Header.svelte";
	import Toast from "#lib/components/Toast.svelte";
	import Footer from "#lib/components/Footer.svelte";

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header user={data.user} />

<main>
	{@render children()}
</main>

<Footer />
<Toast />