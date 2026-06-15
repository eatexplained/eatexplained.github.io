<script lang="ts">
	/**
	 * A self-managing 2D canvas: handles devicePixelRatio, resize, the
	 * requestAnimationFrame loop and reduced motion. Consumers provide a `frame`
	 * callback that draws one frame; for reduced-motion users a single static
	 * frame is drawn instead of an animation.
	 */
	import { onMount } from 'svelte';

	export interface FrameContext {
		ctx: CanvasRenderingContext2D;
		/** css pixel width / height */
		width: number;
		height: number;
		/** seconds since the loop started */
		t: number;
		/** seconds since the previous frame, capped */
		dt: number;
	}

	let {
		frame,
		setup,
		class: className = ''
	}: {
		frame: (c: FrameContext) => void;
		setup?: (c: { width: number; height: number }) => void;
		class?: string;
	} = $props();

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		let raf = 0;
		let start = 0;
		let prev = 0;
		let width = 0;
		let height = 0;
		let dpr = 1;

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			width = rect.width;
			height = rect.height;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.max(1, Math.round(width * dpr));
			canvas.height = Math.max(1, Math.round(height * dpr));
			setup?.({ width, height });
			if (reduced) renderOnce();
		};

		const renderOnce = () => {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			frame({ ctx, width, height, t: 0, dt: 0 });
		};

		const loop = (now: number) => {
			if (!start) {
				start = now;
				prev = now;
			}
			const t = (now - start) / 1000;
			const dt = Math.min((now - prev) / 1000, 0.05);
			prev = now;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			frame({ ctx, width, height, t, dt });
			raf = requestAnimationFrame(loop);
		};

		const ro = new ResizeObserver(resize);
		ro.observe(canvas);
		resize();

		if (reduced) renderOnce();
		else raf = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
		};
	});
</script>

<canvas bind:this={canvas} class={className} aria-hidden="true"></canvas>
