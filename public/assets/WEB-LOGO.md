# Web Logo Derivative

`logo-web-v1.png` is an 800-pixel-wide, aspect-preserving derivative of the approved `logo.png`. It
was generated using macOS
`sips --resampleWidth 800 public/assets/logo.png --out public/assets/logo-web-v1.png`. It retains
transparency and is about 72 KiB, supporting the current largest 400 CSS-pixel placement at 2x
density without runtime image transformation.

Keep `logo.png` and `logo-vertical.png` unchanged for PDF/email consumers. When replacing the brand
artwork, regenerate and version the web derivative, verify transparency and all layouts, and update
the narrow compatibility redirects as needed. The redirects mitigate known legacy paths, not
arbitrary missing-image behavior.
