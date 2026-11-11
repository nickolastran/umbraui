# umbra-ui

## 0.2.0

### Minor Changes

- bb5295c: `NumberTicker` counts with a 2s ease-out instead of a spring, so it no longer overshoots and bounces at the end. Whole-number counts stay whole between frames, the final width is reserved so layout does not shift as digits appear, and a new `duration` prop sets the length in seconds.
- db9de27: Controls are larger on touch screens. Under `(pointer: coarse)`, `--umbra-size-sm/md/lg` grow from 28/32/40px to 36/44/48px, so buttons, inputs, tabs and menu items meet the 44px touch-target guideline. Avatars and circle skeletons keep their desktop sizes.

## 0.1.0

### Minor Changes

- 94300fb: Initial release: design tokens, ThemeProvider, static components (`umbra-ui`), animated components (`umbra-ui/motion`) and 3D components (`umbra-ui/3d`).
