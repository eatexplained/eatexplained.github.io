<script lang="ts">
	import { moduleBySlug } from '$lib/site';
	import ModuleHero from '$lib/components/site/module-hero.svelte';
	import ModuleNav from '$lib/components/site/module-nav.svelte';
	import KeyPoint from '$lib/components/lab/key-point.svelte';
	import FuelLab from '$lib/components/switch/fuel-lab.svelte';

	const module = moduleBySlug('switch')!;
</script>

<svelte:head>
	<title>{module.title} — eatexplained</title>
	<meta name="description" content={module.blurb} />
</svelte:head>

<article class="pb-10">
	<ModuleHero {module} />

	<p class="text-muted-foreground mx-auto max-w-3xl px-4 text-lg leading-relaxed">
		You always burn a blend of carbs and fat at once. What changes is the recipe. Three things tip
		it: how hard you work, whether you recently ate carbs, and how long you've been going. Try it.
	</p>

	<div class="mx-auto mt-8 max-w-3xl px-4">
		<FuelLab />
	</div>

	<KeyPoint accent="var(--fat)">
		The "fat-burning zone" is real but misleading. Easy effort burns a higher <em>percentage</em> of
		fat, yet far fewer calories overall. For fat loss, total energy across the day is what matters.
	</KeyPoint>

	<ModuleNav slug="switch" />
</article>
