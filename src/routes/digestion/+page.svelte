<script lang="ts">
	import { moduleBySlug } from '$lib/site';
	import ModuleHero from '$lib/components/site/module-hero.svelte';
	import ModuleNav from '$lib/components/site/module-nav.svelte';
	import KeyPoint from '$lib/components/lab/key-point.svelte';
	import Journey from '$lib/components/digestion/journey.svelte';

	const module = moduleBySlug('digestion')!;
</script>

<svelte:head>
	<title>{module.title} — eatexplained</title>
	<meta name="description" content={module.blurb} />
</svelte:head>

<article class="pb-10">
	<ModuleHero {module} />

	<p class="text-muted-foreground mx-auto max-w-3xl px-4 text-lg leading-relaxed">
		Digestion is just disassembly: breaking food into pieces small enough to slip into your blood.
		Scroll down to follow a meal through the four stops.
	</p>

	<div class="mt-8">
		<Journey />
	</div>

	<KeyPoint accent="var(--carb)">
		The small intestine does most of the work. Carbs become glucose, protein becomes amino acids,
		fat becomes fatty acids, and all of it slips into your blood.
	</KeyPoint>

	<ModuleNav slug="digestion" />
</article>
