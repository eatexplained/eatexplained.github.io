import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Type helpers used by the shadcn-svelte components.
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null;
};
export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, 'child'> : T;
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

/** Clamp `n` into the inclusive range [min, max]. */
export function clamp(n: number, min: number, max: number): number {
	return Math.min(Math.max(n, min), max);
}

/** Map `n` from one range to another, clamped to the output range. */
export function mapRange(
	n: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number
): number {
	const t = (n - inMin) / (inMax - inMin);
	return clamp(outMin + (outMax - outMin) * t, Math.min(outMin, outMax), Math.max(outMin, outMax));
}
