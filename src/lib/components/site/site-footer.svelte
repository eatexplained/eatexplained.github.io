<script lang="ts">
	import { base } from '$app/paths';
	import { MODULES } from '$lib/site';
</script>

<footer class="mt-20 border-t">
	<div class="text-muted-foreground mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 text-sm sm:flex-row sm:items-start sm:justify-between">
		<div class="max-w-xs">
			<p class="text-foreground font-semibold">eatexplained</p>
			<p class="mt-2 leading-relaxed">
				Nutrition explained simply, with visuals you can play with. Educational only, not medical
				advice.
			</p>
		</div>
		<nav class="flex flex-wrap gap-x-6 gap-y-2">
			{#each MODULES as m (m.slug)}
				<a href={base + m.href} class="hover:text-foreground transition-colors">{m.title}</a>
			{/each}
		</nav>
	</div>
</footer>
