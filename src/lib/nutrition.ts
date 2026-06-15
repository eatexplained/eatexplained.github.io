/**
 * Pure nutrition math. No DOM, no Svelte: just functions that are easy to test
 * and reuse. Everything internal is metric (kg, cm); helpers convert at the edge.
 */

export type Sex = 'male' | 'female';
export type Formula = 'mifflin' | 'katch';

export interface ActivityLevel {
	key: string;
	label: string;
	factor: number;
	hint: string;
}

export const ACTIVITY_LEVELS: ActivityLevel[] = [
	{ key: 'sedentary', label: 'Mostly sitting', factor: 1.2, hint: 'desk job, little exercise' },
	{ key: 'light', label: 'Lightly active', factor: 1.375, hint: 'light exercise 1-3 days/week' },
	{ key: 'moderate', label: 'Moderately active', factor: 1.55, hint: 'exercise 3-5 days/week' },
	{ key: 'active', label: 'Very active', factor: 1.725, hint: 'hard exercise 6-7 days/week' },
	{ key: 'athlete', label: 'Athlete', factor: 1.9, hint: 'physical job or 2x training' }
];

export interface Goal {
	key: string;
	label: string;
	/** multiplier applied to maintenance calories */
	factor: number;
	hint: string;
}

export const GOALS: Goal[] = [
	{ key: 'cut', label: 'Lose fat', factor: 0.8, hint: 'roughly 0.5 kg / week' },
	{ key: 'maintain', label: 'Maintain', factor: 1, hint: 'hold steady' },
	{ key: 'gain', label: 'Build muscle', factor: 1.1, hint: 'slow lean gain' }
];

/** Pounds to kilograms. */
export const lbToKg = (lb: number) => lb * 0.45359237;
/** Inches to centimetres. */
export const inToCm = (inches: number) => inches * 2.54;
/** Feet + inches to centimetres. */
export const ftInToCm = (ft: number, inches: number) => inToCm(ft * 12 + inches);

export interface BmrInput {
	sex: Sex;
	/** body mass in kg */
	weightKg: number;
	/** height in cm */
	heightCm: number;
	age: number;
	/** body-fat fraction 0..1, only used by the Katch-McArdle formula */
	bodyFat?: number;
}

/** Mifflin-St Jeor resting metabolic rate (kcal/day). The modern default. */
export function mifflinStJeor({ sex, weightKg, heightCm, age }: BmrInput): number {
	const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
	return base + (sex === 'male' ? 5 : -161);
}

/** Lean body mass in kg from total mass and body-fat fraction. */
export function leanMass(weightKg: number, bodyFat: number): number {
	return weightKg * (1 - bodyFat);
}

/** Katch-McArdle RMR (kcal/day). More accurate when body-fat % is known. */
export function katchMcArdle({ weightKg, bodyFat = 0.2 }: BmrInput): number {
	return 370 + 21.6 * leanMass(weightKg, bodyFat);
}

export function bmr(input: BmrInput, formula: Formula): number {
	return formula === 'katch' ? katchMcArdle(input) : mifflinStJeor(input);
}

/** Total daily energy expenditure: resting rate scaled by activity. */
export function tdee(restingKcal: number, activityFactor: number): number {
	return restingKcal * activityFactor;
}

export interface MacroGrams {
	protein: number;
	fat: number;
	carb: number;
}

/**
 * A sensible macro split for a calorie target:
 * protein anchored to body mass, fat to a share of calories, carbs fill the rest.
 */
export function macroSplit(
	calories: number,
	weightKg: number,
	proteinPerKg = 1.8,
	fatFraction = 0.25
): MacroGrams {
	const protein = proteinPerKg * weightKg;
	const proteinKcal = protein * 4;
	const fatKcal = calories * fatFraction;
	const fat = fatKcal / 9;
	const carbKcal = Math.max(0, calories - proteinKcal - fatKcal);
	const carb = carbKcal / 4;
	return {
		protein: Math.round(protein),
		fat: Math.round(fat),
		carb: Math.round(carb)
	};
}

export interface CalorieResult {
	bmr: number;
	maintenance: number;
	target: number;
	macros: MacroGrams;
}

export interface CalorieRequest extends BmrInput {
	formula: Formula;
	activityFactor: number;
	goalFactor: number;
	proteinPerKg?: number;
	fatFraction?: number;
}

/** End to end: profile in, full calorie + macro breakdown out (rounded). */
export function calculate(req: CalorieRequest): CalorieResult {
	const restingKcal = bmr(req, req.formula);
	const maintenance = tdee(restingKcal, req.activityFactor);
	const target = maintenance * req.goalFactor;
	return {
		bmr: Math.round(restingKcal),
		maintenance: Math.round(maintenance),
		target: Math.round(target),
		macros: macroSplit(target, req.weightKg, req.proteinPerKg, req.fatFraction)
	};
}
