## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

### Carousel images and product names

Before adding, replacing, renaming, or removing carousel images, read
[`docs/carrusel-imagenes.md`](docs/carrusel-imagenes.md). Filenames become visible
product names: use descriptive lowercase names with hyphens. For accents, branded
capitalization, or technical filename suffixes, add an optional exact-filename
override in `public/img-labels.json`, preserving the existing entries. Commit image
and label changes together and verify the synchronized label. Do not edit the
generated `public/img-manifest.json` manually.

### Scheduled header messages

Before adding, changing, or retiring a temporary header message, read
[`docs/mensajes-header.md`](docs/mensajes-header.md). Manage campaigns through
`public/header-messages.json`: use unique IDs and explicit ISO start/end timestamps
with Nicaragua's `-06:00` offset. End times are exclusive. Preserve other scheduled
messages, verify midnight expiration and responsive rendering, and run
`npm run test:header-messages` plus `npm run build`. Do not hardcode campaigns or
change header styles and timers just to schedule a new message.

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
