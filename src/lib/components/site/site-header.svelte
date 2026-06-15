<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { NAV_GROUPS } from '$lib/site';
	import ThemeToggle from './theme-toggle.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { cn } from '$lib/utils';

	let mobileOpen = $state(false);

	const isActive = (href: string) => page.url.pathname === base + href;
	const groupActive = (g: (typeof NAV_GROUPS)[number]) => g.modules.some((m) => isActive(m.href));
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') mobileOpen = false;
	}}
/>

<header class="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur">
	<div class="mx-auto flex h-14 max-w-5xl items-center px-4">
		<a href="{base}/" class="mr-6 flex items-center gap-2 font-semibold" onclick={() => (mobileOpen = false)}>
			<span class="bg-primary text-primary-foreground grid size-6 place-items-center rounded text-sm">
				e
			</span>
			eatexplained
		</a>

		<!-- desktop: grouped dropdowns -->
		<nav class="hidden items-center gap-0.5 md:flex">
			{#each NAV_GROUPS as g (g.label)}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class={cn(
							'hover:bg-secondary inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors',
							groupActive(g) ? 'text-foreground font-medium' : 'text-muted-foreground'
						)}
					>
						{g.label}
						<ChevronDown class="size-3.5 opacity-60" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="start" class="w-64">
						{#each g.modules as m (m.slug)}
							<DropdownMenu.Item>
								{#snippet child({ props })}
									<a href={base + m.href} {...props} class={cn(props.class as string, 'cursor-pointer gap-3')}>
										<span
											class="grid size-6 shrink-0 place-items-center rounded font-mono text-xs"
											style="background-color: color-mix(in oklab, {m.accent} 16%, transparent); color: {m.accent};"
										>
											{m.index}
										</span>
										<span class="flex flex-col">
											<span class="text-sm font-medium">{m.title}</span>
										</span>
									</a>
								{/snippet}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/each}
		</nav>

		<div class="ml-auto flex items-center gap-1">
			<ThemeToggle />
			<Button
				variant="ghost"
				size="icon"
				class="md:hidden"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label="Menu"
			>
				{#if mobileOpen}<X class="size-5" />{:else}<Menu class="size-5" />{/if}
			</Button>
		</div>
	</div>

	<!-- mobile: hamburger panel, grouped -->
	{#if mobileOpen}
		<div class="bg-background max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t md:hidden">
			<nav class="mx-auto max-w-5xl space-y-4 px-4 py-4">
				{#each NAV_GROUPS as g (g.label)}
					<div>
						<p class="text-muted-foreground mb-1 px-2 text-xs font-medium tracking-widest uppercase">
							{g.label}
						</p>
						{#each g.modules as m (m.slug)}
							<a
								href={base + m.href}
								onclick={() => (mobileOpen = false)}
								class={cn(
									'flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors',
									isActive(m.href) ? 'bg-secondary' : 'hover:bg-secondary/60'
								)}
							>
								<span
									class="grid size-6 shrink-0 place-items-center rounded font-mono text-xs"
									style="background-color: color-mix(in oklab, {m.accent} 16%, transparent); color: {m.accent};"
								>
									{m.index}
								</span>
								<span class="text-sm font-medium">{m.title}</span>
							</a>
						{/each}
					</div>
				{/each}
			</nav>
		</div>
	{/if}
</header>
