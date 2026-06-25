<script lang="ts">
	import Dial from '$lib/components/lab/dial.svelte';

	// rough numbers for a ~70kg person, kcal
	const GLYCOGEN_CAP = 1800;
	const FAT_CAP = 100000;
	const BURN_PER_HOUR = 600; // hard endurance effort, fuelled mostly by glycogen

	let hours = $state(0);

	const burned = $derived(hours * BURN_PER_HOUR);
	const glycogenLeft = $derived(Math.max(0, GLYCOGEN_CAP - burned));
	const fatUsed = $derived(Math.max(0, burned - GLYCOGEN_CAP));
	const fatLeft = $derived(FAT_CAP - fatUsed);

	const glycogenPct = $derived((glycogenLeft / GLYCOGEN_CAP) * 100);
	const fatPct = $derived((fatLeft / FAT_CAP) * 100);

	const note = $derived(
		glycogenLeft > 0
			? `Working hard, you burn mostly glycogen. At this pace it runs out in about ${(GLYCOGEN_CAP / BURN_PER_HOUR).toFixed(0)} hours, the point runners call hitting the wall. Then your body shifts to fat.`
			: `Glycogen is empty (you have hit the wall), so you are running on fat now. After ${hours} hours you have used only ${fatUsed.toLocaleString()} kcal of fat, barely a dent.`
	);
</script>

<div class="border-border/70 bg-card relative space-y-6 rounded-2xl border p-6 shadow-sm">
	<!-- to-scale fuel gauge -->
	<div>
		<p class="text-muted-foreground mb-2 text-xs font-medium tracking-widest uppercase">
			Your energy stores, drawn to scale
		</p>
		<div class="bg-muted flex h-8 overflow-hidden rounded-lg text-[0.65rem] font-medium">
			<div
				class="grid place-items-center text-white"
				style="width: {(GLYCOGEN_CAP / FAT_CAP) * 100}%; min-width: 3px; background-color: var(--carb);"
				title="Glycogen"
			></div>
			<div class="grid flex-1 place-items-center text-white" style="background-color: var(--fat);">
				FAT ≈ {FAT_CAP.toLocaleString()} kcal
			</div>
		</div>
		<p class="text-muted-foreground mt-1.5 text-xs">
			That orange sliver on the left is <strong style="color: var(--carb);">all</strong> your
			carb storage (~{GLYCOGEN_CAP.toLocaleString()} kcal). Fat storage is on another scale entirely.
		</p>
	</div>

	<!-- draining tanks -->
	<div class="grid grid-cols-2 gap-4">
		{#each [{ key: 'carb', name: 'Glycogen', sub: 'quick carbs', pct: glycogenPct, kcal: glycogenLeft, cap: GLYCOGEN_CAP }, { key: 'fat', name: 'Body fat', sub: 'deep reserve', pct: fatPct, kcal: fatLeft, cap: FAT_CAP }] as tank (tank.key)}
			<div class="border-border/70 overflow-hidden rounded-xl border" style="--c: var(--{tank.key});">
				<div class="bg-chamber relative h-44">
					<div
						class="absolute inset-x-0 bottom-0 transition-[height] duration-500 ease-out"
						style="height: {tank.pct}%; background: linear-gradient(to top, var(--c), color-mix(in oklab, var(--c) 60%, transparent));"
					></div>
					<!-- liquid surface shimmer -->
					<div
						class="absolute inset-x-0 transition-[bottom] duration-500"
						style="bottom: calc({tank.pct}% - 2px); height: 3px; background-color: color-mix(in oklab, var(--c) 70%, white);"
					></div>
					<div class="absolute top-2 left-3">
						<p class="font-semibold text-sm text-white/90">{tank.name}</p>
						<p class="font-mono text-[0.65rem] text-white/50">{tank.sub}</p>
					</div>
				</div>
				<div class="px-3 py-2">
					<p class="font-mono text-sm font-semibold">{Math.round(tank.kcal).toLocaleString()}<span class="text-muted-foreground text-xs"> kcal left</span></p>
				</div>
			</div>
		{/each}
	</div>

	<Dial
		bind:value={hours}
		min={0}
		max={6}
		step={0.5}
		label="Hours of hard exercise"
		display="{hours} h"
		accent="var(--energy)"
		showHint
	/>
	<p class="text-muted-foreground text-sm leading-relaxed">{note}</p>
</div>
