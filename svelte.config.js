import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

// Base path adapts to wherever GitHub Pages serves this. A user/org site (repo
// named "<name>.github.io") is served from the domain root; a project site lives
// under "/<repo>". On CI we read the repo name from GITHUB_REPOSITORY; local prod
// builds fall back to /eatexplained. Dev and preview stay at the root.
const dev = process.argv.includes('dev');
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = dev || repo?.endsWith('.github.io') ? '' : `/${repo ?? 'eatexplained'}`;

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
			base
		}
	}
};

export default config;
