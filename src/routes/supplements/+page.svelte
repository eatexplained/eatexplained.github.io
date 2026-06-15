<script lang="ts">
	import { moduleBySlug } from '$lib/site';
	import ModuleHero from '$lib/components/site/module-hero.svelte';
	import ModuleNav from '$lib/components/site/module-nav.svelte';
	import KeyPoint from '$lib/components/lab/key-point.svelte';
	import SuppRanking from '$lib/components/supplements/supp-ranking.svelte';

	const module = moduleBySlug('supplements')!;
</script>

<svelte:head>
	<title>{module.title} — eatexplained</title>
	<meta name="description" content={module.blurb} />
</svelte:head>

<article class="pb-10">
	<ModuleHero {module} />

	<p class="text-muted-foreground mx-auto max-w-3xl px-4 text-lg leading-relaxed">
		Supplements are the last 5% on top of training, sleep and diet, not a shortcut around them. Here
		is what actually has evidence, top to bottom.
	</p>

	<div class="mx-auto mt-8 max-w-3xl px-4">
		<SuppRanking />
	</div>

	<KeyPoint accent="var(--energy)">
		Only two have strong, broad evidence: creatine and caffeine. Everything else is situational or
		marketing. Get training, sleep and protein right first.
	</KeyPoint>

	<ModuleNav slug="supplements" />
</article>
