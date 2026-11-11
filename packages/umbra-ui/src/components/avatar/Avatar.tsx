import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Avatar as A } from 'radix-ui';
import { cx } from '../../utils/cx';
import type { Size } from '../internal/types';

/** Props for {@link Avatar}. */
export interface AvatarProps extends Omit<ComponentPropsWithoutRef<typeof A.Root>, 'asChild' | 'children'> {
  /** Image URL. Falls back to initials while loading or on error. */
  src?: string;
  /** Person or entity name. Used for the image alt text and to derive fallback initials. */
  name: string;
  /** Diameter. @default "md" */
  size?: Size;
  /** Outline shape. @default "circle" */
  shape?: 'circle' | 'square';
}

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

/** A person's picture with an initials fallback. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, size = 'md', shape = 'circle', className, ...rest },
  ref,
) {
  return (
    <A.Root ref={ref} className={cx('umbra-avatar', className)} data-size={size} data-shape={shape} {...rest}>
      {src ? <A.Image className="umbra-avatar__image" src={src} alt={name} /> : null}
      <A.Fallback className="umbra-avatar__fallback" role="img" aria-label={name}>
        {initials(name)}
      </A.Fallback>
    </A.Root>
  );
});
