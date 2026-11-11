export type Family = 'static' | 'motion' | '3d';

export interface Entry {
  slug: string;
  name: string;
  family: Family;
  description: string;
  /** Exported components whose props tables are shown. */
  exports: string[];
}

export const families: Record<Family, { title: string; entry: string }> = {
  static: { title: 'Static', entry: 'umbra-ui' },
  motion: { title: 'Animated', entry: 'umbra-ui/motion' },
  '3d': { title: '3D', entry: 'umbra-ui/3d' },
};

const e = (family: Family, slug: string, name: string, description: string, exports: string[] = [name]): Entry => ({ slug, name, family, description, exports });

export const registry: Entry[] = [
  e('static', 'button', 'Button', 'Triggers an action. Four variants, three tones, three sizes, loading and icon support.', ['Button', 'IconButton']),
  e('static', 'input', 'Input', 'Single-line text field.'),
  e('static', 'textarea', 'Textarea', 'Multi-line text field.'),
  e('static', 'select', 'Select', 'Picks one value from a list, with groups and typeahead.', ['Select', 'SelectItem', 'SelectGroup']),
  e('static', 'checkbox', 'Checkbox', 'A tri-state checkbox with an optional inline label.'),
  e('static', 'radio', 'Radio', 'A group of mutually exclusive options.', ['RadioGroup', 'Radio']),
  e('static', 'switch', 'Switch', 'Toggles a setting with immediate effect.'),
  e('static', 'form-field', 'FormField', 'Label, description and error wiring for any control.'),
  e('static', 'card', 'Card', 'A bordered surface that groups related content.'),
  e('static', 'badge', 'Badge', 'A compact label for status, counts and categories.'),
  e('static', 'avatar', 'Avatar', "A person's picture with an initials fallback."),
  e('static', 'tabs', 'Tabs', 'Switches between panels of related content.'),
  e('static', 'dialog', 'Dialog', 'A modal window that traps focus.', ['Dialog', 'DialogContent']),
  e('static', 'popover', 'Popover', 'A floating panel anchored to a trigger.', ['Popover', 'PopoverContent']),
  e('static', 'tooltip', 'Tooltip', 'A short hint on hover and keyboard focus.'),
  e('static', 'dropdown-menu', 'DropdownMenu', 'A menu of actions opened from a button.', ['DropdownMenu', 'DropdownMenuItem']),
  e('static', 'table', 'Table', 'A semantic data table with an optional scroll container.', ['Table', 'TableContainer', 'TableHead', 'TableRow']),
  e('static', 'alert', 'Alert', 'An inline message about the state of the page or a task.'),
  e('static', 'skeleton', 'Skeleton', 'A placeholder for content that is loading.'),
  e('static', 'kbd', 'Kbd', 'A keyboard key or shortcut.'),
  e('static', 'divider', 'Divider', 'A 1px rule between sections.'),
  e('static', 'layout', 'Layout', 'Box, Stack, Inline, Grid and Container: spacing from tokens, no custom CSS.', ['Box', 'Stack', 'Inline', 'Grid', 'Container']),
  e('motion', 'shimmer-button', 'ShimmerButton', 'A call-to-action button with a looping shimmer and a glowing gradient border.'),
  e('motion', 'spotlight-card', 'SpotlightCard', 'A card lit by a glow that follows the pointer.'),
  e('motion', 'beam-border', 'BeamBorder', 'A border with a beam of light travelling around it.'),
  e('motion', 'text-reveal', 'TextReveal', 'Reveals a line of text word by word or character by character.'),
  e('motion', 'number-ticker', 'NumberTicker', 'Counts to a number with a spring.'),
  e('motion', 'marquee', 'Marquee', 'An endlessly scrolling row that pauses on hover and focus.'),
  e('motion', 'animated-tabs', 'AnimatedTabs', 'Tabs with an indicator that slides between triggers.'),
  e('motion', 'toast', 'Toast', 'Transient notifications with full keyboard and screen-reader support.', ['Toaster']),
  e('motion', 'command-palette', 'CommandPalette', 'A ⌘K command menu with search, groups and keyboard navigation.'),
  e('motion', 'staggered-list', 'StaggeredList', 'Reveals list items one after another.'),
  e('motion', 'page-transition', 'PageTransition', 'Animates between pages or views.'),
  e('3d', 'hero-scene', 'HeroScene', 'A full-bleed eclipse background for hero sections.'),
  e('3d', 'tilt-card-3d', 'TiltCard3D', 'A card that tilts toward the pointer, with lit shapes in parallax.'),
  e('3d', 'orb', 'Orb', 'A 3D button: a living sphere that reacts to hover and press.'),
  e('3d', 'model-viewer', 'ModelViewer', 'A rotating product viewer with keyboard and on-screen controls.'),
  e('3d', 'logo-3d', 'Logo3D', 'An extruded, lit 3D logo from an SVG path or text.'),
  e('3d', 'particle-field', 'ParticleField', 'A drifting field of particles with depth fog and parallax.'),
];

export const guides = [
  { slug: 'getting-started', name: 'Getting started' },
  { slug: 'theming', name: 'Theming' },
  { slug: 'ssr', name: 'SSR and Next.js' },
];

export const bySlug = (slug: string) => registry.find((r) => r.slug === slug);
