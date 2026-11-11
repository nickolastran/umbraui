import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { Slot } from 'radix-ui';
import { cx } from '../../utils/cx';

/** Props for {@link Card}. */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** `surface` is a filled layer, `outline` is border only, `ghost` has neither. @default "surface" */
  variant?: 'surface' | 'outline' | 'ghost';
  /** Inner padding. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Adds hover and focus affordances for cards that act as a link or button. @default false */
  interactive?: boolean;
  /** Render the single child element (e.g. an `<a>`) as the card. @default false */
  asChild?: boolean;
}

/** A bordered surface that groups related content one elevation step above the page. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'surface', size = 'md', interactive = false, asChild = false, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp ref={ref} className={cx('umbra-card', className)} data-variant={variant} data-size={size} data-interactive={interactive || undefined} {...rest} />
  );
});

const part = <T extends keyof HTMLElementTagNameMap>(tag: T, name: string, cls: string) => {
  const Tag = tag as string;
  const C = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(({ className, ...rest }, ref) => (
    // @ts-expect-error -- generic intrinsic tag; ref type is narrowed by the cast below
    <Tag ref={ref} className={cx(cls, className)} {...rest} />
  ));
  C.displayName = name;
  return C as unknown as React.ForwardRefExoticComponent<HTMLAttributes<HTMLElementTagNameMap[T]> & React.RefAttributes<HTMLElementTagNameMap[T]>>;
};

/** Props shared by the Card layout parts. */
export type CardSectionProps = HTMLAttributes<HTMLDivElement>;
/** Top section of a Card: title, description and optional actions. */
export const CardHeader = part('div', 'CardHeader', 'umbra-card__header');
/** Card heading. Renders an `<h3>`. */
export const CardTitle = part('h3', 'CardTitle', 'umbra-card__title');
/** Secondary text under the title. */
export const CardDescription = part('p', 'CardDescription', 'umbra-card__description');
/** Main body of a Card. */
export const CardContent = part('div', 'CardContent', 'umbra-card__content');
/** Bottom row of a Card, typically actions. */
export const CardFooter = part('div', 'CardFooter', 'umbra-card__footer');
