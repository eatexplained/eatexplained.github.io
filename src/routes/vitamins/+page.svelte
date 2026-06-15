<script lang="ts">
	import { moduleBySlug } from '$lib/site';
	import ModuleHero from '$lib/components/site/module-hero.svelte';
	import ModuleNav from '$lib/components/site/module-nav.svelte';
	import KeyPoint from '$lib/components/lab/key-point.svelte';
	import MicroRanking from '$lib/components/vitamins/micro-ranking.svelte';

	const module = moduleBySlug('vitamins')!;
</script>

<svelte:head>
	<title>{module.title} — eatexplained</title>
	<meta name="description" content={module.blurb} />
</svelte:head>

<article class="pb-10">
	<ModuleHero {module} />

	<p class="text-muted-foreground mx-auto max-w-3xl px-4 text-lg leading-relaxed">
		If macros are the bricks and the fuel, micronutrients are the spark plugs. You need only tiny
		amounts, but almost nothing in your body works without them. Switch the toggle to re-rank the
		list for muscle building or all-round health.
	</p>

	<div class="mx-auto mt-8 max-w-3xl px-4">
		<MicroRanking />
	</div>

	<p class="text-muted-foreground mx-auto mt-6 max-w-3xl px-4 text-sm leading-relaxed">
		One honest aside: the single best-evidenced supplement for lifters is not a vitamin at all, it's
		<strong class="text-foreground font-medium">creatine monohydrate</strong> (about 3 to 5 g a day).
		More proven for strength and size than anything in the list above.
	</p>

	<KeyPoint accent="var(--vit)">
		You can't out-supplement a bad diet, but most lifters are genuinely low in just a few: vitamin
		D, omega-3, magnesium and zinc. Cover those first, ideally from food.
	</KeyPoint>

	<ModuleNav slug="vitamins" />
</article>
