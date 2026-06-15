<script lang="ts">
	import { inview } from '$lib/actions/inview';
	import type { MacroKey } from '$lib/site';

	interface Stage {
		id: string;
		organ: string;
		title: string;
		body: string;
		accent: string;
		transforms: { macro: MacroKey; text: string }[];
	}

	const stages: Stage[] = [
		{
			id: 'mouth',
			organ: 'Mouth',
			title: 'It starts before you swallow',
			accent: 'var(--carb)',
			body: 'Chewing and saliva begin breaking starch into sugar. Hold bread on your tongue and it slowly turns sweet, that is the enzyme amylase at work.',
			transforms: [{ macro: 'carb', text: 'starch starts becoming sugar' }]
		},
		{
			id: 'stomach',
			organ: 'Stomach',
			title: 'A churning acid bath',
			accent: 'var(--protein)',
			body: 'Strong acid kills germs and starts unfolding protein so it can be taken apart. Food leaves as a thick soup called chyme.',
			transforms: [{ macro: 'protein', text: 'protein begins to unravel' }]
		},
		{
			id: 'intestine',
			organ: 'Small intestine',
			title: 'Where the real work happens',
			accent: 'var(--carb)',
			body: 'The pancreas adds enzymes and the liver sends bile. Every macro is finished off here and absorbed through millions of tiny villi into your blood.',
			transforms: [
				{ macro: 'carb', text: 'carbs → glucose' },
				{ macro: 'protein', text: 'protein → amino acids' },
				{ macro: 'fat', text: 'fat → fatty acids' }
			]
		},
		{
			id: 'blood',
			organ: 'Bloodstream',
			title: 'Delivery to every cell',
			accent: 'var(--fat)',
			body: 'The pieces ride your blood, with the liver as the main checkpoint. Fat is the exception: it takes a detour through the lymph first and skips that checkpoint. From here it is all about energy: burn it now, store it, or save it as fat.',
			transforms: [{ macro: 'carb', text: 'glucose heads to the liver' }]
		}
	];

	let shown = $state(stages.map(() => false));
	let active = $state(0);

	function reveal(i: number, isIn: boolean) {
		if (isIn) shown[i] = true;
	}
	function focusStage(i: number, isIn: boolean) {
		if (isIn) active = i;
	}
</script>

<div class="relative">
	<!-- progress dots -->
	<div class="bg-background/80 sticky top-14 z-20 flex items-center justify-center gap-2.5 py-3 backdrop-blur">
		{#each stages as s, i (s.id)}
			<span
				class="h-1.5 rounded-full transition-all duration-300"
				style="width:{i === active ? '1.5rem' : '0.375rem'};background-color:{i <= active
					? s.accent
					: 'var(--muted)'}"
			></span>
		{/each}
	</div>

	{#each stages as s, i (s.id)}
		<section
			use:inview={{ rootMargin: '-45% 0px -45% 0px', threshold: 0, onchange: (v) => focusStage(i, v) }}
			class="flex min-h-[72vh] flex-col items-center justify-center px-4 text-center"
		>
			<div
				use:inview={{ once: true, threshold: 0.3, onchange: (v) => reveal(i, v) }}
				class="stage flex max-w-md flex-col items-center"
				class:in={shown[i]}
				style="--accent:{s.accent}"
			>
				<div
					class="disc mb-7 grid size-36 place-items-center rounded-full"
					style="background-color: color-mix(in oklab, var(--accent) 12%, transparent);"
				>
					{@render organ(s.id, s.accent)}
				</div>

				<p class="font-mono text-xs font-medium tracking-widest uppercase" style="color: var(--accent);">
					Stop {i + 1} · {s.organ}
				</p>
				<h3 class="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{s.title}</h3>
				<p class="text-muted-foreground mt-3 leading-relaxed">{s.body}</p>

				<div class="mt-5 flex flex-wrap justify-center gap-2">
					{#each s.transforms as t (t.text)}
						<span
							class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
							style="background-color: color-mix(in oklab, var(--{t.macro}) 14%, transparent); color: var(--{t.macro});"
						>
							<span class="size-1.5 rounded-full" style="background-color: var(--{t.macro});"></span>
							{t.text}
						</span>
					{/each}
				</div>
			</div>
		</section>
	{/each}
</div>

{#snippet organ(id: string, accent: string)}
	<svg viewBox="0 0 80 80" class="w-20" fill="none" stroke={accent} stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		{#if id === 'mouth'}
			<circle cx="40" cy="40" r="24" />
			<path d="M28 40 Q40 54 52 40" />
		{:else if id === 'stomach'}
			<path d="M34 18 Q34 30 44 32 Q60 35 56 52 Q52 66 38 64 Q26 62 28 50" />
		{:else if id === 'intestine'}
			<path d="M22 24 H50 Q60 24 60 32 Q60 40 50 40 H30 Q20 40 20 48 Q20 56 30 56 H58" />
		{:else}
			<circle cx="40" cy="40" r="8" fill={accent} stroke="none" />
			<path d="M40 32 V20 M40 48 V60 M32 40 H20 M48 40 H60" />
		{/if}
	</svg>
{/snippet}

<style>
	/* the disc pops in with a soft overshoot */
	.stage > .disc {
		opacity: 0;
		transform: scale(0.7) translateY(8px);
		transition:
			opacity 0.5s ease,
			transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	/* text cascades up after it */
	.stage > p,
	.stage > h3,
	.stage > div:not(.disc) {
		opacity: 0;
		transform: translateY(22px);
		filter: blur(4px);
		transition:
			opacity 0.55s ease,
			transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
			filter 0.55s ease;
	}
	.stage.in > * {
		opacity: 1;
		transform: none;
		filter: none;
	}
	.stage.in > *:nth-child(2) {
		transition-delay: 0.12s;
	}
	.stage.in > *:nth-child(3) {
		transition-delay: 0.2s;
	}
	.stage.in > *:nth-child(4) {
		transition-delay: 0.3s;
	}
	.stage.in > *:nth-child(5) {
		transition-delay: 0.4s;
	}

	@media (prefers-reduced-motion: reduce) {
		.stage > * {
			opacity: 1 !important;
			transform: none !important;
			filter: none !important;
			transition: none !important;
		}
	}
</style>
