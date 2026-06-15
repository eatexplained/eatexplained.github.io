<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/geist';
	import '@fontsource-variable/geist-mono';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from '$lib/components/site/site-header.svelte';
	import SiteFooter from '$lib/components/site/site-footer.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />

<div class="flex min-h-screen flex-col">
	<SiteHeader />
	<main class="flex-1">
		{@render children()}
	</main>
	<SiteFooter />
</div>
