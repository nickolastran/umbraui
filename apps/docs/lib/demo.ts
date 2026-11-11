import type { ComponentType, ReactNode } from 'react';

/**
 * Playground controls, by prop name:
 *  - array of strings → select (first item is the default)
 *  - boolean → switch
 *  - string → text field
 * The special key `motion: true` adds a "Motion" switch that maps to `reducedMotion`.
 */
export type Controls = Record<string, readonly string[] | boolean | string>;

export interface Playground {
  controls: Controls;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- each demo narrows its own props
  render: (props: any) => ReactNode;
}

export interface Example {
  title: string;
  description?: string;
  render: () => ReactNode;
}

export interface DemoModule {
  default: ComponentType;
  playground?: Playground;
  examples?: Example[];
}
