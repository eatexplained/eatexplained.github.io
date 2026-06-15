<script lang="ts">
	import { moduleBySlug } from '$lib/site';
	import ModuleHero from '$lib/components/site/module-hero.svelte';
	import ModuleNav from '$lib/components/site/module-nav.svelte';
	import KeyPoint from '$lib/components/lab/key-point.svelte';
	import MacroExplorer from '$lib/components/macros/macro-explorer.svelte';

	const module = moduleBySlug('macros')!;
</script>

<svelte:head>
	<title>{module.title} — eatexplained</title>
	<meta name="description" content={module.blurb} />
</svelte:head>

<article class="pb-10">
	<ModuleHero {module} />

	<p class="text-muted-foreground mx-auto max-w-3xl px-4 text-lg leading-relaxed">
		Nearly everything you eat is built from three things. Tap each one to see what it is and the job
		it does.
	</p>

	<div class="mx-auto mt-8 max-w-3xl px-4">
		<MacroExplorer />
	</div>

	<KeyPoint accent="var(--protein)">
		It's a team, not a contest. Protein builds, carbs and fat fuel. The trick is just getting enough
		protein and letting the other two cover your energy.
	</KeyPoint>

	<ModuleNav slug="macros" />
</article>
