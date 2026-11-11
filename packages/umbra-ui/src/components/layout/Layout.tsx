import { forwardRef } from 'react';
import type { CSSProperties, ElementType, HTMLAttributes } from 'react';
import { cssVar, type SpaceToken } from '../../tokens/tokens';
import { cx } from '../../utils/cx';

const space = (v: SpaceToken | undefined) => (v === undefined ? undefined : cssVar(`space-${v}`));

interface PolymorphicProps extends HTMLAttributes<HTMLElement> {
  /** Element or component to render. @default "div" */
  as?: ElementType;
}

/** Props for {@link Box}. */
export interface BoxProps extends PolymorphicProps {
  /** Padding on all sides, as a spacing token step. */
  padding?: SpaceToken;
  /** Horizontal padding; overrides `padding` on that axis. */
  paddingX?: SpaceToken;
  /** Vertical padding; overrides `padding` on that axis. */
  paddingY?: SpaceToken;
  /** Background layer token. */
  surface?: 'bg' | 'bg-subtle' | 'surface-1' | 'surface-2' | 'surface-3';
  /** Corner radius token. */
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  /** Draws the standard 1px border. @default false */
  bordered?: boolean;
}

/** The base layout primitive: a `div` with token-based padding, surface, radius and border. */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  { as: Comp = 'div', padding, paddingX, paddingY, surface, radius, bordered = false, className, style, ...rest },
  ref,
) {
  const s: CSSProperties = {
    padding: space(padding),
    paddingInline: space(paddingX),
    paddingBlock: space(paddingY),
    backgroundColor: surface && cssVar(`color-${surface}`),
    borderRadius: radius && cssVar(`radius-${radius}`),
    ...style,
  };
  return <Comp ref={ref} className={cx('umbra-box', className)} data-bordered={bordered || undefined} style={s} {...rest} />;
});

type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between';
const flex = { start: 'flex-start', end: 'flex-end', between: 'space-between' } as const;
const toFlex = (v: Align | Justify | undefined) => (v && v in flex ? flex[v as keyof typeof flex] : v);

/** Props for {@link Stack}. */
export interface StackProps extends PolymorphicProps {
  /** Space between children, as a spacing token step. @default "4" */
  gap?: SpaceToken;
  /** Cross-axis alignment. @default "stretch" */
  align?: Align;
  /** Main-axis distribution. @default "start" */
  justify?: Justify;
}

/** Lays children out vertically with consistent gaps. */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { as: Comp = 'div', gap = '4', align = 'stretch', justify = 'start', className, style, ...rest },
  ref,
) {
  return (
    <Comp ref={ref} className={cx('umbra-stack', className)} style={{ gap: space(gap), alignItems: toFlex(align), justifyContent: toFlex(justify), ...style }} {...rest} />
  );
});

/** Props for {@link Inline}. */
export interface InlineProps extends PolymorphicProps {
  /** Space between children, as a spacing token step. @default "2" */
  gap?: SpaceToken;
  /** Cross-axis alignment. @default "center" */
  align?: Align;
  /** Main-axis distribution. @default "start" */
  justify?: Justify;
  /** Allow children to wrap onto new lines. @default true */
  wrap?: boolean;
}

/** Lays children out horizontally, wrapping when they run out of room. */
export const Inline = forwardRef<HTMLElement, InlineProps>(function Inline(
  { as: Comp = 'div', gap = '2', align = 'center', justify = 'start', wrap = true, className, style, ...rest },
  ref,
) {
  return (
    <Comp
      ref={ref}
      className={cx('umbra-inline', className)}
      style={{ gap: space(gap), alignItems: toFlex(align), justifyContent: toFlex(justify), flexWrap: wrap ? 'wrap' : 'nowrap', ...style }}
      {...rest}
    />
  );
});

/** Props for {@link Grid}. */
export interface GridProps extends PolymorphicProps {
  /** Fixed number of equal columns, or any `grid-template-columns` value. Ignored when `minItemWidth` is set. @default 1 */
  columns?: number | string;
  /** Responsive mode: fit as many columns as possible, each at least this wide (CSS length). */
  minItemWidth?: string;
  /** Space between cells, as a spacing token step. @default "4" */
  gap?: SpaceToken;
}

/** CSS grid with token gaps; pass `minItemWidth` for a responsive grid with no media queries. */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  { as: Comp = 'div', columns = 1, minItemWidth, gap = '4', className, style, ...rest },
  ref,
) {
  const template = minItemWidth
    ? `repeat(auto-fit, minmax(min(${minItemWidth}, 100%), 1fr))`
    : typeof columns === 'number'
      ? `repeat(${columns}, minmax(0, 1fr))`
      : columns;
  return <Comp ref={ref} className={cx('umbra-grid', className)} style={{ gap: space(gap), gridTemplateColumns: template, ...style }} {...rest} />;
});

/** Props for {@link Container}. */
export interface ContainerProps extends PolymorphicProps {
  /** Maximum content width. @default "lg" */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/** Centers content and caps its width, with side gutters on small screens. */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container({ as: Comp = 'div', size = 'lg', className, ...rest }, ref) {
  return <Comp ref={ref} className={cx('umbra-container', className)} data-size={size} {...rest} />;
});
