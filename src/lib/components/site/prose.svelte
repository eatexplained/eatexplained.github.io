<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let { children, class: className = '' }: { children: Snippet; class?: string } = $props();
</script>

<div class={cn('mx-auto max-w-2xl px-4', className)}>
	<div class="reading">
		{@render children()}
	</div>
</div>

<style>
	.reading {
		font-size: 1.0625rem;
		line-height: 1.7;
	}
	.reading :global(p) {
		margin-block: 1rem;
		color: var(--muted-foreground);
	}
	.reading :global(h2) {
		font-size: 1.5rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		margin-top: 2.5rem;
		margin-bottom: 0.5rem;
		color: var(--foreground);
	}
	.reading :global(h3) {
		font-size: 1.15rem;
		font-weight: 600;
		margin-top: 1.75rem;
		margin-bottom: 0.35rem;
		color: var(--foreground);
	}
	.reading :global(strong) {
		font-weight: 600;
		color: var(--foreground);
	}
	.reading :global(a) {
		color: var(--foreground);
		text-underline-offset: 3px;
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}
	.reading :global(ul) {
		margin-block: 1rem;
		padding-left: 1.25rem;
		list-style: disc;
	}
	.reading :global(li) {
		margin-block: 0.5rem;
		padding-left: 0.25rem;
		color: var(--muted-foreground);
	}
	.reading :global(li)::marker {
		color: var(--border);
	}
	.reading :global(.lead) {
		font-size: 1.3rem;
		line-height: 1.5;
		color: var(--foreground);
		font-weight: 500;
		letter-spacing: -0.01em;
	}
</style>
