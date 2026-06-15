<script lang="ts">
	import { fatFraction, crossoverIntensity } from '$lib/fuel-mix';

	let {
		insulin,
		minutes,
		intensity
	}: { insulin: number; minutes: number; intensity: number } = $props();

	const W = 320;
	const H = 190;
	const PAD = { t: 12, r: 12, b: 26, l: 30 };
	const plotW = W - PAD.l - PAD.r;
	const plotH = H - PAD.t - PAD.b;

	const sx = (i: number) => PAD.l + i * plotW;
	const sy = (f: number) => PAD.t + (1 - f) * plotH;

	const samples = $derived(
		Array.from({ length: 61 }, (_, k) => {
			const i = k / 60;
			return { i, f: fatFraction({ intensity: i, insulin, minutes }) };
		})
	);

	const fatLine = $derived(samples.map((s) => `${sx(s.i)},${sy(s.f)}`).join(' '));
	// area under the fat line (fat fuel), down to the baseline
	const fatArea = $derived(
		`${sx(0)},${sy(0)} ` + samples.map((s) => `${sx(s.i)},${sy(s.f)}`).join(' ') + ` ${sx(1)},${sy(0)}`
	);

	const cross = $derived(crossoverIntensity(insulin, minutes));
	const curFat = $derived(fatFraction({ intensity, insulin, minutes }));
</script>

<svg viewBox="0 0 {W} {H}" class="w-full" role="img" aria-label="Fat versus carbohydrate use across exercise intensity">
	<!-- carb region fills the whole plot; fat area is painted over the bottom -->
	<rect
		x={PAD.l}
		y={PAD.t}
		width={plotW}
		height={plotH}
		fill="color-mix(in oklab, var(--carb) 16%, transparent)"
		rx="4"
	/>
	<polygon points={fatArea} fill="color-mix(in oklab, var(--fat) 26%, transparent)" />
	<polyline points={fatLine} fill="none" stroke="var(--fat)" stroke-width="2" stroke-linecap="round" />

	<!-- 50% guide -->
	<line
		x1={PAD.l}
		y1={sy(0.5)}
		x2={W - PAD.r}
		y2={sy(0.5)}
		stroke="var(--muted-foreground)"
		stroke-width="1"
		stroke-dasharray="3 3"
		opacity="0.5"
	/>

	<!-- crossover marker -->
	{#if cross < 1}
		<line
			x1={sx(cross)}
			y1={PAD.t}
			x2={sx(cross)}
			y2={H - PAD.b}
			stroke="var(--muted-foreground)"
			stroke-width="1"
			opacity="0.45"
		/>
		<text x={sx(cross)} y={PAD.t - 2} text-anchor="middle" class="fill-muted-foreground" style="font-size:8px">
			crossover
		</text>
	{/if}

	<!-- current intensity -->
	<line
		x1={sx(intensity)}
		y1={PAD.t}
		x2={sx(intensity)}
		y2={H - PAD.b}
		stroke="var(--foreground)"
		stroke-width="1.5"
	/>
	<circle cx={sx(intensity)} cy={sy(curFat)} r="4.5" fill="var(--fat)" stroke="var(--card)" stroke-width="2" />

	<!-- axes labels -->
	<text x={PAD.l} y={H - 8} class="fill-muted-foreground" style="font-size:9px">rest</text>
	<text x={W - PAD.r} y={H - 8} text-anchor="end" class="fill-muted-foreground" style="font-size:9px">
		max effort
	</text>
	<text x={PAD.l - 4} y={sy(1) + 3} text-anchor="end" class="fill-muted-foreground" style="font-size:8px">100</text>
	<text x={PAD.l - 4} y={sy(0) + 1} text-anchor="end" class="fill-muted-foreground" style="font-size:8px">0</text>
</svg>
