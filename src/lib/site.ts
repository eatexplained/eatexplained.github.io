/** Single source of truth for the learning modules and shared nutrition facts. */

export type MacroKey = 'carb' | 'fat' | 'protein';

export interface Macro {
	key: MacroKey;
	name: string;
	/** kcal per gram */
	kcalPerGram: number;
	tagline: string;
	job: string;
	color: string;
}

export const MACROS: Record<MacroKey, Macro> = {
	carb: {
		key: 'carb',
		name: 'Carbohydrate',
		kcalPerGram: 4,
		tagline: 'Fast cash',
		job: 'Quick, ready-to-spend energy. Broken down to glucose and either burned now or stored as glycogen.',
		color: 'var(--carb)'
	},
	protein: {
		key: 'protein',
		name: 'Protein',
		kcalPerGram: 4,
		tagline: 'Building crew',
		job: 'Raw material for muscle, enzymes and repair. Burned for fuel only as a last resort.',
		color: 'var(--protein)'
	},
	fat: {
		key: 'fat',
		name: 'Fat',
		kcalPerGram: 9,
		tagline: 'Savings account',
		job: 'Dense, long-term energy storage plus hormones and cell membranes. Slow to access, nearly limitless.',
		color: 'var(--fat)'
	}
};

export interface ModuleMeta {
	slug: string;
	href: string;
	index: number;
	kicker: string;
	title: string;
	/** short label for the nav bar */
	short: string;
	blurb: string;
	/** css color token used as the page accent */
	accent: string;
	minutes: number;
}

export const MODULES: ModuleMeta[] = [
	{
		slug: 'macros',
		href: '/macros',
		index: 1,
		kicker: 'The cast',
		title: 'Meet the macros',
		short: 'Macros',
		blurb: 'Protein, carbs and fat: what they actually are and the job each one does.',
		accent: 'var(--protein)',
		minutes: 5
	},
	{
		slug: 'vitamins',
		href: '/vitamins',
		index: 2,
		kicker: 'The helpers',
		title: 'Vitamins & minerals',
		short: 'Vitamins',
		blurb: 'The micronutrients that quietly run everything, ranked by how much they matter (especially for building muscle).',
		accent: 'var(--vit)',
		minutes: 6
	},
	{
		slug: 'supplements',
		href: '/supplements',
		index: 3,
		kicker: 'The extras',
		title: 'Supplements that work',
		short: 'Supplements',
		blurb: 'What is actually worth taking, ranked by evidence, and the popular stuff to skip.',
		accent: 'var(--energy)',
		minutes: 5
	},
	{
		slug: 'digestion',
		href: '/digestion',
		index: 4,
		kicker: 'The journey',
		title: 'What happens to food',
		short: 'Digestion',
		blurb: 'Follow a meal from your mouth to your bloodstream and watch it get taken apart.',
		accent: 'var(--carb)',
		minutes: 6
	},
	{
		slug: 'energy',
		href: '/energy',
		index: 5,
		kicker: 'The economy',
		title: 'Energy & storage',
		short: 'Energy',
		blurb: 'ATP, glycogen and body fat: where the fuel goes once it is inside you.',
		accent: 'var(--energy)',
		minutes: 6
	},
	{
		slug: 'switch',
		href: '/switch',
		index: 6,
		kicker: 'The big idea',
		title: 'The carb vs fat switch',
		short: 'Carb vs fat',
		blurb: 'Drag the dials and watch your body choose which fuel to burn. The "fat-burning zone", explained.',
		accent: 'var(--fat)',
		minutes: 8
	},
	{
		slug: 'protein',
		href: '/protein',
		index: 7,
		kicker: 'The build',
		title: 'Protein & building muscle',
		short: 'Protein',
		blurb: 'How muscle is actually built, how much protein you need, and why spreading it across the day matters.',
		accent: 'var(--protein)',
		minutes: 6
	},
	{
		slug: 'hormones',
		href: '/hormones',
		index: 8,
		kicker: 'The messengers',
		title: 'Hormones & testosterone',
		short: 'Hormones',
		blurb: 'How testosterone is made, what it does, and the other hormones that quietly shape your body.',
		accent: 'var(--fat)',
		minutes: 7
	},
	{
		slug: 'calculator',
		href: '/calculator',
		index: 9,
		kicker: 'The numbers',
		title: 'Your calorie calculator',
		short: 'Calculator',
		blurb: 'Estimate the calories you burn in a day, see the formula doing the work, and set a goal.',
		accent: 'var(--carb)',
		minutes: 5
	},
	{
		slug: 'weight',
		href: '/weight',
		index: 10,
		kicker: 'The outcome',
		title: 'Will the weight move?',
		short: 'Weight',
		blurb: 'Turn a daily surplus or deficit into a realistic twelve-week weight trajectory.',
		accent: 'var(--carb)',
		minutes: 4
	}
];

export function moduleBySlug(slug: string): ModuleMeta | undefined {
	return MODULES.find((m) => m.slug === slug);
}

export interface NavGroup {
	label: string;
	modules: ModuleMeta[];
}

/** Grouped navigation buckets for the header. */
export const NAV_GROUPS: NavGroup[] = [
	{ label: 'Food', items: ['macros', 'vitamins', 'supplements'] },
	{ label: 'Your body', items: ['digestion', 'energy', 'switch'] },
	{ label: 'Build muscle', items: ['protein', 'hormones'] },
	{ label: 'Numbers', items: ['calculator', 'weight'] }
].map((g) => ({
	label: g.label,
	modules: g.items.map((s) => moduleBySlug(s)!).filter(Boolean)
}));
