# TANNA – Layer Structure OP-0 to OP-7

## Project Overview

This folder contains PNG files representing the geometrically and visually refined development stages
of the TANNA symbol from OP-0 to OP-7. Each stage represents an abstract layer or growth level
in a logical, graphical, or systemic tree schema. For OP-8 and higher the design reuses the OP-7 logo,
repeating it horizontally and shifting the hue to indicate progression.
These PNGs are used by [`interface/module-logo.js`](../../../interface/module-logo.js) to show the current OP badge in the page header. The badge is positioned in the top-left corner via the `.op-status-link` rule in [`interface/css/nav.css`](../../../interface/css/nav.css).



---

## File Contents

| File                        | Description                                                        |
|----------------------------|--------------------------------------------------------------------|
| `tanna_op0.png`   | Equilateral triangle, base level OP-0 (dark blue, centered)        |
| `tanna_op1.png`      | OP-0 + trunk (1/3 width, 1/12 height), slightly greener color      |
| `tanna_op2.png` | OP-1 + second triangle (1/2 height), clearly visible layering     |
| `tanna_op3.png` | OP-2 + third triangle, more sharply tapered                      |
| `tanna_op4.png`    | Four-layered structure with refined proportions                    |
| `tanna_op5.png`    | Five layers, visually aligned with OP-7 tapering                   |
| `tanna_op6.png`    | Six-layered version with consistent proportioning                  |
| `tanna_op7.png`    | Final stage of the biological progression – forest green, seven layers |

---

## Technical Details

- **Format**: PNG (transparent)
- **Colors**: Gradient from `#0a2a5e` (dark blue) to `#228B22` (forest green)
- **Scaling**: Base length `a = 300px`
- **Background**: Fully transparent
- **Construction**: Geometrically precise and centered

---

## Notes

- Starting with OP-8 the logo repeats the OP-7 symbol multiple times and shifts the hue for each higher level.
- OP-8 shows two OP-7 logos side by side, OP-9 shows three, and so on.
- The OP-8 version is rendered in neon green.
- Designed with **color-contrast accessibility** in mind (color-blind friendly).
- Structure is suitable for use in **SVG, animation, and generative logic**.
- A sample Node script (`tools/op8-logo-assembler.js`) demonstrates how to
  combine two rotated OP-7 images into an OP-8 variant.

---

**Author**  
4789, May 2025
