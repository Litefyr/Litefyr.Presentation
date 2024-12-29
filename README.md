# Presentational components for Litefyr

This package contains the presentational components for Litefyr. [Demo](https://litefyr.io)

## Installation

This package is available via [packagist]. Run `composer require litefyr/presentation --no-update` in your
`Litefyr.Distribution` package. After that, run `composer update` in your root directory.

> In order to work correctly you'll need a working [Litefyr] instance running. Here you'll find the basis [Distribution]

### Adjust build stack

And add following packages to `packages.json`

```bash
pnpm add -D alpinejs @alpinejs/focus @alpinejs/intersect @alpinejs/collapse @alpinejs/persist @ryangjchandler/alpine-clipboard alpinejs-textarea-grow @imacrayon/alpine-ajax lazysizes rough-notation lscache
pnpm add tailwindcss @domchristie/tailwind-utopia @tailwindcss/container-queries @tailwindcss/typography @thedutchcoder/postcss-rem-to-px autoprefixer colorjs.io cssnano postcss postcss-assets postcss-clip-path-polyfill postcss-import postcss-reporter postcss-sort-media-queries ts-deepmerge
```

[litefyr]: https://litefyr.io
[distribution]: https://github.com/Litefyr/Distribution
[packagist]: https://packagist.org/packages/litefyr/presentation
