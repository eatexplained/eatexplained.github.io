<script lang="ts">
	import type { MacroKey } from '$lib/site';
	let { macro }: { macro: MacroKey } = $props();

	// hexagon points around a centre, so CSS transforms can animate without
	// clobbering an SVG transform attribute used for positioning
	function hex(cx: number, cy: number): string {
		const pts = [
			[0, -13],
			[11, -6.5],
			[11, 6.5],
			[0, 13],
			[-11, 6.5],
			[-11, -6.5]
		];
		return pts.map(([x, y]) => `${cx + x},${cy + y}`).join(' ');
	}

	const beads: [number, number][] = [
		[30, 80],
		[60, 40],
		[95, 70],
		[130, 35],
		[165, 72],
		[200, 45]
	];
</script>

<div class="grid h-full w-full place-items-center" style="--c: var(--{macro});">
	{#if macro === 'carb'}
		<svg viewBox="0 0 240 120" class="molecule w-3/4" aria-label="A chain of glucose rings">
			{#each [0, 1, 2, 3] as n (n)}
				{#if n < 3}
					<line x1={51 + n * 55} y1="60" x2={69 + n * 55} y2="60" stroke="var(--c)" stroke-width="2" />
				{/if}
				<polygon
					class="ring"
					style="--i: {n};"
					points={hex(40 + n * 55, 60)}
					fill="color-mix(in oklab, var(--c) 22%, transparent)"
					stroke="var(--c)"
					stroke-width="2"
				/>
			{/each}
		</svg>
	{:else if macro === 'fat'}
		<svg viewBox="0 0 240 120" class="molecule w-3/4" aria-label="A triglyceride with three fatty acid tails">
			<rect x="22" y="22" width="10" height="76" rx="3" fill="var(--c)" opacity="0.8" />
			{#each [0, 1, 2] as row (row)}
				<g class="tail" style="--i: {row};">
					<path
						d="M40 {30 + row * 30} q 14 -10 28 0 q 14 10 28 0 q 14 -10 28 0 q 14 10 28 0 q 14 -10 28 0"
						fill="none"
						stroke="var(--c)"
						stroke-width="2.5"
						stroke-linecap="round"
					/>
				</g>
			{/each}
		</svg>
	{:else}
		<svg viewBox="0 0 240 120" class="molecule w-3/4" aria-label="A folding chain of amino acids">
			<polyline
				points="30,80 60,40 95,70 130,35 165,72 200,45"
				fill="none"
				stroke="color-mix(in oklab, var(--c) 45%, transparent)"
				stroke-width="2.5"
			/>
			{#each beads as [x, y], n (n)}
				<circle class="bead" style="--i: {n};" cx={x} cy={y} r="9" fill="var(--c)" />
			{/each}
		</svg>
	{/if}
</div>

<style>
	.molecule :global(.ring),
	.molecule :global(.tail),
	.molecule :global(.bead) {
		animation: bob 3.2s ease-in-out infinite;
		animation-delay: calc(var(--i) * 0.18s);
		transform-box: fill-box;
		transform-origin: center;
	}
	.molecule :global(.bead) {
		animation-name: pulse;
	}
	@keyframes bob {
		50% {
			transform: translateY(-4px);
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.18);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.molecule :global(*) {
			animation: none !important;
		}
	}
</style>
