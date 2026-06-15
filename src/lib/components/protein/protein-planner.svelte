<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import Dial from '$lib/components/lab/dial.svelte';
	import AnimatedNumber from '$lib/components/lab/animated-number.svelte';
	import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui/toggle-group';
	import Check from '@lucide/svelte/icons/check';

	let kg = $state(75);
	let gPerKg = $state(1.8);
	let mealsStr = $state('4');

	const meals = $derived(parseInt(mealsStr, 10));
	const dailyProtein = $derived(Math.round(kg * gPerKg));
	const perMeal = $derived(Math.round(dailyProtein / meals));
	// ~0.4 g/kg per meal maximises the MPS response; past this you get diminishing returns.
	const thresholdPerMeal = $derived(Math.round(0.4 * kg));
	const hitsThreshold = $derived(perMeal >= 0.3 * kg);

	// Waking hours window for evenly spaced meals.
	const dayStart = 8;
	const dayEnd = 22;

	const mealTimes = $derived(
		Array.from({ length: meals }, (_, i) =>
			meals === 1 ? (dayStart + dayEnd) / 2 : dayStart + ((dayEnd - dayStart) * i) / (meals - 1)
		)
	);

	// Each meal's MPS bump height is capped at a ceiling ("muscle full"): more than
	// ~0.4 g/kg in one sitting does not raise the response further. Under-dosed meals
	// produce a lower bump.
	const mealBumps = $derived(
		mealTimes.map((t) => {
			const dose = perMeal;
			const ratio = thresholdPerMeal > 0 ? dose / thresholdPerMeal : 0;
			// capped at 1 (the ceiling); below threshold scales down, floor for a visible baseline rise.
			const height = Math.min(1, Math.max(0.18, ratio));
			return { time: t, height, low: !hitsThreshold };
		})
	);

	// Chart geometry
	const W = 640;
	const H = 200;
	const padL = 14;
	const padR = 14;
	const padTop = 24;
	const baseY = H - 34;
	const peakY = padTop;
	const plotW = W - padL - padR;

	const xOf = (hour: number) => padL + (hour / 24) * plotW;
	const ceilY = peakY + (baseY - peakY) * 0.08; // visual ceiling line near the top

	// Animate the curve in.
	const grow = new Tween(0, { duration: 900, easing: cubicOut });
	$effect(() => {
		// re-trigger a gentle redraw when inputs change
		void dailyProtein;
		void meals;
		grow.set(0, { duration: 0 });
		grow.set(1);
	});

	// Build a smooth area path: baseline with a gaussian-ish bump at each meal.
	const curvePath = $derived.by(() => {
		const g = grow.current;
		const baseline = baseY - 10; // resting MPS sits a touch above the floor
		const amp = (baseY - peakY) * 0.78;
		const sigma = (dayEnd - dayStart) / (meals * 1.7) + 0.8; // bump width

		const pts: [number, number][] = [];
		const steps = 120;
		for (let s = 0; s <= steps; s++) {
			const hour = (s / steps) * 24;
			let bump = 0;
			for (const m of mealBumps) {
				const d = hour - m.time;
				bump += m.height * Math.exp(-(d * d) / (2 * sigma * sigma));
			}
			bump = Math.min(1, bump); // shared ceiling: stacked meals cannot exceed muscle-full
			const y = baseline - bump * amp * g;
			pts.push([xOf(hour), y]);
		}

		let d = `M ${padL} ${baseY} L ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
		for (let i = 1; i < pts.length; i++) {
			const [x0, y0] = pts[i - 1];
			const [x1, y1] = pts[i];
			const cx = (x0 + x1) / 2;
			d += ` Q ${x0.toFixed(1)} ${y0.toFixed(1)} ${cx.toFixed(1)} ${((y0 + y1) / 2).toFixed(1)}`;
		}
		const last = pts[pts.length - 1];
		d += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)} L ${W - padR} ${baseY} Z`;
		return d;
	});

	const hourTicks = [0, 6, 12, 18, 24];
	const fmtHour = (h: number) => (h === 24 ? '24h' : h === 0 ? '0h' : `${h}:00`);
</script>

<div class="border-border/70 bg-card relative overflow-hidden rounded-2xl border shadow-sm">
	<div class="grid gap-0 lg:grid-cols-[1fr_0.85fr]">
		<!-- controls -->
		<div class="space-y-6 p-6">
			<Dial
				bind:value={kg}
				min={45}
				max={160}
				step={1}
				label="Bodyweight"
				display="{kg} kg"
				accent="var(--protein)"
				showHint
			/>
			<Dial
				bind:value={gPerKg}
				min={1.2}
				max={2.4}
				step={0.1}
				label="Protein target"
				display="{gPerKg.toFixed(1)} g/kg"
				accent="var(--carb)"
				hint="1.6–2.2 g/kg covers most people who train; go higher in a deficit."
			/>

			<div class="space-y-2">
				<span class="text-sm font-medium">Meals per day</span>
				<ToggleGroup type="single" bind:value={mealsStr} variant="outline" class="justify-start">
					<ToggleGroupItem value="3">3</ToggleGroupItem>
					<ToggleGroupItem value="4">4</ToggleGroupItem>
					<ToggleGroupItem value="5">5</ToggleGroupItem>
					<ToggleGroupItem value="6">6</ToggleGroupItem>
				</ToggleGroup>
				<p class="text-muted-foreground text-xs">
					Spreading protein over 3–5 meals beats stacking it into 1–2.
				</p>
			</div>
		</div>

		<!-- readout -->
		<div class="bg-secondary/40 border-border/70 flex flex-col gap-5 border-t p-6 lg:border-t-0 lg:border-l">
			<div>
				<p class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
					Daily protein
				</p>
				<p class="mt-1 text-5xl font-semibold tracking-tight" style="color: var(--protein);">
					<AnimatedNumber value={dailyProtein} />
					<span class="text-muted-foreground text-xl">g</span>
				</p>
				<p class="text-muted-foreground mt-1 text-sm">
					about <span class="text-foreground font-medium"
						><AnimatedNumber value={perMeal} /> g</span
					>
					per meal across {meals} meals
				</p>
			</div>

			<div class="border-border/70 bg-card/60 rounded-lg border p-3">
				<p class="text-muted-foreground text-xs">
					Per-meal sweet spot
				</p>
				<p class="mt-0.5 font-mono text-lg font-semibold">
					~{thresholdPerMeal} g
					<span class="text-muted-foreground text-xs font-normal">(0.4 g/kg)</span>
				</p>
				<p class="text-muted-foreground mt-1 text-xs leading-relaxed">
					Past this, a single meal can't raise muscle protein synthesis further. Leucine triggers
					the response; the daily total is what dominates.
				</p>
			</div>
		</div>
	</div>

	<!-- MPS chart -->
	<div class="border-border/70 border-t p-6">
		<div class="flex items-baseline justify-between gap-3">
			<p class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
				Muscle protein synthesis over a day
			</p>
			<p class="text-muted-foreground text-xs">resting → meal-driven peaks</p>
		</div>

		<svg
			class="mt-3 w-full"
			viewBox="0 0 {W} {H}"
			role="img"
			aria-label="Muscle protein synthesis rises after each meal, capped at a ceiling representing the muscle-full effect."
		>
			<!-- ceiling line: the muscle-full cap -->
			<line
				x1={padL}
				y1={ceilY}
				x2={W - padR}
				y2={ceilY}
				stroke="var(--protein)"
				stroke-width="1"
				stroke-dasharray="4 4"
				opacity="0.45"
			/>
			<text x={W - padR} y={ceilY - 5} text-anchor="end" class="fill-muted-foreground" font-size="10">
				MPS ceiling (muscle full)
			</text>

			<!-- baseline -->
			<line x1={padL} y1={baseY} x2={W - padR} y2={baseY} stroke="var(--border)" stroke-width="1" />

			<!-- curve -->
			<path
				class="mps-curve"
				d={curvePath}
				fill="color-mix(in oklab, var(--protein) 18%, transparent)"
				stroke="var(--protein)"
				stroke-width="2"
				stroke-linejoin="round"
			/>

			<!-- meal markers -->
			{#each mealBumps as m (m.time)}
				<line
					x1={xOf(m.time)}
					y1={baseY}
					x2={xOf(m.time)}
					y2={baseY + 6}
					stroke={m.low ? 'var(--muted-foreground)' : 'var(--protein)'}
					stroke-width="1.5"
				/>
			{/each}

			<!-- hour ticks -->
			{#each hourTicks as h (h)}
				<text
					x={xOf(h)}
					y={H - 8}
					text-anchor="middle"
					class="fill-muted-foreground"
					font-size="10"
				>
					{fmtHour(h)}
				</text>
			{/each}
		</svg>

		<!-- per-meal cards -->
		<div class="mt-4 grid gap-2" style="grid-template-columns: repeat({meals}, minmax(0, 1fr));">
			{#each mealBumps as m, i (i)}
				<div class="border-border/70 bg-card/60 rounded-lg border p-2.5 text-center">
					<p class="text-muted-foreground text-[0.65rem] tracking-wide uppercase">
						Meal {i + 1}
					</p>
					<p class="mt-0.5 font-mono text-base font-semibold">{perMeal}<span class="text-muted-foreground text-xs">g</span></p>
					{#if m.low}
						<span
							class="mt-1 inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground"
						>
							low
						</span>
					{:else}
						<span
							class="mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[0.65rem] font-medium"
							style="background-color: color-mix(in oklab, var(--protein) 16%, transparent); color: var(--protein);"
						>
							<Check class="size-3" />
							full
						</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.mps-curve {
		transition: d 0.4s ease;
	}
	@media (prefers-reduced-motion: reduce) {
		.mps-curve {
			transition: none;
		}
	}
</style>
