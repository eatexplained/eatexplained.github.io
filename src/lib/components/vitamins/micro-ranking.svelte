<script lang="ts">
	import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui/toggle-group';
	import InteractiveTag from '$lib/components/lab/interactive-tag.svelte';
	import { inview } from '$lib/actions/inview';

	interface Nutrient {
		name: string;
		tag: string;
		kind: 'Vitamin' | 'Mineral' | 'Fatty acid';
		role: string;
		lift: string;
		foods: string[];
		general: number;
		lifting: number;
	}

	const NUTRIENTS: Nutrient[] = [
		{ name: 'Vitamin D', tag: 'D3', kind: 'Vitamin', role: 'Acts like a hormone for bone, immunity and mood.', lift: 'Deficiency is genuinely common in lifters (little sun, winter) and worth fixing for strength and bone. Topping up beyond a normal level will not boost testosterone, though.', foods: ['Sunlight', 'Salmon', 'Egg yolk', 'Fortified milk'], general: 9, lifting: 10 },
		{ name: 'Omega-3', tag: 'EPA/DHA', kind: 'Fatty acid', role: 'Calms inflammation; builds brain, heart and joints.', lift: 'Eases joint aches and inflammation and may slightly blunt soreness. The old "boosts muscle growth" claim has not held up if your protein is already adequate.', foods: ['Oily fish', 'Fish oil', 'Walnuts', 'Flax'], general: 9, lifting: 9 },
		{ name: 'Magnesium', tag: 'Mg', kind: 'Mineral', role: 'Runs 300+ reactions, including making ATP.', lift: 'Powers contraction and energy, and can improve sleep, mostly noticeable if you were running low to begin with.', foods: ['Nuts', 'Seeds', 'Dark chocolate', 'Spinach'], general: 8, lifting: 9 },
		{ name: 'Zinc', tag: 'Zn', kind: 'Mineral', role: 'Immune defence, hormone production and repair.', lift: 'Important for immunity and hormones, and you lose it through sweat. It only lifts testosterone if you were actually deficient, it is not a booster.', foods: ['Beef', 'Shellfish', 'Pumpkin seeds', 'Lentils'], general: 7, lifting: 8 },
		{ name: 'Iron', tag: 'Fe', kind: 'Mineral', role: 'Carries oxygen around your blood.', lift: 'Low iron quietly tanks endurance and energy. Watch it if you train hard or menstruate.', foods: ['Red meat', 'Liver', 'Lentils', 'Spinach'], general: 8, lifting: 7 },
		{ name: 'Vitamin B12', tag: 'B12', kind: 'Vitamin', role: 'Energy metabolism, red blood cells and nerves.', lift: 'Key for energy and oxygen delivery. Very commonly low on plant-based diets.', foods: ['Meat', 'Fish', 'Eggs', 'Dairy'], general: 7, lifting: 6 },
		{ name: 'Vitamin C', tag: 'C', kind: 'Vitamin', role: 'Builds collagen; antioxidant and immune support.', lift: 'Builds the collagen that keeps tendons strong under load. One catch: do not mega-dose vitamin C (or E) right around training, high doses can blunt the adaptations you trained for.', foods: ['Citrus', 'Peppers', 'Berries', 'Kiwi'], general: 7, lifting: 6 },
		{ name: 'Calcium', tag: 'Ca', kind: 'Mineral', role: 'Bones, plus every single muscle contraction.', lift: 'Strong bones handle heavier loads, and muscles cannot fire without it.', foods: ['Dairy', 'Yoghurt', 'Tofu', 'Leafy greens'], general: 8, lifting: 6 },
		{ name: 'Potassium', tag: 'K', kind: 'Mineral', role: 'Fluid balance, nerve signals and blood pressure.', lift: 'A key electrolyte for nerve and muscle signalling. (Cramps are mostly neuromuscular, not simply low electrolytes.)', foods: ['Banana', 'Potato', 'Beans', 'Avocado'], general: 7, lifting: 6 },
		{ name: 'Iodine', tag: 'I', kind: 'Mineral', role: 'Makes the thyroid hormones that set your metabolism.', lift: 'Thyroid hormones govern how fast you burn energy all day.', foods: ['Iodised salt', 'Seaweed', 'Fish', 'Dairy'], general: 6, lifting: 5 },
		{ name: 'Vitamin A', tag: 'A', kind: 'Vitamin', role: 'Vision, immune system and cell growth.', lift: 'Supports immune function and recovery through hard training blocks.', foods: ['Liver', 'Carrots', 'Sweet potato', 'Eggs'], general: 6, lifting: 4 },
		{ name: 'Vitamin K2', tag: 'K2', kind: 'Vitamin', role: 'Directs calcium into bone, not your arteries.', lift: 'Teams up with D3 to build strong, load-ready bones.', foods: ['Natto', 'Cheese', 'Egg yolk', 'Butter'], general: 5, lifting: 4 }
	];

	type Focus = 'lifting' | 'general';
	let focus = $state<Focus>('lifting');

	const ranked = $derived(
		[...NUTRIENTS].sort((a, b) => b[focus] - a[focus] || b.general + b.lifting - (a.general + a.lifting))
	);

	function tier(score: number) {
		if (score >= 9) return { label: 'Top priority', color: 'var(--vit)' };
		if (score >= 7) return { label: 'Important', color: 'var(--fat)' };
		return { label: 'Worth covering', color: 'var(--muted-foreground)' };
	}
</script>

<div class="border-border/70 bg-card relative overflow-hidden rounded-2xl border shadow-sm">
	<InteractiveTag label="Tap to re-rank" />

	<div class="border-border/70 flex flex-col items-center gap-2 border-b p-4 text-center">
		<p class="text-muted-foreground text-xs">Rank by what matters most for</p>
		<ToggleGroup type="single" bind:value={focus} variant="outline">
			<ToggleGroupItem value="lifting">Building muscle</ToggleGroupItem>
			<ToggleGroupItem value="general">Overall health</ToggleGroupItem>
		</ToggleGroup>
	</div>

	<ul>
		{#each ranked as n, i (n.name)}
			{@const score = n[focus]}
			{@const t = tier(score)}
			<li
				use:inview={{ once: true, threshold: 0.4 }}
				class="ranked-row border-border/60 flex gap-4 border-b p-4 last:border-b-0"
				style="--row-i: {i}; --accent: {t.color};"
			>
				<div class="flex flex-col items-center pt-0.5">
					<span class="font-mono text-lg font-semibold tabular-nums" style="color: var(--accent);">
						{i + 1}
					</span>
				</div>

				<div class="min-w-0 flex-1">
					<div class="flex flex-wrap items-center gap-2">
						<span class="font-semibold">{n.name}</span>
						<span
							class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[0.7rem] leading-none"
						>
							{n.tag}
						</span>
						<span
							class="rounded-full px-2 py-0.5 text-[0.65rem] font-medium"
							style="background-color: color-mix(in oklab, var(--accent) 16%, transparent); color: var(--accent);"
						>
							{t.label}
						</span>
						<span class="text-muted-foreground ml-auto text-[0.65rem] tracking-wide uppercase">
							{n.kind}
						</span>
					</div>

					<!-- importance meter -->
					<div class="bg-muted mt-2 h-1.5 overflow-hidden rounded-full">
						<div
							class="meter h-full rounded-full"
							style="--w: {score * 10}%; background-color: var(--accent);"
						></div>
					</div>

					<p class="text-muted-foreground mt-2 text-sm leading-relaxed">
						{focus === 'lifting' ? n.lift : n.role}
					</p>

					<div class="mt-2 flex flex-wrap gap-1.5">
						{#each n.foods as f (f)}
							<span class="border-border/70 text-muted-foreground rounded-md border px-1.5 py-0.5 text-xs">
								{f}
							</span>
						{/each}
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	.ranked-row {
		opacity: 0;
		transform: translateY(14px);
		transition:
			opacity 0.5s ease,
			transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
		transition-delay: calc(min(var(--row-i), 8) * 35ms);
	}
	.ranked-row:global([data-inview='true']) {
		opacity: 1;
		transform: none;
	}
	.meter {
		width: var(--w);
		transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}
	@media (prefers-reduced-motion: reduce) {
		.ranked-row {
			opacity: 1;
			transform: none;
			transition: none;
		}
		.meter {
			transition: none;
		}
	}
</style>
