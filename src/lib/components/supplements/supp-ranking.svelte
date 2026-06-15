<script lang="ts">
	import InteractiveTag from '$lib/components/lab/interactive-tag.svelte';
	import { inview } from '$lib/actions/inview';

	interface Supplement {
		name: string;
		dose: string;
		score: number;
		does: string;
	}

	const SUPPLEMENTS: Supplement[] = [
		{ name: 'Creatine monohydrate', dose: '3–5 g/day', score: 10, does: 'The most proven legal supplement for strength, size and work capacity. Cheap and safe; no need to load.' },
		{ name: 'Caffeine', dose: '3–6 mg/kg pre', score: 9, does: 'Reliably boosts strength, endurance, focus and perceived effort. Time it ~45 min before training.' },
		{ name: 'Protein powder (whey/casein/soy)', dose: 'as needed', score: 8, does: 'Not magic, just a convenient way to hit your daily protein target. Real food works just as well.' },
		{ name: 'Beta-alanine', dose: '3–5 g/day', score: 7, does: 'Buffers muscle acid; helps higher-rep and 1–4 minute efforts. Causes harmless tingling.' },
		{ name: 'Citrulline malate', dose: '6–8 g pre', score: 5, does: 'May modestly help pumps, blood flow and reps. Evidence is mixed but it is low-risk.' },
		{ name: 'Vitamin D (only if low)', dose: '1,000–2,000 IU', score: 5, does: 'Worth it if you are actually deficient; not a performance booster if your levels are fine.' },
		{ name: 'Omega-3 (fish oil)', dose: '1–2 g EPA+DHA', score: 5, does: 'Mostly a health and joint play, with minor recovery benefit. Not a muscle builder.' },
		{ name: 'BCAAs', dose: '—', score: 2, does: 'Redundant if you eat enough total protein, which already contains them. Mostly flavoured marketing.' },
		{ name: 'Glutamine', dose: '—', score: 2, does: "Popular but does basically nothing for healthy lifters' muscle or recovery." },
		{ name: "'Testosterone boosters' (tribulus, etc.)", dose: '—', score: 1, does: 'They do not raise testosterone in healthy men. Save your money.' },
		{ name: 'Fat burners', dose: '—', score: 1, does: 'A little caffeine plus filler and big claims. The deficit burns the fat, not the pill.' }
	];

	function tier(score: number) {
		if (score >= 8) return { label: 'Strong evidence', color: 'var(--energy)' };
		if (score >= 5) return { label: 'Situational', color: 'var(--fat)' };
		return { label: 'Skip it', color: 'var(--muted-foreground)' };
	}
</script>

<div class="border-border/70 bg-card relative overflow-hidden rounded-2xl border shadow-sm">
	<InteractiveTag label="Ranked by evidence" />

	<ul>
		{#each SUPPLEMENTS as s, i (s.name)}
			{@const t = tier(s.score)}
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
						<span class="font-semibold">{s.name}</span>
						<span
							class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[0.7rem] leading-none"
						>
							{s.dose}
						</span>
						<span
							class="rounded-full px-2 py-0.5 text-[0.65rem] font-medium"
							style="background-color: color-mix(in oklab, var(--accent) 16%, transparent); color: var(--accent);"
						>
							{t.label}
						</span>
					</div>

					<!-- evidence meter -->
					<div class="bg-muted mt-2 h-1.5 overflow-hidden rounded-full">
						<div
							class="meter h-full rounded-full"
							style="--w: {s.score * 10}%; background-color: var(--accent);"
						></div>
					</div>

					<p class="text-muted-foreground mt-2 text-sm leading-relaxed">
						{s.does}
					</p>

					<p class="text-muted-foreground mt-1.5 text-xs">
						Dose: <span class="text-foreground font-medium">{s.dose}</span>
					</p>
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
