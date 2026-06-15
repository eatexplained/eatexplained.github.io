<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '$lib/components/ui/tooltip';

	// An inline abbreviation with its plain-language meaning on hover or tap.
	let { children, def }: { children: Snippet; def: string } = $props();
</script>

<TooltipProvider delayDuration={100}>
	<Tooltip>
		<TooltipTrigger
			class="text-foreground cursor-help font-semibold underline decoration-dashed decoration-2 underline-offset-[3px]"
		>
			{@render children()}
		</TooltipTrigger>
		<TooltipContent class="max-w-60 text-xs leading-relaxed">
			{def}
		</TooltipContent>
	</Tooltip>
</TooltipProvider>
