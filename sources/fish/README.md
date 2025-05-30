# Swiss Fish Lists

This folder stores two JSON sources for fish data and placeholder images.

- `bern-fische.json` – sample list of species from the canton Bern.
  Fields: `name`, `scientific_name`, `type`, `habitat`, `max_cm`, `spawn`, and optional `image` referencing `ch/`.
- `swiss-fish.json` – national overview with
  `scientific_name`, `name`, `origin`, `status`, and `in_bern`.
  The status values follow the usual IUCN codes (LC, EN, VU, etc.).

The `ch/` subfolder contains empty `.png` files used as placeholders for future icons.

## License
The fish lists are released under **CC BY-NC-SA 4.0**.
See [LICENSE.txt](../../LICENSE.txt) and [DISCLAIMERS.md](../../DISCLAIMERS.md).
