<script lang="ts">
	import type { Snippet } from 'svelte';

	// A gentle entrance animation. Content is ALWAYS rendered visible; the
	// animation only plays on load, so nothing can get stuck invisible.
	let {
		children,
		delay = 0,
		class: className = ''
	}: { children: Snippet; delay?: number; class?: string } = $props();
</script>

<div class="reveal {className}" style="animation-delay: {delay}ms;">
	{@render children()}
</div>

<style>
	.reveal {
		animation: reveal-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
	}
	@keyframes reveal-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.reveal {
			animation: none;
		}
	}
</style>
