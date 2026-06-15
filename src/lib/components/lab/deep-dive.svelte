<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import FlaskConical from '@lucide/svelte/icons/flask-conical';

	let { title = 'Go deeper', children }: { title?: string; children: Snippet } = $props();
	let open = $state(false);
</script>

<div class="border-border/70 bg-secondary/40 my-6 overflow-hidden rounded-lg border">
	<button
		class="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-secondary/70"
		onclick={() => (open = !open)}
		aria-expanded={open}
	>
		<FlaskConical class="text-primary size-4 shrink-0" />
		<span class="flex-1">{title}</span>
		<ChevronDown class="size-4 shrink-0 transition-transform duration-300 {open ? 'rotate-180' : ''}" />
	</button>
	{#if open}
		<div transition:slide={{ duration: 260 }} class="border-border/60 border-t">
			<div class="text-muted-foreground prose-deep px-4 py-4 text-sm leading-relaxed">
				{@render children()}
			</div>
		</div>
	{/if}
</div>

<style>
	.prose-deep :global(p + p) {
		margin-top: 0.75rem;
	}
	.prose-deep :global(code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
		background-color: color-mix(in oklab, var(--foreground) 8%, transparent);
		padding: 0.1em 0.4em;
		border-radius: 0.3rem;
	}
	.prose-deep :global(strong) {
		color: var(--foreground);
		font-weight: 600;
	}
</style>
