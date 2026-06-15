<script lang="ts">
	import { moduleBySlug } from '$lib/site';
	import ModuleHero from '$lib/components/site/module-hero.svelte';
	import ModuleNav from '$lib/components/site/module-nav.svelte';
	import KeyPoint from '$lib/components/lab/key-point.svelte';
	import ProteinPlanner from '$lib/components/protein/protein-planner.svelte';
	const module = moduleBySlug('protein')!;
</script>

<svelte:head>
	<title>{module.title} — eatexplained</title>
	<meta name="description" content={module.blurb} />
</svelte:head>

<article class="pb-10">
	<ModuleHero {module} />

	<p class="text-muted-foreground mx-auto max-w-3xl px-4 text-lg leading-relaxed">
		Muscle is a running balance: it grows when synthesis outpaces breakdown. Protein and training
		tip that balance in your favour. Set your numbers below.
	</p>

	<div class="mx-auto mt-8 max-w-3xl px-4">
		<ProteinPlanner />
	</div>

	<KeyPoint accent="var(--protein)">
		Total daily protein is what matters most: aim for ~1.6–2.2 g/kg, spread over a few meals. The
		"anabolic window" is mostly a myth. Hit your daily number and train.
	</KeyPoint>

	<ModuleNav slug="protein" />
</article>
