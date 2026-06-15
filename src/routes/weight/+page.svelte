<script lang="ts">
	import { moduleBySlug } from '$lib/site';
	import ModuleHero from '$lib/components/site/module-hero.svelte';
	import ModuleNav from '$lib/components/site/module-nav.svelte';
	import KeyPoint from '$lib/components/lab/key-point.svelte';
	import WeightTrajectory from '$lib/components/weight/weight-trajectory.svelte';
	const module = moduleBySlug('weight')!;
</script>

<svelte:head><title>{module.title} — eatexplained</title><meta name="description" content={module.blurb} /></svelte:head>

<article class="pb-10">
	<ModuleHero {module} />
	<p class="text-muted-foreground mx-auto max-w-3xl px-4 text-lg leading-relaxed">
		Take the number from the calculator, eat a little under or over it, and watch where it lands in 12 weeks.
	</p>
	<div class="mx-auto mt-8 max-w-3xl px-4"><WeightTrajectory /></div>
	<KeyPoint accent="var(--carb)">
		A small daily deficit becomes a big change over months. Real life isn't perfectly linear (your body adapts), but the direction is what counts.
	</KeyPoint>
	<ModuleNav slug="weight" />
</article>
