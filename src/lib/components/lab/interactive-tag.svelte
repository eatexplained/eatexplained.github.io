<script lang="ts">
	import Pointer from '@lucide/svelte/icons/pointer';

	let { label = 'Interactive', class: className = '' }: { label?: string; class?: string } = $props();
</script>

<span
	class="interactive-tag bg-background/85 text-muted-foreground absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur {className}"
>
	<Pointer class="size-3" />
	{label}
</span>

<style>
	.interactive-tag {
		animation: tag-in 0.5s ease both 0.3s;
	}
	@keyframes tag-in {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.interactive-tag {
			animation: none;
		}
	}
</style>
