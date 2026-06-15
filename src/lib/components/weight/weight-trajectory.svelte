<script lang="ts">
	import InteractiveTag from '$lib/components/lab/interactive-tag.svelte';
	import Dial from '$lib/components/lab/dial.svelte';
	import AnimatedNumber from '$lib/components/lab/animated-number.svelte';

	// ~7700 kcal is the standard rule-of-thumb energy in 1 kg of body mass.
	const KCAL_PER_KG = 7700;
	const WEEKS = 12;

	let delta = $state(-500); // daily kcal vs maintenance
	let startKg = $state(80); // starting weight

	const weeklyChangeKg = $derived((delta * 7) / KCAL_PER_KG);

	const points = $derived(
		Array.from({ length: WEEKS + 1 }, (_, w) => ({ w, kg: startKg + weeklyChangeKg * w }))
	);

	const finalKg = $derived(points[WEEKS].kg);
	const totalChange = $derived(finalKg - startKg);
	const ratePerWeek = $derived(weeklyChangeKg);
	const ratePct = $derived(startKg > 0 ? (weeklyChangeKg / startKg) * 100 : 0);

	const deltaLabel = $derived(
		delta === 0 ? 'maintenance' : `${delta > 0 ? '+' : '−'}${Math.abs(delta)} kcal`
	);

	// surplus paints with the carb accent, loss with the fat accent.
	const lineColor = $derived(delta > 0 ? 'var(--carb)' : delta < 0 ? 'var(--fat)' : 'var(--muted-foreground)');

	const aggressive = $derived(Math.abs(ratePct) > 1);

	// chart geometry
	const W = 320;
	const H = 190;
	const PAD = { t: 14, r: 16, b: 26, l: 36 };
	const plotW = W - PAD.l - PAD.r;
	const plotH = H - PAD.t - PAD.b;

	const yBounds = $derived.by(() => {
		const ys = points.map((p) => p.kg);
		let lo = Math.min(...ys, startKg);
		let hi = Math.max(...ys, startKg);
		if (hi - lo < 1) {
			lo -= 1;
			hi += 1;
		}
		const pad = (hi - lo) * 0.18;
		return { lo: lo - pad, hi: hi + pad };
	});

	const sx = (w: number) => PAD.l + (w / WEEKS) * plotW;
	const sy = (kg: number) => {
		const { lo, hi } = yBounds;
		return PAD.t + (1 - (kg - lo) / (hi - lo)) * plotH;
	};

	const linePath = $derived(points.map((p) => `${sx(p.w)},${sy(p.kg)}`).join(' '));
	const endX = $derived(sx(WEEKS));
	const endY = $derived(sy(finalKg));

	const fmtKg = (n: number) => `${n.toFixed(1)} kg`;
	const fmtSigned = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(1)}`;
	const fmtRate = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(2)}`;
	const fmtPct = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(2)}%`;
</script>

<div class="border-border/70 bg-card relative overflow-hidden rounded-2xl border shadow-sm">
	<InteractiveTag label="Drag to explore" />

	<div class="space-y-5 p-6">
		<div class="grid gap-5 sm:grid-cols-2">
			<Dial
				bind:value={delta}
				min={-1000}
				max={1000}
				step={50}
				label="Daily calories vs maintenance"
				display={deltaLabel}
				accent="var(--carb)"
			/>
			<Dial
				bind:value={startKg}
				min={45}
				max={160}
				label="Starting weight"
				display="{startKg} kg"
				accent="var(--fat)"
			/>
		</div>

		<div>
			<svg
				viewBox="0 0 {W} {H}"
				class="w-full"
				role="img"
				aria-label="Projected weight over twelve weeks"
			>
				<!-- flat maintenance reference -->
				<line
					x1={PAD.l}
					y1={sy(startKg)}
					x2={W - PAD.r}
					y2={sy(startKg)}
					stroke="var(--muted-foreground)"
					stroke-width="1"
					stroke-dasharray="3 3"
					opacity="0.4"
				/>

				<!-- trajectory -->
				<polyline
					class="trajectory"
					points={linePath}
					fill="none"
					stroke={lineColor}
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>

				<!-- end dot -->
				<circle cx={endX} cy={endY} r="4.5" fill={lineColor} stroke="var(--card)" stroke-width="2" />

				<!-- axis labels -->
				<text x={PAD.l} y={H - 8} class="fill-muted-foreground" style="font-size:9px">week 0</text>
				<text x={W - PAD.r} y={H - 8} text-anchor="end" class="fill-muted-foreground" style="font-size:9px">
					week 12
				</text>
				<text x={PAD.l - 5} y={sy(yBounds.hi) + 8} text-anchor="end" class="fill-muted-foreground" style="font-size:8px">
					{yBounds.hi.toFixed(0)}
				</text>
				<text x={PAD.l - 5} y={sy(yBounds.lo) - 1} text-anchor="end" class="fill-muted-foreground" style="font-size:8px">
					{yBounds.lo.toFixed(0)}
				</text>
			</svg>

			<p class="text-muted-foreground mt-1 text-xs">
				&approx; 7,700 kcal is about 1 kg. Day-to-day scale jumps are water and food weight, not fat.
			</p>
		</div>

		<div class="grid grid-cols-3 gap-3">
			<div class="border-border/70 bg-card/60 rounded-lg border p-3">
				<p class="font-mono text-xl font-semibold" style="color: {lineColor};">
					<AnimatedNumber value={finalKg} format={fmtKg} />
				</p>
				<p class="text-muted-foreground text-xs">weight after 12 weeks</p>
			</div>
			<div class="border-border/70 bg-card/60 rounded-lg border p-3">
				<p class="font-mono text-xl font-semibold">
					<AnimatedNumber value={totalChange} format={fmtSigned} /><span class="text-muted-foreground text-xs"> kg</span>
				</p>
				<p class="text-muted-foreground text-xs">total change</p>
			</div>
			<div class="border-border/70 bg-card/60 rounded-lg border p-3">
				<p class="font-mono text-xl font-semibold">
					<AnimatedNumber value={ratePerWeek} format={fmtRate} /><span class="text-muted-foreground text-xs"> kg/wk</span>
				</p>
				<p class="text-muted-foreground text-xs">
					<AnimatedNumber value={ratePct} format={fmtPct} /> of bodyweight
				</p>
			</div>
		</div>

		{#if delta === 0}
			<p class="text-muted-foreground text-sm">At maintenance you'll hold steady.</p>
		{:else if aggressive}
			<p class="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
				That's aggressive &mdash; ~0.5&ndash;1% of bodyweight per week is more sustainable.
			</p>
		{/if}
	</div>
</div>

<style>
	.trajectory {
		stroke-dasharray: var(--len, 600);
		stroke-dashoffset: 0;
		animation: draw 0.9s ease-out both;
		transition: stroke 0.4s ease;
	}
	@keyframes draw {
		from {
			stroke-dashoffset: var(--len, 600);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.trajectory {
			animation: none;
			stroke-dasharray: none;
		}
	}
</style>
