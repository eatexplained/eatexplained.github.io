<script lang="ts">
	import { moduleBySlug } from '$lib/site';
	import ModuleHero from '$lib/components/site/module-hero.svelte';
	import ModuleNav from '$lib/components/site/module-nav.svelte';
	import KeyPoint from '$lib/components/lab/key-point.svelte';
	import Abbr from '$lib/components/lab/abbr.svelte';
	import StorageTanks from '$lib/components/energy/storage-tanks.svelte';
	import AtpCycle from '$lib/components/energy/atp-cycle.svelte';
	import * as Card from '$lib/components/ui/card';

	const module = moduleBySlug('energy')!;
</script>

<svelte:head>
	<title>{module.title} — eatexplained</title>
	<meta name="description" content={module.blurb} />
</svelte:head>

<article class="pb-10">
	<ModuleHero {module} />

	<p class="text-muted-foreground mx-auto max-w-3xl px-4 text-lg leading-relaxed">
		Food isn't energy your cells can use directly. It's converted into one universal currency,
		<Abbr def="Adenosine triphosphate. The molecule your cells actually spend to do anything. Think of it as a tiny rechargeable battery.">ATP</Abbr>,
		a tiny rechargeable battery your body spends and refills all day long.
	</p>

	<div class="mx-auto mt-8 max-w-3xl px-4">
		<Card.Root>
			<Card.Content class="flex flex-col items-center gap-2">
				<AtpCycle />
				<p class="text-muted-foreground max-w-md text-center text-sm leading-relaxed">
					<Abbr def="Adenosine triphosphate: the charged battery.">ATP</Abbr> is the charged battery.
					Use it and it becomes <Abbr def="Adenosine diphosphate: the same molecule after it has given up its energy. The 'flat' battery.">ADP</Abbr>,
					the flat version. Energy from food charges it back up. This happens billions of times a second.
				</p>
			</Card.Content>
		</Card.Root>
	</div>

	<p class="text-muted-foreground mx-auto mt-12 max-w-3xl px-4 text-lg leading-relaxed">
		Anything you don't burn right away gets stored in one of two places. Drag the slider and watch
		which one runs out first.
	</p>

	<div class="mx-auto mt-6 max-w-3xl px-4">
		<StorageTanks />
	</div>

	<KeyPoint accent="var(--energy)">
		Your carb tank is tiny (about a day). Your fat tank is enormous (weeks). That's the whole reason
		fat exists: cheap, dense, long-term storage.
	</KeyPoint>

	<ModuleNav slug="energy" />
</article>
