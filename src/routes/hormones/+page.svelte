<script lang="ts">
	import { moduleBySlug } from '$lib/site';
	import ModuleHero from '$lib/components/site/module-hero.svelte';
	import ModuleNav from '$lib/components/site/module-nav.svelte';
	import KeyPoint from '$lib/components/lab/key-point.svelte';
	import Abbr from '$lib/components/lab/abbr.svelte';
	import * as Card from '$lib/components/ui/card';
	import HpgAxis from '$lib/components/hormones/hpg-axis.svelte';
	import TestosteroneLevers from '$lib/components/hormones/testosterone-levers.svelte';

	const module = moduleBySlug('hormones')!;

	const jobs = [
		{ title: 'Muscle', line: 'Drives protein synthesis and muscle mass.' },
		{ title: 'Bone', line: 'Keeps bone dense and strong.' },
		{ title: 'Libido', line: 'A core driver of sex drive.' },
		{ title: 'Mood & drive', line: 'Shapes motivation and wellbeing.' },
		{ title: 'Red blood cells', line: 'Nudges up production, more oxygen carried.' }
	];

	const cast = [
		{
			title: 'Insulin',
			line: 'Storage signal after carbs; not the enemy, just context (see the carb-vs-fat page).'
		},
		{
			title: 'Cortisol',
			line: 'Stress hormone; useful short-term, a problem only when chronically high.'
		},
		{
			title: 'Growth hormone & IGF-1',
			line: 'Repair and recovery, released mostly in deep sleep.'
		},
		{
			title: 'Estrogen',
			line: 'Men need a little too (made from testosterone); too high OR too low both hurt.'
		},
		{
			title: 'Thyroid (T3/T4)',
			line: 'Sets your metabolic rate, how fast you burn energy.'
		},
		{
			title: 'Leptin & ghrelin',
			line: 'The full/hungry pair; hard dieting drops leptin and ramps hunger.'
		}
	];
</script>

<svelte:head>
	<title>{module.title} — eatexplained</title>
	<meta name="description" content={module.blurb} />
</svelte:head>

<article class="pb-10">
	<ModuleHero {module} />

	<p class="text-muted-foreground mx-auto max-w-3xl px-4 text-lg leading-relaxed">
		Hormones are chemical messengers, tiny signals that tell your body what to do. Testosterone gets
		the spotlight, but a few others quietly shape your body too.
	</p>

	<!-- How testosterone is made -->
	<section class="mx-auto mt-12 max-w-3xl px-4">
		<h2 class="text-2xl font-semibold tracking-tight">How testosterone is made</h2>
		<div class="mt-6">
			<Card.Root>
				<Card.Content>
					<HpgAxis />
				</Card.Content>
			</Card.Root>
		</div>
		<p class="text-muted-foreground mt-5 leading-relaxed">
			The hypothalamus signals the pituitary with
			<Abbr def="Gonadotropin-releasing hormone. The starter signal from the brain that kicks off the whole chain.">GnRH</Abbr>,
			which signals the testes' Leydig cells (via
			<Abbr def="Luteinising hormone. The pituitary's order that tells the testes to make testosterone.">LH</Abbr>)
			to make testosterone.
		</p>
		<p class="text-muted-foreground mt-3 leading-relaxed">
			It feeds back to the brain to keep itself in range, like a thermostat. Women make smaller
			amounts too, via the ovaries and adrenal glands.
		</p>
	</section>

	<!-- What it does -->
	<section class="mx-auto mt-12 max-w-3xl px-4">
		<h2 class="text-2xl font-semibold tracking-tight">What it does</h2>
		<div class="mt-5 grid gap-3 sm:grid-cols-2">
			{#each jobs as j (j.title)}
				<Card.Root>
					<Card.Content class="py-4">
						<p class="font-medium" style="color: var(--fat);">{j.title}</p>
						<p class="text-muted-foreground mt-1 text-sm leading-relaxed">{j.line}</p>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</section>

	<!-- Levers interactive -->
	<section class="mx-auto mt-12 max-w-3xl px-4">
		<TestosteroneLevers />
	</section>

	<!-- The supporting cast -->
	<section class="mx-auto mt-12 max-w-3xl px-4">
		<h2 class="text-2xl font-semibold tracking-tight">The supporting cast</h2>
		<p class="text-muted-foreground mt-2 leading-relaxed">
			A few other messengers worth knowing.
		</p>
		<div class="mt-5 grid gap-3 sm:grid-cols-2">
			{#each cast as c (c.title)}
				<Card.Root class="h-full">
					<Card.Header>
						<Card.Title class="text-base">{c.title}</Card.Title>
						<Card.Description class="mt-1.5 leading-relaxed">
							{#if c.title === 'Growth hormone & IGF-1'}
								Repair and recovery, released mostly in deep sleep
								(<Abbr def="Insulin-like growth factor 1. The hormone that carries out much of growth hormone's repair work, mostly in the liver.">IGF-1</Abbr>
								does much of the work).
							{:else}
								{c.line}
							{/if}
						</Card.Description>
					</Card.Header>
				</Card.Root>
			{/each}
		</div>
	</section>

	<KeyPoint accent="var(--fat)">
		You can't buy testosterone in a tub. Sleep, enough food, a reasonable body fat, lifting and
		stress control move it far more than any "booster".
	</KeyPoint>

	<ModuleNav slug="hormones" />
</article>
