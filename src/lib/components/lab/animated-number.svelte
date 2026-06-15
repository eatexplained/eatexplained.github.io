<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let {
		value,
		duration = 600,
		format = (n: number) => Math.round(n).toLocaleString()
	}: { value: number; duration?: number; format?: (n: number) => string } = $props();

	// svelte-ignore state_referenced_locally
	const tween = new Tween(value, { duration, easing: cubicOut });

	$effect(() => {
		tween.set(value);
	});
</script>

<span class="tabular-nums">{format(tween.current)}</span>
