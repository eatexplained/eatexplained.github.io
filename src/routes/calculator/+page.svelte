<script lang="ts">
	import { moduleBySlug } from '$lib/site';
	import ModuleHero from '$lib/components/site/module-hero.svelte';
	import ModuleNav from '$lib/components/site/module-nav.svelte';
	import KeyPoint from '$lib/components/lab/key-point.svelte';
	import CalorieCalc from '$lib/components/calculator/calorie-calc.svelte';

	const module = moduleBySlug('calculator')!;
</script>

<svelte:head>
	<title>{module.title} — eatexplained</title>
	<meta name="description" content={module.blurb} />
</svelte:head>

<article class="pb-10">
	<ModuleHero {module} />

	<p class="text-muted-foreground mx-auto max-w-3xl px-4 text-lg leading-relaxed">
		How many calories should you eat? Start with how much you burn in a day. Fill this in, then open
		<strong class="text-foreground font-medium">Show me the math</strong> to see exactly where the number
		comes from.
	</p>

	<div class="mx-auto mt-8 max-w-3xl px-4">
		<CalorieCalc />
	</div>

	<KeyPoint accent="var(--carb)">
		Every formula is an estimate. Treat this as a smart starting point, eat at it for a few weeks,
		then adjust based on what actually happens. Your body is the final calculator.
	</KeyPoint>

	<ModuleNav slug="calculator" />
</article>
