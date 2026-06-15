/**
 * A teaching model of fuel selection during activity. It is intentionally
 * simplified (real metabolism is messier) but captures the true shape of the
 * physiology: intensity shifts you toward carbs, recent carbs (insulin)
 * suppresses fat burning, and long duration drains glycogen and nudges you
 * back toward fat. Pure functions, so the switch page and tests share them.
 */

import { clamp } from './utils';

export interface FuelInputs {
	/** exercise intensity, 0 = resting, 1 = all-out effort */
	intensity: number;
	/** recent carb intake / insulin level, 0 = fasted, 1 = just ate a big carby meal */
	insulin: number;
	/** minutes into the activity, drains glycogen over time */
	minutes: number;
}

export interface FuelMix {
	fatFraction: number;
	carbFraction: number;
	totalKcalPerMin: number;
	fatKcalPerMin: number;
	carbKcalPerMin: number;
	fatGramsPerMin: number;
	carbGramsPerMin: number;
}

/** Fraction of energy coming from fat. Carbs make up the rest. */
export function fatFraction({ intensity, insulin, minutes }: FuelInputs): number {
	const i = clamp(intensity, 0, 1);
	const ins = clamp(insulin, 0, 1);

	// Fasted baseline: fat dominates at rest, collapses toward zero near max effort.
	const fasted = 0.78 * Math.pow(1 - i, 1.25) + 0.04;

	// Insulin from a recent carb meal blunts fat oxidation by up to ~55%.
	const insulinDamp = 1 - 0.55 * ins;

	// Glycogen drains with sustained effort, pushing the body back toward fat.
	// Strongest at higher intensities where carbs were being used heavily.
	const depletion = clamp(minutes / 90, 0, 1) * (0.18 * i);

	return clamp(fasted * insulinDamp + depletion, 0.02, 0.97);
}

/** Total energy turnover at a given intensity, kcal per minute. */
export function totalKcalPerMin(intensity: number): number {
	const i = clamp(intensity, 0, 1);
	return 1.2 + 13.8 * Math.pow(i, 1.06);
}

export function fuelMix(inputs: FuelInputs): FuelMix {
	const fat = fatFraction(inputs);
	const carb = 1 - fat;
	const total = totalKcalPerMin(inputs.intensity);
	const fatKcal = total * fat;
	const carbKcal = total * carb;
	return {
		fatFraction: fat,
		carbFraction: carb,
		totalKcalPerMin: total,
		fatKcalPerMin: fatKcal,
		carbKcalPerMin: carbKcal,
		fatGramsPerMin: fatKcal / 9,
		carbGramsPerMin: carbKcal / 4
	};
}

/** The intensity where carbs overtake fat as the main fuel (the "crossover"). */
export function crossoverIntensity(insulin: number, minutes: number): number {
	for (let i = 0; i <= 1.0001; i += 0.01) {
		if (fatFraction({ intensity: i, insulin, minutes }) < 0.5) return i;
	}
	return 1;
}

export interface FuelLabel {
	headline: string;
	detail: string;
}

/** A short plain-language read-out of the current mix. */
export function describeMix(mix: FuelMix, inputs: FuelInputs): FuelLabel {
	const fatPct = Math.round(mix.fatFraction * 100);
	if (inputs.intensity < 0.12) {
		return {
			headline: 'Idling on fat',
			detail: `At rest your body sips mostly fat (${fatPct}%). It is cheap, abundant, and you are not in a hurry.`
		};
	}
	if (mix.fatFraction > 0.5) {
		return {
			headline: 'Fat-leaning',
			detail: `Easy effort: about ${fatPct}% of this energy is fat. You could keep this up for a long time.`
		};
	}
	if (mix.fatFraction > 0.3) {
		return {
			headline: 'Crossing over',
			detail: `Carbs have taken the lead (${100 - fatPct}%). Push harder and fat almost drops out.`
		};
	}
	return {
		headline: 'Carb-powered',
		detail: `Hard effort burns mostly carbs (${100 - fatPct}%). Fat simply cannot be released fast enough.`
	};
}
