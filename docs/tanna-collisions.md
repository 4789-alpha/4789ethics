# Tanna Collision Animations

Tanna symbols in the background collide and highlight each other. The logic is implemented in [`interface/logo-background.js`](../interface/logo-background.js).

To check that collisions work:

1. **Page setup** – A page must contain a `<div id="op_background"></div>` and load `bundle.js`.
   See [`interface/tanna-animation.html`](../interface/tanna-animation.html) lines 7–18.
   Collisions are only visible when this script runs; otherwise the background stays static.
2. **Settings** – With a running server open `settings_OLD.html` to tweak the animation.
   There you can slow it down, adjust fill ratio and symbol size, and set the highlight color via `--collision-color`.
   If no server is active the defaults apply and the color remains yellow.

When the settings are applied and collisions are enabled (`collisionsEnabled` in `logo-background.js`), the overlay draws a yellow circle around colliding symbols.
