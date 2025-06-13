# Tanna Collision Animations

Tanna symbols in the background collide and highlight each other. The logic is implemented in [`interface/logo-background.js`](../interface/logo-background.js).

To check that collisions work:

1. **Page setup** – A page must contain a `<div id="op_background"></div>` and load `bundle.js`.
   See [`interface/tanna-animation.html`](../interface/tanna-animation.html) lines 7–18.
2. **Local settings** – The low-motion option slows the animation.
   Adjust via [`interface/settings_OLD.html`](../interface/settings_OLD.html) lines 284–289.
3. **Fill ratio and symbol size** – Increase these values if collisions are rare.
   They are stored as `ethicom_bg_fill` and `ethicom_bg_symbol_size`.
   See [`interface/settings_OLD.html`](../interface/settings_OLD.html) lines 208–221 and 259–268.

When the settings are applied and collisions are enabled (`collisionsEnabled` in `logo-background.js`), the overlay draws a yellow circle around colliding symbols.
