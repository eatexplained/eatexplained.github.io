<script lang="ts">
	import {
		calculate,
		ACTIVITY_LEVELS,
		GOALS,
		lbToKg,
		inToCm,
		type Sex,
		type Formula
	} from '$lib/nutrition';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui/toggle-group';
	import DeepDive from '$lib/components/lab/deep-dive.svelte';
	import AnimatedNumber from '$lib/components/lab/animated-number.svelte';
	import Abbr from '$lib/components/lab/abbr.svelte';

	type Units = 'metric' | 'imperial';

	let units = $state<Units>('metric');
	let sex = $state<Sex>('male');
	let formula = $state<Formula>('mifflin');
	let age = $state(30);

	// canonical metric values
	let weightKg = $state(75);
	let heightCm = $state(178);
	let bodyFatPct = $state(20);

	// imperial mirrors
	let weightLb = $state(165);
	let heightFt = $state(5);
	let heightIn = $state(10);

	let activityKey = $state('moderate');
	let goalKey = $state('maintain');

	$effect(() => {
		if (units === 'imperial') {
			weightKg = lbToKg(weightLb || 0);
			heightCm = inToCm((heightFt || 0) * 12 + (heightIn || 0));
		}
	});

	const activity = $derived(ACTIVITY_LEVELS.find((a) => a.key === activityKey) ?? ACTIVITY_LEVELS[2]);
	const goal = $derived(GOALS.find((g) => g.key === goalKey) ?? GOALS[1]);

	// Protein target is set by the goal: more in a deficit and for building,
	// less when just maintaining (see proteinPerKg on each goal).
	const result = $derived(
		calculate({
			sex,
			weightKg,
			heightCm,
			age,
			bodyFat: bodyFatPct / 100,
			formula,
			activityFactor: activity.factor,
			goalFactor: goal.factor,
			proteinPerKg: goal.proteinPerKg
		})
	);

	const macroRows = $derived([
		{ key: 'protein', label: 'Protein', g: result.macros.protein, kcal: result.macros.protein * 4 },
		{ key: 'carb', label: 'Carbs', g: result.macros.carb, kcal: result.macros.carb * 4 },
		{ key: 'fat', label: 'Fat', g: result.macros.fat, kcal: result.macros.fat * 9 }
	]);
	const macroTotal = $derived(macroRows.reduce((s, r) => s + r.kcal, 0) || 1);

	const goalDelta = $derived(result.target - result.maintenance);
</script>

<div class="border-border/70 bg-card grid gap-0 overflow-hidden rounded-2xl border shadow-sm lg:grid-cols-[1fr_0.9fr]">
	<!-- inputs -->
	<div class="space-y-6 p-6">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<ToggleGroup type="single" bind:value={units} variant="outline" size="sm">
				<ToggleGroupItem value="metric">Metric</ToggleGroupItem>
				<ToggleGroupItem value="imperial">Imperial</ToggleGroupItem>
			</ToggleGroup>
			<ToggleGroup type="single" bind:value={sex} variant="outline" size="sm">
				<ToggleGroupItem value="male">Male</ToggleGroupItem>
				<ToggleGroupItem value="female">Female</ToggleGroupItem>
			</ToggleGroup>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-1.5">
				<Label for="age">Age</Label>
				<Input id="age" type="number" bind:value={age} min={14} max={100} />
			</div>

			{#if units === 'metric'}
				<div class="space-y-1.5">
					<Label for="w">Weight (kg)</Label>
					<Input id="w" type="number" bind:value={weightKg} min={30} max={250} />
				</div>
				<div class="space-y-1.5">
					<Label for="h">Height (cm)</Label>
					<Input id="h" type="number" bind:value={heightCm} min={120} max={220} />
				</div>
			{:else}
				<div class="space-y-1.5">
					<Label for="wlb">Weight (lb)</Label>
					<Input id="wlb" type="number" bind:value={weightLb} min={66} max={550} />
				</div>
				<div class="space-y-1.5">
					<Label>Height</Label>
					<div class="flex gap-2">
						<Input type="number" bind:value={heightFt} min={3} max={7} aria-label="feet" />
						<Input type="number" bind:value={heightIn} min={0} max={11} aria-label="inches" />
					</div>
				</div>
			{/if}

			{#if formula === 'katch'}
				<div class="space-y-1.5">
					<Label for="bf">Body fat (%)</Label>
					<Input id="bf" type="number" bind:value={bodyFatPct} min={3} max={60} />
				</div>
			{/if}
		</div>

		<div class="space-y-2">
			<Label>Activity</Label>
			<ToggleGroup type="single" bind:value={activityKey} variant="outline" class="flex-wrap justify-start">
				{#each ACTIVITY_LEVELS as a (a.key)}
					<ToggleGroupItem value={a.key} class="text-xs">{a.label}</ToggleGroupItem>
				{/each}
			</ToggleGroup>
			<p class="text-muted-foreground text-xs">{activity.hint}</p>
		</div>

		<div class="space-y-2">
			<Label>Goal</Label>
			<ToggleGroup type="single" bind:value={goalKey} variant="outline" class="justify-start">
				{#each GOALS as g (g.key)}
					<ToggleGroupItem value={g.key} class="text-xs">{g.label}</ToggleGroupItem>
				{/each}
			</ToggleGroup>
			<p class="text-muted-foreground text-xs">
				{goal.hint} · protein {goal.proteinPerKg} g/kg
			</p>
		</div>

		<div class="space-y-2">
			<Label>Formula</Label>
			<ToggleGroup type="single" bind:value={formula} variant="outline" size="sm">
				<ToggleGroupItem value="mifflin">Mifflin-St Jeor</ToggleGroupItem>
				<ToggleGroupItem value="katch">Katch-McArdle</ToggleGroupItem>
			</ToggleGroup>
			<p class="text-muted-foreground text-xs">
				{formula === 'mifflin'
					? 'The modern default. Works from height, weight, age and sex.'
					: 'More accurate if you know your body-fat %, because it works from lean mass.'}
			</p>
		</div>
	</div>

	<!-- results -->
	<div class="bg-secondary/40 border-border/70 flex flex-col gap-5 border-t p-6 lg:border-t-0 lg:border-l">
		<div>
			<p class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
				Daily target
			</p>
			<p class="mt-1 text-5xl font-semibold tracking-tight" style="color: var(--carb);">
				<AnimatedNumber value={result.target} />
				<span class="text-muted-foreground text-xl">kcal</span>
			</p>
			<p class="text-muted-foreground mt-1 text-sm">
				{#if goalDelta === 0}
					maintenance, holding steady
				{:else}
					{goalDelta > 0 ? '+' : ''}{goalDelta} kcal vs maintenance for your goal
				{/if}
			</p>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<div class="border-border/70 rounded-lg border bg-card/60 p-3">
				<p class="font-mono text-xl font-semibold"><AnimatedNumber value={result.bmr} /></p>
				<p class="text-muted-foreground text-xs">
					<Abbr def="Basal metabolic rate: the calories you would burn at complete rest, just keeping your body running.">BMR</Abbr>
					· at rest
				</p>
			</div>
			<div class="border-border/70 rounded-lg border bg-card/60 p-3">
				<p class="font-mono text-xl font-semibold"><AnimatedNumber value={result.maintenance} /></p>
				<p class="text-muted-foreground text-xs">
					Maintenance ·
					<Abbr def="Total daily energy expenditure: your resting burn plus everything you do. These are your real maintenance calories.">TDEE</Abbr>
				</p>
			</div>
		</div>

		<div class="space-y-3">
			<p class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
				A balanced day of macros
			</p>
			<div class="bg-muted flex h-3 overflow-hidden rounded-full">
				{#each macroRows as r (r.key)}
					<div
						class="h-full transition-[width] duration-500"
						style="width: {(r.kcal / macroTotal) * 100}%; background-color: var(--{r.key});"
					></div>
				{/each}
			</div>
			<div class="grid grid-cols-3 gap-2">
				{#each macroRows as r (r.key)}
					<div>
						<div class="flex items-center gap-1.5">
							<span class="size-2 rounded-full" style="background-color: var(--{r.key});"></span>
							<span class="text-xs font-medium">{r.label}</span>
						</div>
						<p class="font-mono text-lg font-semibold">{r.g}<span class="text-muted-foreground text-xs">g</span></p>
					</div>
				{/each}
			</div>
		</div>

		<DeepDive title="Show me the math">
			<p>
				Resting rate, <strong>{formula === 'mifflin' ? 'Mifflin-St Jeor' : 'Katch-McArdle'}</strong>:
			</p>
			{#if formula === 'mifflin'}
				<p>
					<code
						>10 × {weightKg.toFixed(1)}kg + 6.25 × {heightCm.toFixed(0)}cm − 5 × {age}
						{sex === 'male' ? '+ 5' : '− 161'} = {result.bmr} kcal</code
					>
				</p>
			{:else}
				<p>
					<code
						>lean mass = {weightKg.toFixed(1)} × (1 − {(bodyFatPct / 100).toFixed(2)}) =
						{(weightKg * (1 - bodyFatPct / 100)).toFixed(1)}kg</code
					>
				</p>
				<p><code>370 + 21.6 × lean mass = {result.bmr} kcal</code></p>
			{/if}
			<p>
				Then scale by activity to get the day's total: <code
					>{result.bmr} × {activity.factor} = {result.maintenance} kcal</code
				>.
			</p>
			<p>
				Apply the goal: <code>{result.maintenance} × {goal.factor} = {result.target} kcal</code>.
			</p>
		</DeepDive>
	</div>
</div>
