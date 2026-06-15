<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		accent = 'var(--carb)'
	}: { children: Snippet; accent?: string } = $props();
</script>

<aside class="mx-auto my-10 max-w-3xl px-4" style="--accent: {accent};">
	<div class="border-l-2 pl-5" style="border-color: var(--accent);">
		<p class="text-lg leading-relaxed font-medium tracking-tight text-balance">
			{@render children()}
		</p>
	</div>
</aside>
