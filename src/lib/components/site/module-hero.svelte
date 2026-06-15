<script lang="ts">
	import type { ModuleMeta } from '$lib/site';
	import { Badge } from '$lib/components/ui/badge';
	import Clock from '@lucide/svelte/icons/clock';

	let { module }: { module: ModuleMeta } = $props();
</script>

<header class="mx-auto max-w-3xl px-4 pt-12 pb-8 sm:pt-16">
	<div class="text-muted-foreground flex items-center gap-3 text-sm">
		<Badge variant="secondary" class="font-mono">Step {module.index}</Badge>
		<span>{module.kicker}</span>
		<span class="text-border">·</span>
		<span class="inline-flex items-center gap-1.5">
			<Clock class="size-3.5" />
			{module.minutes} min
		</span>
	</div>

	<h1 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{module.title}</h1>
	<p class="text-muted-foreground mt-3 text-lg leading-relaxed">{module.blurb}</p>
</header>
