<script lang="ts">
	// The HPG axis: how testosterone gets made, as an animated signal chain.
	// Hypothalamus -(GnRH)-> Pituitary -(LH)-> Testes (Leydig cells) -> Testosterone,
	// with a dashed negative-feedback loop back to the top.
</script>

<div class="hpg grid place-items-center py-4" aria-label="How testosterone is made: the HPG axis">
	<svg viewBox="0 0 300 380" class="w-full max-w-sm" role="img">
		<!-- connector: hypothalamus -> pituitary -->
		<path id="c1" d="M150 64 L150 112" fill="none" stroke="var(--border)" stroke-width="2" />
		<!-- connector: pituitary -> testes -->
		<path id="c2" d="M150 172 L150 224" fill="none" stroke="var(--border)" stroke-width="2" />
		<!-- connector: testes -> testosterone output -->
		<path id="c3" d="M150 284 L150 318" fill="none" stroke="var(--border)" stroke-width="2" />

		<!-- arrowheads on the down-chain -->
		<path d="M145 106 L150 114 L155 106 Z" fill="var(--fat)" />
		<path d="M145 218 L150 226 L155 218 Z" fill="var(--fat)" />
		<path d="M145 312 L150 320 L155 312 Z" fill="var(--fat)" />

		<!-- dashed negative-feedback loop: testosterone -> hypothalamus -->
		<path
			id="fb"
			d="M210 332 C 282 300, 282 70, 196 46"
			fill="none"
			stroke="var(--muted-foreground)"
			stroke-width="1.5"
			stroke-dasharray="4 4"
			opacity="0.7"
		/>
		<path d="M204 50 L196 46 L201 38 Z" fill="var(--muted-foreground)" opacity="0.7" />

		<!-- node: hypothalamus -->
		<g>
			<rect
				x="80"
				y="14"
				width="140"
				height="44"
				rx="12"
				fill="color-mix(in oklab, var(--fat) 14%, transparent)"
				stroke="var(--fat)"
				stroke-width="2"
			/>
			<text x="150" y="40" text-anchor="middle" style="font-size:13px; font-weight:600; fill: var(--foreground);">Hypothalamus</text>
		</g>

		<!-- node: pituitary -->
		<g>
			<rect
				x="80"
				y="118"
				width="140"
				height="48"
				rx="12"
				fill="color-mix(in oklab, var(--fat) 14%, transparent)"
				stroke="var(--fat)"
				stroke-width="2"
			/>
			<text x="150" y="148" text-anchor="middle" style="font-size:13px; font-weight:600; fill: var(--foreground);">Pituitary</text>
		</g>

		<!-- node: testes / Leydig cells -->
		<g>
			<rect
				x="62"
				y="230"
				width="176"
				height="52"
				rx="12"
				fill="color-mix(in oklab, var(--fat) 14%, transparent)"
				stroke="var(--fat)"
				stroke-width="2"
			/>
			<text x="150" y="252" text-anchor="middle" style="font-size:13px; font-weight:600; fill: var(--foreground);">Testes</text>
			<text x="150" y="269" text-anchor="middle" style="font-size:10px; fill: var(--muted-foreground);">Leydig cells</text>
		</g>

		<!-- output: testosterone -->
		<g transform="translate(150,344)">
			<rect
				x="-70"
				y="-18"
				width="140"
				height="36"
				rx="18"
				fill="var(--fat)"
				opacity="0.95"
			/>
			<text x="0" y="5" text-anchor="middle" style="font-size:13px; font-weight:700; fill: var(--background);">Testosterone</text>
		</g>

		<!-- signal labels on the arrows -->
		<text x="160" y="92" text-anchor="start" style="font-size:11px; font-weight:600; fill: var(--fat);">GnRH</text>
		<text x="160" y="202" text-anchor="start" style="font-size:11px; font-weight:600; fill: var(--fat);">LH</text>
		<!-- feedback label -->
		<text x="290" y="186" text-anchor="end" style="font-size:9px; fill: var(--muted-foreground);">feedback:</text>
		<text x="290" y="198" text-anchor="end" style="font-size:9px; fill: var(--muted-foreground);">enough = slow down</text>

		<!-- travelling pulse dots down each connector -->
		<circle class="pulse p1" r="3.5" fill="var(--fat)" />
		<circle class="pulse p2" r="3.5" fill="var(--fat)" />
		<circle class="pulse p3" r="3.5" fill="var(--fat)" />
	</svg>
</div>

<style>
	.hpg :global(.pulse) {
		animation: travel 2.6s ease-in-out infinite;
	}
	.hpg :global(.p1) {
		offset-path: path('M150 64 L150 112');
	}
	.hpg :global(.p2) {
		offset-path: path('M150 172 L150 224');
		animation-delay: 0.5s;
	}
	.hpg :global(.p3) {
		offset-path: path('M150 284 L150 318');
		animation-delay: 1s;
	}
	@keyframes travel {
		0% {
			offset-distance: 0%;
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			offset-distance: 100%;
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.hpg :global(.pulse) {
			animation: none;
			offset-distance: 50%;
		}
	}
</style>
