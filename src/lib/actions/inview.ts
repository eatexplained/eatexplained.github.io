import type { Action } from 'svelte/action';

export interface InviewOptions {
	/** fraction of the element visible before firing (0..1) */
	threshold?: number;
	/** only fire the first time it enters */
	once?: boolean;
	/** rootMargin passed straight to IntersectionObserver */
	rootMargin?: string;
	onchange?: (inview: boolean) => void;
}

/**
 * Toggles a `data-inview` attribute and calls `onchange` as the node enters or
 * leaves the viewport. Used for scroll reveals and the scrollytelling steps.
 * Falls back to "always visible" when IntersectionObserver is unavailable or
 * the user prefers reduced motion.
 */
export const inview: Action<HTMLElement, InviewOptions | undefined> = (node, options) => {
	let opts: InviewOptions = options ?? {};

	const reduced =
		typeof window !== 'undefined' &&
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

	if (typeof IntersectionObserver === 'undefined' || reduced) {
		node.setAttribute('data-inview', 'true');
		opts.onchange?.(true);
		return {
			update(next) {
				opts = next ?? {};
			}
		};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				const visible = entry.isIntersecting;
				node.setAttribute('data-inview', String(visible));
				opts.onchange?.(visible);
				if (visible && opts.once) observer.unobserve(node);
			}
		},
		{ threshold: opts.threshold ?? 0.2, rootMargin: opts.rootMargin ?? '0px' }
	);

	observer.observe(node);

	return {
		update(next) {
			opts = next ?? {};
		},
		destroy() {
			observer.disconnect();
		}
	};
};
