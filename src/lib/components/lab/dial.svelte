<script lang="ts">
	import { Slider } from '$lib/components/ui/slider';
	import MoveHorizontal from '@lucide/svelte/icons/move-horizontal';

	let {
		value = $bindable(),
		min = 0,
		max = 100,
		step = 1,
		label,
		hint,
		display,
		accent = 'var(--carb)'
	}: {
		value: number;
		min?: number;
		max?: number;
		step?: number;
		label: string;
		hint?: string;
		display?: string;
		accent?: string;
	} = $props();
</script>

<div class="dial space-y-2.5" style="--dial-accent: {accent};">
	<div class="flex items-baseline justify-between gap-3">
		<span class="text-sm font-medium">{label}</span>
		<span class="inline-flex items-center gap-1 font-mono text-sm" style="color: var(--dial-accent);">
			<MoveHorizontal class="size-3.5 opacity-70" />
			{display}
		</span>
	</div>
	<Slider type="single" bind:value {min} {max} {step} class="dial-slider" />
	{#if hint}
		<p class="text-muted-foreground text-xs">{hint}</p>
	{/if}
</div>

<style>
	.dial :global(.dial-slider) {
		cursor: pointer;
		padding-block: 0.35rem;
	}
	.dial :global(.dial-slider [data-slot='slider-track']) {
		height: 0.5rem;
		cursor: pointer;
	}
	.dial :global(.dial-slider [data-slot='slider-range']) {
		background-color: var(--dial-accent);
	}
	.dial :global(.dial-slider [data-slot='slider-thumb']) {
		width: 1.35rem;
		height: 1.35rem;
		background-color: var(--dial-accent);
		border: 3px solid var(--card);
		box-shadow:
			0 1px 4px rgb(0 0 0 / 0.28),
			0 0 0 1px var(--border);
		cursor: grab;
		transition: transform 0.12s ease;
		animation: dial-hint 1.7s ease-out 3;
	}
	.dial :global(.dial-slider [data-slot='slider-thumb']:hover) {
		transform: scale(1.12);
	}
	.dial :global(.dial-slider [data-slot='slider-thumb']:active) {
		cursor: grabbing;
		transform: scale(1.05);
	}
	@keyframes dial-hint {
		0% {
			box-shadow:
				0 1px 4px rgb(0 0 0 / 0.28),
				0 0 0 1px var(--border),
				0 0 0 0 color-mix(in oklab, var(--dial-accent) 55%, transparent);
		}
		60%,
		100% {
			box-shadow:
				0 1px 4px rgb(0 0 0 / 0.28),
				0 0 0 1px var(--border),
				0 0 0 10px transparent;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.dial :global(.dial-slider [data-slot='slider-thumb']) {
			animation: none;
		}
	}
</style>
