<script lang="ts">
	import { fuelMix, describeMix } from '$lib/fuel-mix';
	import Dial from '$lib/components/lab/dial.svelte';
	import FuelCurve from './fuel-curve.svelte';
	import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '$lib/components/ui/tooltip';
	import FuelEngine from './fuel-engine.svelte';

	let intensity = $state(32);
	let insulin = $state(20);
	let minutes = $state(12);

	const inputs = $derived({ intensity: intensity / 100, insulin: insulin / 100, minutes });
	const mix = $derived(fuelMix(inputs));
	const label = $derived(describeMix(mix, inputs));

	const fatPct = $derived(Math.round(mix.fatFraction * 100));
	const carbPct = $derived(100 - fatPct);

	const presets = [
		{ name: 'Fasted morning walk', i: 16, ins: 5, m: 25 },
		{ name: 'Jog after lunch', i: 44, ins: 82, m: 10 },
		{ name: 'Sprint intervals', i: 92, ins: 35, m: 6 },
		{ name: 'Long ride, 1h in', i: 58, ins: 12, m: 75 }
	];

	function apply(p: (typeof presets)[number]) {
		intensity = p.i;
		insulin = p.ins;
		minutes = p.m;
	}

	const intensityLabel = $derived(
		intensity < 15 ? 'resting' : intensity < 40 ? 'easy' : intensity < 70 ? 'moderate' : 'hard'
	);
</script>

<div class="border-border/70 bg-card relative overflow-hidden rounded-2xl border shadow-sm">
	<!-- the live engine: belts carry fuel into the muscle, energy comes out -->
	<div class="relative h-60 sm:h-64">
		<FuelEngine
			carbKcal={mix.carbKcalPerMin}
			fatKcal={mix.fatKcalPerMin}
			total={mix.totalKcalPerMin}
		/>

		<!-- headline -->
		<div class="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 text-center">
			<p class="text-muted-foreground text-[0.6rem] font-medium tracking-widest uppercase">
				Burning now
			</p>
			<p class="text-sm font-semibold">{label.headline}</p>
		</div>

		<!-- belt labels, in their colours -->
		<div class="pointer-events-none absolute left-3 text-xs font-semibold sm:text-sm" style="top: 26%; color: var(--carb);">
			Carbs <span class="font-mono">{carbPct}%</span>
		</div>
		<div class="pointer-events-none absolute left-3 text-xs font-semibold sm:text-sm" style="top: 62%; color: var(--fat);">
			Fat <span class="font-mono">{fatPct}%</span>
		</div>

		<!-- the muscle / engine (aligned to the drawn box: 72%–90%) -->
		<div
			class="pointer-events-none absolute inset-y-0 flex flex-col items-center justify-center text-center"
			style="left: 72%; width: 18%;"
		>
			<span class="text-[0.6rem] font-semibold tracking-widest text-white/85 uppercase">Muscle</span>
			<span class="font-mono text-sm font-semibold text-white">{mix.totalKcalPerMin.toFixed(1)}</span>
			<span class="text-[0.55rem] tracking-wide text-white/60 uppercase">kcal/min</span>
		</div>
	</div>

	<!-- exact split + plain-language readout -->
	<div class="space-y-3 border-t p-5 sm:p-6">
		<div class="flex h-2.5 overflow-hidden rounded-full">
			<div class="transition-[width] duration-300" style="width: {fatPct}%; background-color: var(--fat);"></div>
			<div class="transition-[width] duration-300" style="width: {carbPct}%; background-color: var(--carb);"></div>
		</div>
		<div class="text-muted-foreground flex justify-between font-mono text-xs">
			<span>{mix.fatGramsPerMin.toFixed(2)} g/min fat</span>
			<span>{mix.carbGramsPerMin.toFixed(2)} g/min carbs</span>
		</div>
		<p class="text-muted-foreground text-sm leading-relaxed">{label.detail}</p>
	</div>

	<!-- controls + curve -->
	<div class="grid gap-6 border-t p-5 sm:p-6 lg:grid-cols-2">
		<div class="space-y-5">
			<Dial
				bind:value={intensity}
				label="Effort"
				display={intensityLabel}
				accent="var(--carb)"
				hint="How hard you are working, from sitting still to all-out."
				showHint
			/>
			<Dial
				bind:value={insulin}
				label="Recent carbs"
				display={insulin < 20 ? 'fasted' : insulin < 60 ? 'snack' : 'big meal'}
				accent="var(--protein)"
				hint="A carby meal raises insulin, which puts fat-burning on pause."
			/>
			<Dial
				bind:value={minutes}
				min={0}
				max={90}
				label="Time elapsed"
				display="{minutes} min"
				accent="var(--fat)"
				hint="The longer you go, the more glycogen drains and fat steps back in."
			/>

			<div class="flex flex-wrap gap-2 pt-1">
				{#each presets as p (p.name)}
					<button
						onclick={() => apply(p)}
						class="border-border/70 hover:border-foreground/30 hover:bg-secondary rounded-full border px-3 py-1 text-xs transition-colors"
					>
						{p.name}
					</button>
				{/each}
			</div>
		</div>

		<div class="space-y-2">
			<TooltipProvider>
				<div class="border-border/70 rounded-xl border p-3">
					<div class="mb-1 flex items-center justify-between">
						<span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
							How the mix shifts with effort
						</span>
						<Tooltip>
							<TooltipTrigger class="text-muted-foreground text-xs underline decoration-dotted">
								?
							</TooltipTrigger>
							<TooltipContent class="max-w-56 text-xs">
								Blue is the share from fat, orange from carbs, across every effort level. The dot is
								you right now. Fat is a big slice when easy, almost nothing when hard.
							</TooltipContent>
						</Tooltip>
					</div>
					<FuelCurve insulin={inputs.insulin} minutes={inputs.minutes} intensity={inputs.intensity} />
					<div class="text-muted-foreground mt-1 flex justify-between text-[0.65rem]">
						<span style="color: var(--fat);">● fat</span>
						<span style="color: var(--carb);">● carbs</span>
					</div>
				</div>
			</TooltipProvider>
		</div>
	</div>
</div>
