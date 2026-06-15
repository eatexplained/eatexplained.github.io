import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

// Served from rezk2ll.github.io/eatexplained on GitHub Pages, so production
// needs that base path. Dev and preview stay at the root.
const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for project files, leave libraries untouched.
		runes: ({ filename }) =>
			filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
	extensions: ['.svelte', '.svx', '.md'],
	kit: {
		adapter: adapter(),
		paths: {
			base: dev ? '' : '/eatexplained'
		}
	}
};

export default config;
