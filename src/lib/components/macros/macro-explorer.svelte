<script lang="ts">
	import { MACROS, type MacroKey } from '$lib/site';
	import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui/toggle-group';
	import Molecule from './molecule.svelte';
	import InteractiveTag from '$lib/components/lab/interactive-tag.svelte';

	let selected = $state<MacroKey>('carb');

	const details: Record<
		MacroKey,
		{ brokenInto: string; storedAs: string; foods: string[]; analogy: string }
	> = {
		carb: {
			brokenInto: 'glucose (blood sugar)',
			storedAs: 'glycogen in muscle & liver',
			foods: ['Bread & rice', 'Fruit', 'Oats', 'Potatoes'],
			analogy: 'Cash in your pocket: easy to spend right now, but you can only carry so much.'
		},
		protein: {
			brokenInto: 'amino acids',
			storedAs: 'no real store — used or recycled',
			foods: ['Eggs', 'Chicken', 'Lentils', 'Yoghurt'],
			analogy: 'A construction crew: there to build and repair, not to be burned for heat.'
		},
		fat: {
			brokenInto: 'fatty acids & glycerol',
			storedAs: 'body fat (almost unlimited)',
			foods: ['Olive oil', 'Nuts', 'Avocado', 'Salmon'],
			analogy: 'A savings account: dense and huge, but slower to withdraw from.'
		}
	};

	const macro = $derived(MACROS[selected]);
	const info = $derived(details[selected]);
	// energy-density bar: fat is 9 kcal/g, carbs & protein 4. Scale to the max.
	const barPct = $derived((macro.kcalPerGram / 9) * 100);
</script>

<div class="border-border/70 bg-card relative overflow-hidden rounded-2xl border shadow-sm">
	<InteractiveTag label="Tap to switch" />
	<div class="border-border/70 flex items-center justify-center border-b p-3">
		<ToggleGroup type="single" bind:value={selected} variant="outline">
			<ToggleGroupItem value="carb">Carbs</ToggleGroupItem>
			<ToggleGroupItem value="protein">Protein</ToggleGroupItem>
			<ToggleGroupItem value="fat">Fat</ToggleGroupItem>
		</ToggleGroup>
	</div>

	<div class="grid gap-0 md:grid-cols-2">
		<!-- molecule stage -->
		<div
			class="relative grid min-h-56 place-items-center p-6"
			style="background: radial-gradient(80% 80% at 50% 40%, color-mix(in oklab, var(--{selected}) 12%, transparent), transparent);"
		>
			{#key selected}
				<div class="w-full animate-[fade_0.4s_ease]">
					<Molecule macro={selected} />
				</div>
			{/key}
			<span
				class="absolute bottom-3 font-mono text-xs"
				style="color: var(--{selected});">{macro.name.toLowerCase()}</span
			>
		</div>

		<!-- facts -->
		<div class="border-border/70 space-y-4 border-t p-6 md:border-t-0 md:border-l">
			<div class="flex items-baseline justify-between">
				<h3 class="font-semibold text-2xl" style="color: var(--{selected});">
					{macro.name}
				</h3>
				<span
					class="rounded-full px-2.5 py-0.5 text-xs font-medium"
					style="background-color: color-mix(in oklab, var(--{selected}) 16%, transparent); color: var(--{selected});"
				>
					{macro.tagline}
				</span>
			</div>

			<p class="text-muted-foreground text-sm leading-relaxed">{info.analogy}</p>

			<div class="space-y-1.5 text-sm">
				<div class="flex justify-between gap-3">
					<span class="text-muted-foreground">Broken down into</span>
					<span class="text-right font-medium">{info.brokenInto}</span>
				</div>
				<div class="flex justify-between gap-3">
					<span class="text-muted-foreground">Stored as</span>
					<span class="text-right font-medium">{info.storedAs}</span>
				</div>
			</div>

			<div>
				<div class="mb-1 flex items-center justify-between text-xs">
					<span class="text-muted-foreground">Energy density</span>
					<span class="font-mono font-medium" style="color: var(--{selected});">
						{macro.kcalPerGram} kcal / gram
					</span>
				</div>
				<div class="bg-muted h-2.5 overflow-hidden rounded-full">
					<div
						class="h-full rounded-full transition-[width] duration-500"
						style="width: {barPct}%; background-color: var(--{selected});"
					></div>
				</div>
				{#if selected === 'fat'}
					<p class="text-muted-foreground mt-1.5 text-xs">
						Fat packs more than double the energy per gram, which is why it is such efficient storage.
					</p>
				{/if}
			</div>

			<div class="flex flex-wrap gap-1.5">
				{#each info.foods as f (f)}
					<span class="border-border/70 rounded-md border px-2 py-0.5 text-xs">{f}</span>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes fade {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
</style>
