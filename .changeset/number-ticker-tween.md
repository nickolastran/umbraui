---
'umbra-ui': minor
---

`NumberTicker` counts with a 2s ease-out instead of a spring, so it no longer overshoots and bounces at the end. Whole-number counts stay whole between frames, the final width is reserved so layout does not shift as digits appear, and a new `duration` prop sets the length in seconds.
