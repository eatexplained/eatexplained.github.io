<script lang="ts">
	// A small looping diagram of the ATP <-> ADP energy cycle.
</script>

<div class="atp grid place-items-center py-2" aria-label="The ATP and ADP energy cycle">
	<svg viewBox="0 0 220 140" class="w-full max-w-xs">
		<!-- cycle arrows -->
		<path
			class="spin"
			d="M110 22 A 48 48 0 1 1 109 22"
			fill="none"
			stroke="var(--border)"
			stroke-width="2"
			stroke-dasharray="4 5"
		/>
		<!-- ATP coin (charged) -->
		<g transform="translate(110,22)">
			<circle r="18" fill="color-mix(in oklab, var(--energy) 22%, transparent)" stroke="var(--energy)" stroke-width="2" />
			<text text-anchor="middle" dy="4" style="font-size:11px; font-weight:600; fill: var(--energy);">ATP</text>
		</g>
		<!-- ADP coin (spent) -->
		<g transform="translate(110,118)">
			<circle r="16" fill="color-mix(in oklab, var(--muted-foreground) 14%, transparent)" stroke="var(--muted-foreground)" stroke-width="2" />
			<text text-anchor="middle" dy="4" style="font-size:10px; font-weight:600; fill: var(--muted-foreground);">ADP</text>
		</g>
		<!-- labels -->
		<text x="186" y="74" text-anchor="middle" style="font-size:8px; fill: var(--muted-foreground);">spend</text>
		<text x="186" y="84" text-anchor="middle" style="font-size:8px; fill: var(--muted-foreground);">energy</text>
		<text x="30" y="74" text-anchor="middle" style="font-size:8px; fill: var(--muted-foreground);">recharge</text>
		<text x="30" y="84" text-anchor="middle" style="font-size:8px; fill: var(--muted-foreground);">from food</text>

		<!-- travelling spark -->
		<circle class="spark" r="3.5" fill="var(--energy)" />
	</svg>
</div>

<style>
	.atp :global(.spark) {
		offset-path: path('M110 22 A 48 48 0 1 1 109 22');
		animation: travel 3.4s linear infinite;
	}
	@keyframes travel {
		to {
			offset-distance: 100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.atp :global(.spark) {
			animation: none;
			offset-distance: 25%;
		}
	}
</style>
