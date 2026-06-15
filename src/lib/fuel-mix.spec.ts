import { describe, it, expect } from 'vitest';
import { fatFraction, fuelMix, totalKcalPerMin, crossoverIntensity } from './fuel-mix';

describe('fatFraction', () => {
	it('burns mostly fat at rest when fasted', () => {
		expect(fatFraction({ intensity: 0, insulin: 0, minutes: 0 })).toBeGreaterThan(0.7);
	});

	it('collapses toward carbs at maximum intensity', () => {
		expect(fatFraction({ intensity: 1, insulin: 0, minutes: 0 })).toBeLessThan(0.15);
	});

	it('is suppressed by a recent carb meal (insulin)', () => {
		const fasted = fatFraction({ intensity: 0.4, insulin: 0, minutes: 0 });
		const fed = fatFraction({ intensity: 0.4, insulin: 1, minutes: 0 });
		expect(fed).toBeLessThan(fasted);
	});

	it('rises again with long duration as glycogen drains', () => {
		const early = fatFraction({ intensity: 0.6, insulin: 0, minutes: 0 });
		const late = fatFraction({ intensity: 0.6, insulin: 0, minutes: 90 });
		expect(late).toBeGreaterThan(early);
	});

	it('always stays within [0, 1]', () => {
		for (let i = 0; i <= 1; i += 0.1) {
			for (let ins = 0; ins <= 1; ins += 0.5) {
				const f = fatFraction({ intensity: i, insulin: ins, minutes: 45 });
				expect(f).toBeGreaterThanOrEqual(0);
				expect(f).toBeLessThanOrEqual(1);
			}
		}
	});
});

describe('totalKcalPerMin', () => {
	it('rises monotonically with intensity', () => {
		expect(totalKcalPerMin(1)).toBeGreaterThan(totalKcalPerMin(0.5));
		expect(totalKcalPerMin(0.5)).toBeGreaterThan(totalKcalPerMin(0));
	});
});

describe('fuelMix', () => {
	it('fat and carb fractions sum to 1', () => {
		const m = fuelMix({ intensity: 0.5, insulin: 0.3, minutes: 20 });
		expect(m.fatFraction + m.carbFraction).toBeCloseTo(1, 5);
	});
});

describe('crossoverIntensity', () => {
	it('moves to a lower intensity after a carb meal', () => {
		const fasted = crossoverIntensity(0, 0);
		const fed = crossoverIntensity(1, 0);
		expect(fed).toBeLessThanOrEqual(fasted);
	});
});
