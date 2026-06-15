<script lang="ts">
	import Canvas, { type FrameContext } from '$lib/components/lab/canvas.svelte';

	const COLORS = {
		carb: '#f0913f',
		fat: '#4faaca',
		protein: '#d96a60',
		energy: '#d2e069'
	};
	const FUELS = ['carb', 'fat', 'protein'] as const;

	interface Fuel {
		x: number;
		y: number;
		vx: number;
		vy: number;
		r: number;
		color: string;
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
	let fuels: Fuel[] = [];
	let sparks: Spark[] = [];
	let started = false;

	const core = () => ({ x: W * 0.74, y: H * 0.5 });

	function spawnFuel(fromEdge = true): Fuel {
		const kind = FUELS[Math.floor(Math.random() * FUELS.length)];
		return {
			x: fromEdge ? -10 : Math.random() * W * 0.6,
			y: H * (0.18 + Math.random() * 0.64),
			vx: 14 + Math.random() * 16,
			vy: (Math.random() - 0.5) * 6,
			r: 2.4 + Math.random() * 2.6,
			color: COLORS[kind]
		};
	}

	function setup({ width, height }: { width: number; height: number }) {
		W = width;
		H = height;
		if (!started) {
			fuels = Array.from({ length: 34 }, () => spawnFuel(false));
			started = true;
		}
	}

	function frame({ ctx, width, height, dt }: FrameContext) {
		W = width;
		H = height;
		ctx.clearRect(0, 0, W, H);

		const c = core();
		const time = performance.now() / 1000;

		// faint lab grid
		ctx.strokeStyle = 'rgba(255,255,255,0.035)';
		ctx.lineWidth = 1;
		const gap = 34;
		for (let x = (time * 6) % gap; x < W; x += gap) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, H);
			ctx.stroke();
		}

		// the cell core: layered glow + pulse
		const pulse = 1 + Math.sin(time * 2) * 0.06;
		const coreR = Math.min(W, H) * 0.11 * pulse;
		const grd = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, coreR * 2.6);
		grd.addColorStop(0, 'rgba(240,145,63,0.45)');
		grd.addColorStop(0.5, 'rgba(210,224,105,0.12)');
		grd.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = grd;
		ctx.fillRect(c.x - coreR * 2.6, c.y - coreR * 2.6, coreR * 5.2, coreR * 5.2);

		ctx.beginPath();
		ctx.arc(c.x, c.y, coreR, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(20,16,12,0.9)';
		ctx.fill();
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = 'rgba(240,145,63,0.7)';
		ctx.stroke();

		// fuel particles drift toward the core
		for (const f of fuels) {
			const dx = c.x - f.x;
			const dy = c.y - f.y;
			const d = Math.hypot(dx, dy) || 1;
			f.vx += (dx / d) * 26 * dt;
			f.vy += (dy / d) * 26 * dt;
			f.vx *= 0.99;
			f.vy *= 0.99;
			f.x += f.vx * dt;
			f.y += f.vy * dt;

			ctx.beginPath();
			ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
			ctx.fillStyle = f.color;
			ctx.fill();

			if (d < coreR + 4) {
				// convert to an energy burst, then respawn at the left edge
				for (let k = 0; k < 5; k++) {
					const a = Math.random() * Math.PI * 2;
					const sp = 30 + Math.random() * 70;
					sparks.push({
						x: c.x,
						y: c.y,
						vx: Math.cos(a) * sp,
						vy: Math.sin(a) * sp,
						life: 0,
						max: 0.5 + Math.random() * 0.5
					});
				}
				Object.assign(f, spawnFuel(true));
			}
		}

		// energy sparks fly out and fade
		for (let i = sparks.length - 1; i >= 0; i--) {
			const s = sparks[i];
			s.life += dt;
			s.x += s.vx * dt;
			s.y += s.vy * dt;
			s.vx *= 0.96;
			s.vy *= 0.96;
			const a = 1 - s.life / s.max;
			if (a <= 0) {
				sparks.splice(i, 1);
				continue;
			}
			ctx.globalAlpha = a;
			ctx.beginPath();
			ctx.arc(s.x, s.y, 1.6, 0, Math.PI * 2);
			ctx.fillStyle = COLORS.energy;
			ctx.fill();
		}
		ctx.globalAlpha = 1;
		if (sparks.length > 400) sparks.splice(0, sparks.length - 400);
	}
</script>

<div class="bg-chamber relative h-full w-full overflow-hidden">
	<Canvas {frame} {setup} class="h-full w-full" />
	<div class="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-4 py-3">
		<span class="font-mono text-[0.65rem] tracking-wider text-white/40 uppercase">fuel in</span>
		<span class="font-mono text-[0.65rem] tracking-wider text-white/40 uppercase">energy out</span>
	</div>
</div>
