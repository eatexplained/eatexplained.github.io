<script lang="ts">
	import { Slider } from '$lib/components/ui/slider';
	import MoveHorizontal from '@lucide/svelte/icons/move-horizontal';
	import Pointer from '@lucide/svelte/icons/pointer';

	let {
		value = $bindable(),
		min = 0,
		max = 100,
		step = 1,
		label,
		hint,
		display,
		accent = 'var(--carb)',
		showHint = false
	}: {
		value: number;
		min?: number;
		max?: number;
		step?: number;
		label: string;
		hint?: string;
		display?: string;
		accent?: string;
		showHint?: boolean;
	} = $props();

	// Once the user moves the dial, the "drag" affordance has done its job.
	const initial = value;
	let hintGone = $state(false);
	$effect(() => {
		if (value !== initial) hintGone = true;
	});
</script>

<div class="dial space-y-2.5" style="--dial-accent: {accent};">
	<div class="flex items-baseline justify-between gap-3">
		<span class="text-sm font-medium">{label}</span>
		<span class="inline-flex items-center gap-1 font-mono text-sm" style="color: var(--dial-accent);">
			<MoveHorizontal class="size-3.5 opacity-70" />
			{display}
		</span>
	</div>
	<div class="relative">
		{#if showHint && !hintGone}
			<span
				class="drag-hint bg-background/90 text-muted-foreground pointer-events-none absolute -top-1 left-1/2 z-10 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur"
			>
				<Pointer class="size-3" />
				Drag to explore
			</span>
		{/if}
		<Slider type="single" bind:value {min} {max} {step} class="dial-slider" />
	</div>
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

	/* "Drag to explore" pill, anchored above the slider track (not over the readout) */
	.drag-hint {
		transform: translate(-50%, -100%);
		animation: hint-in 0.45s ease both 0.25s;
	}
	.drag-hint::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 5px solid transparent;
		border-top-color: var(--border);
	}
	@keyframes hint-in {
		from {
			opacity: 0;
			transform: translate(-50%, calc(-100% + 5px));
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.drag-hint {
			animation: none;
		}
	}
</style>
