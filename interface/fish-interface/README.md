# Fish Interface

This folder holds the regional interfaces and data sources for ethical fish awareness.
The starting region is Bern, but additional regions can be added under this folder

by supplying new HTML/JS files and corresponding JSON sources in `sources/fish`.
Text placeholders for Swiss fish images reside in `sources/fish/ch/`, named like `esox_ch.png`.

The file `bern-fische.json` lists a small sample of fish found in the canton of
Bern. A national reference list exists in `swiss-fish.json` with the following
fields:

```
{
  "scientific_name": "...",
  "name": "...",
  "origin": "einheimisch" | "NA",
  "status": "LC" | "EN" | ...,
  "in_bern": true | false
}
```

`in_bern` indicates whether the species also appears in `bern-fische.json`.

The page `fischeSchweiz.html` renders the national list for convenient browsing.

The page `gewaesserBern.html` shows a simplified map of the canton Bern with
lakes and the river Aare based on `sources/maps/bern-waters.json`.

The page `gewaesserCH.html` displays a zoomable Leaflet map with
regal and pacht waters for all Swiss cantons using
`sources/maps/swiss-waters.json`.

The goal is to promote respectful and transparent handling of fish populations
worldwide. Contributions should follow the 4789 principles and the
Open-Ethics License.

## Access Control

Editing functions are only available from OP-5 upward once `sana_confirmed` is stored in `localStorage`.
