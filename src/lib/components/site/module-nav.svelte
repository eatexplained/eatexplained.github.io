<script lang="ts">
	import { base } from '$app/paths';
	import { MODULES } from '$lib/site';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	let { slug }: { slug: string } = $props();

	const i = $derived(MODULES.findIndex((m) => m.slug === slug));
	const prev = $derived(i > 0 ? MODULES[i - 1] : null);
	const next = $derived(i >= 0 && i < MODULES.length - 1 ? MODULES[i + 1] : null);
</script>

<nav class="mx-auto mt-20 grid max-w-3xl gap-3 px-5 sm:grid-cols-2">
	{#if prev}
		<a
			href={base + prev.href}
			class="group border-border/70 hover:border-foreground/30 hover:bg-secondary/40 rounded-xl border p-5 transition-colors"
		>
			<span class="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
				<ArrowLeft class="size-3.5 transition-transform group-hover:-translate-x-0.5" /> Previous
			</span>
			<p class="font-semibold mt-1.5">{prev.title}</p>
		</a>
	{:else}
		<span></span>
	{/if}
	{#if next}
		<a
			href={base + next.href}
			class="group border-border/70 hover:border-foreground/30 hover:bg-secondary/40 rounded-xl border p-5 text-right transition-colors sm:col-start-2"
		>
			<span class="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
				Next <ArrowRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
			</span>
			<p class="font-semibold mt-1.5">{next.title}</p>
		</a>
	{/if}
</nav>
