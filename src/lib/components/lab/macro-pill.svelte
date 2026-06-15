<script lang="ts">
	import type { MacroKey } from '$lib/site';
	import { cn } from '$lib/utils';

	let {
		macro,
		label,
		class: className = ''
	}: { macro: MacroKey; label?: string; class?: string } = $props();

	const names: Record<MacroKey, string> = {
		carb: 'Carbs',
		fat: 'Fat',
		protein: 'Protein'
	};
</script>

<span
	class={cn(
		'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
		className
	)}
	style="background-color: color-mix(in oklab, var(--{macro}) 16%, transparent); color: var(--{macro});"
>
	<span class="size-1.5 rounded-full" style="background-color: var(--{macro});"></span>
	{label ?? names[macro]}
</span>
