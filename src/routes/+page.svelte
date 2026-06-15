<script lang="ts">
	import { base } from '$app/paths';
	import { MODULES, MACROS } from '$lib/site';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import EnergyHero from '$lib/components/home/energy-hero.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	const macroList = [MACROS.carb, MACROS.protein, MACROS.fat];
</script>

<svelte:head>
	<title>eatexplained — nutrition explained simply</title>
	<meta
		name="description"
		content="A simple, visual guide to how your body uses protein, carbs and fat for energy, plus a calorie calculator that shows its work."
	/>
</svelte:head>

<!-- Hero -->
<section class="mx-auto max-w-5xl px-4 pt-12 pb-10 sm:pt-16">
	<div class="grid items-center gap-8 lg:grid-cols-2">
		<div>
			<Badge variant="secondary">No jargon. No diet rules.</Badge>
			<h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
				How your body actually uses food
			</h1>
			<p class="text-muted-foreground mt-4 text-lg leading-relaxed">
				What protein, carbs and fat do, how a meal gets broken down, and when your body burns
				carbs versus stored fat. Explained simply, with visuals you can play with.
			</p>
			<div class="mt-6 flex flex-wrap gap-3">
				<Button href="{base}/macros">
					Start at the beginning
					<ArrowRight class="size-4" />
				</Button>
				<Button href="{base}/calculator" variant="outline">Calorie calculator</Button>
			</div>
		</div>

		<Card.Root class="overflow-hidden p-0">
			<div class="aspect-[5/4] w-full">
				<EnergyHero />
			</div>
			<div class="text-muted-foreground border-t px-4 py-2.5 text-xs">
				Fuel from food (the dots) flows into a cell and becomes usable energy.
			</div>
		</Card.Root>
	</div>
</section>

<!-- Macro teaser -->
<section class="mx-auto max-w-5xl px-4 py-8">
	<div class="grid gap-4 sm:grid-cols-3">
		{#each macroList as m (m.key)}
			<Card.Root>
				<Card.Header>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<span class="size-2.5 rounded-full" style="background-color: {m.color};"></span>
							<Card.Title>{m.name}</Card.Title>
						</div>
						<span class="text-muted-foreground font-mono text-sm">{m.kcalPerGram} kcal/g</span>
					</div>
				</Card.Header>
				<Card.Content>
					<p class="text-muted-foreground text-sm leading-relaxed">{m.job}</p>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</section>

<!-- Module list -->
<section class="mx-auto max-w-5xl px-4 py-8">
	<h2 class="text-2xl font-semibold tracking-tight">The tour</h2>
	<p class="text-muted-foreground mt-1 text-sm">
		Read in order, or jump to whatever you're curious about.
	</p>

	<div class="mt-6 grid gap-4 sm:grid-cols-2">
		{#each MODULES as m (m.slug)}
			<a href={base + m.href} class="group">
				<Card.Root class="hover:border-foreground/20 h-full transition-colors">
					<Card.Header>
						<div class="flex items-start gap-4">
							<span
								class="bg-muted text-muted-foreground grid size-9 shrink-0 place-items-center rounded-md font-mono text-sm"
							>
								{m.index}
							</span>
							<div>
								<Card.Title class="flex items-center gap-1.5">
									{m.title}
									<ArrowRight
										class="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5"
									/>
								</Card.Title>
								<Card.Description class="mt-1.5">{m.blurb}</Card.Description>
							</div>
						</div>
					</Card.Header>
				</Card.Root>
			</a>
		{/each}
	</div>
</section>
