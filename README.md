# eatexplained

Nutrition explained like you're curious, not clueless. An interactive, visual guide to how your
body uses protein, carbs and fat, what happens to a meal, when you burn carbs versus stored fat,
how muscle is built, the hormones involved, and the calorie math, with every claim kept honest.

Live: https://rezk2ll.github.io/eatexplained

## Develop

```sh
pnpm install
pnpm dev
```

Built with SvelteKit, Tailwind and shadcn-svelte. Fully static (`adapter-static`) and deployed to
GitHub Pages by the workflow in `.github/workflows`.

```sh
pnpm test     # unit tests for the nutrition and fuel-mix math
pnpm build    # static site to ./build
```
