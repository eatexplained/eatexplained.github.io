<script lang="ts">
	import InteractiveTag from '$lib/components/lab/interactive-tag.svelte';

	interface Lever {
		id: string;
		label: string;
	}

	const levers: Lever[] = [
		{ id: 'sleep', label: 'Sleeping 7–9h' },
		{ id: 'bodyfat', label: 'Healthy body fat' },
		{ id: 'eating', label: 'Eating enough' },
		{ id: 'lifting', label: 'Lifting weights' },
		{ id: 'stress', label: 'Low chronic stress' }
	];

	let on = $state<Record<string, boolean>>({
		sleep: false,
		bodyfat: false,
		eating: false,
		lifting: false,
		stress: false
	});

	const score = $derived(levers.filter((l) => on[l.id]).length);
	const pct = $derived(15 + (score / levers.length) * 85);

	const verdict = $derived.by(() => {
		if (score <= 1) return 'Low';
		if (score === 2) return 'Below par';
		if (score <= 4) return 'Solid';
		return 'Optimised';
	});

	function toggle(id: string) {
		on[id] = !on[id];
	}
</script>

<div class="border-border/70 bg-card relative overflow-hidden rounded-2xl border shadow-sm">
	<InteractiveTag label="Tap the levers" />

	<div class="p-6 sm:p-8">
		<h3 class="text-lg font-semibold tracking-tight">What actually moves your testosterone</h3>
		<p class="text-muted-foreground mt-1 text-sm">The boring stuff is the real stuff. Turn each lever on.</p>

		<div class="mt-5 flex flex-wrap gap-2">
			{#each levers as l (l.id)}
				<button
					type="button"
					onclick={() => toggle(l.id)}
					aria-pressed={on[l.id]}
					class="lever rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors"
					class:active={on[l.id]}
				>
					{l.label}
				</button>
			{/each}
		</div>

		<!-- gauge -->
		<div class="mt-7">
			<div class="mb-2 flex items-baseline justify-between">
				<span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Testosterone</span>
				<span class="text-sm font-semibold" style="color: var(--fat);">{verdict}</span>
			</div>
			<div class="bg-muted relative h-3 overflow-hidden rounded-full">
				<div
					class="bar h-full rounded-full"
					style="width: {pct}%; background: var(--fat);"
				></div>
			</div>
			<p class="text-muted-foreground mt-2 text-xs">Rough &amp; directional, not a medical readout.</p>
		</div>

		<p class="text-muted-foreground mt-5 text-sm">No pill on the shelf moves it like these do.</p>
	</div>
</div>

<style>
	.lever {
		border-color: var(--border);
		background: transparent;
		color: var(--muted-foreground);
	}
	.lever:hover {
		border-color: color-mix(in oklab, var(--fat) 50%, var(--border));
	}
	.lever.active {
		border-color: var(--fat);
		background: color-mix(in oklab, var(--fat) 16%, transparent);
		color: var(--fat);
	}
	.bar {
		transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}
	@media (prefers-reduced-motion: reduce) {
		.bar {
			transition: none;
		}
	}
</style>
