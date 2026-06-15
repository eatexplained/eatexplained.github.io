import { describe, it, expect } from 'vitest';
import {
	mifflinStJeor,
	katchMcArdle,
	leanMass,
	tdee,
	macroSplit,
	calculate,
	lbToKg,
	ftInToCm
} from './nutrition';

describe('mifflinStJeor', () => {
	it('matches the textbook male example', () => {
		// 80kg, 180cm, 30y male -> 10*80 + 6.25*180 - 5*30 + 5 = 1780
		expect(mifflinStJeor({ sex: 'male', weightKg: 80, heightCm: 180, age: 30 })).toBe(1780);
	});

	it('matches the textbook female example', () => {
		// 60kg, 165cm, 30y female -> 600 + 1031.25 - 150 - 161 = 1320.25
		expect(mifflinStJeor({ sex: 'female', weightKg: 60, heightCm: 165, age: 30 })).toBeCloseTo(
			1320.25,
			2
		);
	});

	it('falls by 5 kcal for every extra year of age', () => {
		const young = mifflinStJeor({ sex: 'male', weightKg: 80, heightCm: 180, age: 30 });
		const older = mifflinStJeor({ sex: 'male', weightKg: 80, heightCm: 180, age: 31 });
		expect(young - older).toBe(5);
	});
});

describe('katchMcArdle', () => {
	it('uses lean mass, so body fat lowers the result', () => {
		const lean = katchMcArdle({ sex: 'male', weightKg: 80, heightCm: 180, age: 30, bodyFat: 0.1 });
		const fatter = katchMcArdle({ sex: 'male', weightKg: 80, heightCm: 180, age: 30, bodyFat: 0.3 });
		expect(lean).toBeGreaterThan(fatter);
		// 370 + 21.6 * (80 * 0.9) = 370 + 1555.2 = 1925.2
		expect(lean).toBeCloseTo(1925.2, 1);
	});

	it('computes lean mass correctly', () => {
		expect(leanMass(100, 0.25)).toBe(75);
	});
});

describe('tdee', () => {
	it('scales resting rate by the activity factor', () => {
		expect(tdee(1800, 1.55)).toBeCloseTo(2790, 5);
	});
});

describe('macroSplit', () => {
	it('hits the calorie target within rounding and anchors protein to body mass', () => {
		const m = macroSplit(2500, 80, 1.8, 0.25);
		expect(m.protein).toBe(Math.round(1.8 * 80));
		const totalKcal = m.protein * 4 + m.carb * 4 + m.fat * 9;
		expect(Math.abs(totalKcal - 2500)).toBeLessThan(15);
	});

	it('never returns negative carbs when protein and fat already exceed the target', () => {
		const m = macroSplit(800, 120, 2.2, 0.35);
		expect(m.carb).toBeGreaterThanOrEqual(0);
	});
});

describe('calculate', () => {
	it('produces maintenance above bmr and a cut below maintenance', () => {
		const r = calculate({
			sex: 'male',
			weightKg: 80,
			heightCm: 180,
			age: 30,
			formula: 'mifflin',
			activityFactor: 1.55,
			goalFactor: 0.8
		});
		expect(r.maintenance).toBeGreaterThan(r.bmr);
		expect(r.target).toBeLessThan(r.maintenance);
	});
});

describe('unit conversions', () => {
	it('converts pounds and feet/inches to metric', () => {
		expect(lbToKg(220)).toBeCloseTo(99.79, 1);
		expect(ftInToCm(5, 11)).toBeCloseTo(180.34, 2);
	});
});
