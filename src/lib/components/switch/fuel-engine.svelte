<script lang="ts">
	import Canvas, { type FrameContext } from '$lib/components/lab/canvas.svelte';

	// live fuel burn, kcal/min for each fuel + total
	let {
		carbKcal,
		fatKcal,
		total
	}: { carbKcal: number; fatKcal: number; total: number } = $props();

	const CARB = '#e0791a';
	const FAT = '#2f86ab';

	interface Block {
		x: number;
		lane: 'carb' | 'fat';
	}
	interface Spark {
		x: number;
		y: number;
		vx: number;
		vy: number;
		life: number;
		max: number;
	}

	let W = 0;
	let H = 0;
	let blocks: Block[] = [];
	let sparks: Spark[] = [];
	let carbAcc = 0;
	let fatAcc = 0;

	const laneY = (lane: 'carb' | 'fat') => (lane === 'carb' ? H * 0.32 : H * 0.68);
	const trackX0 = () => W * 0.22;
	const ENGINE_X = 0.72;
	const ENGINE_W = 0.18;
	const engineX = () => W * ENGINE_X;

	function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
		ctx.beginPath();
		ctx.roundRect(x, y, w, h, r);
	}

	function setup({ width, height }: { width: number; height: number }) {
		W = width;
		H = height;
	}

	function frame({ ctx, width, height, t, dt }: FrameContext) {
		W = width;
		H = height;
		ctx.clearRect(0, 0, W, H);

		const intensity = Math.min(1, total / 15);
		const ex = engineX();
		const laneH = H * 0.16;
		const blockW = W * 0.035;
		const speed = 50 + intensity * 150;

		// tracks
		for (const lane of ['carb', 'fat'] as const) {
			const y = laneY(lane);
			const col = lane === 'carb' ? CARB : FAT;
			roundRect(ctx, trackX0(), y - laneH / 2, ex - trackX0() + W * 0.01, laneH, laneH / 2);
			ctx.fillStyle = `color-mix(in srgb, ${col} 12%, transparent)`;
			ctx.fill();
		}

		// spawn proportional to each fuel's burn rate
		carbAcc += carbKcal * 0.5 * dt;
		fatAcc += fatKcal * 0.5 * dt;
		while (carbAcc >= 1) {
			carbAcc -= 1;
			blocks.push({ x: trackX0(), lane: 'carb' });
		}
		while (fatAcc >= 1) {
			fatAcc -= 1;
			blocks.push({ x: trackX0(), lane: 'fat' });
		}
		if (blocks.length > 400) blocks.splice(0, blocks.length - 400);

		// move + draw blocks
		const laneBH = laneH * 0.62;
		for (let i = blocks.length - 1; i >= 0; i--) {
			const b = blocks[i];
			b.x += speed * dt;
			if (b.x >= ex - blockW) {
				blocks.splice(i, 1);
				// combustion sparks at the engine mouth
				for (let k = 0; k < 3; k++) {
					sparks.push({
						x: ex,
						y: H / 2 + (Math.random() - 0.5) * H * 0.3,
						vx: 20 + Math.random() * 50,
						vy: -30 + Math.random() * -40,
						life: 0,
						max: 0.5 + Math.random() * 0.4
					});
				}
				continue;
			}
			const y = laneY(b.lane);
			roundRect(ctx, b.x, y - laneBH / 2, blockW, laneBH, 3);
			ctx.fillStyle = b.lane === 'carb' ? CARB : FAT;
			ctx.fill();
		}

		// the engine / muscle
		const pulse = 1 + Math.sin(t * (2 + intensity * 5)) * 0.04 * (0.4 + intensity);
		const ew = W * ENGINE_W;
		const eh = H * 0.62 * pulse;
		const eyTop = H / 2 - eh / 2;
		const glow = ctx.createRadialGradient(ex + ew / 2, H / 2, 0, ex + ew / 2, H / 2, ew * 1.6);
		glow.addColorStop(0, `rgba(224,121,26,${0.12 + intensity * 0.3})`);
		glow.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = glow;
		ctx.fillRect(ex - ew, eyTop - ew, ew * 3, eh + ew * 2);

		roundRect(ctx, ex, eyTop, ew, eh, 10);
		ctx.fillStyle = '#2a2118';
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.strokeStyle = `rgba(224,121,26,${0.5 + intensity * 0.5})`;
		ctx.stroke();

		// energy sparks rising out of the engine
		if (Math.random() < intensity * 0.9 + 0.05) {
			sparks.push({
				x: ex + ew / 2 + (Math.random() - 0.5) * ew * 0.6,
				y: eyTop,
				vx: (Math.random() - 0.5) * 20,
				vy: -50 - Math.random() * 60,
				life: 0,
				max: 0.6 + Math.random() * 0.5
			});
		}
		for (let i = sparks.length - 1; i >= 0; i--) {
			const s = sparks[i];
			s.life += dt;
			const k = s.life / s.max;
			if (k >= 1) {
				sparks.splice(i, 1);
				continue;
			}
			s.x += s.vx * dt;
			s.y += s.vy * dt;
			ctx.globalAlpha = 1 - k;
			ctx.beginPath();
			ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
			ctx.fillStyle = '#d8c24a';
			ctx.fill();
		}
		ctx.globalAlpha = 1;
		if (sparks.length > 300) sparks.splice(0, sparks.length - 300);
	}
</script>

<div class="bg-secondary/30 relative h-full w-full overflow-hidden">
	<Canvas {frame} {setup} class="h-full w-full" />
</div>
