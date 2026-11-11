import { forwardRef, useEffect, useMemo, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import { useInView, useMotionValueEvent, useSpring } from 'motion/react';
import { cx } from '../../utils/cx';
import { motionTokens } from '../presets';
import { useReducedMotion, type ReducedMotionSetting } from '../../utils/reduced-motion';

/** Props for {@link NumberTicker}. */
export interface NumberTickerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Number to count to. Changing it animates from the current value. */
  value: number;
  /** Number to start from. @default 0 */
  from?: number;
  /** `Intl.NumberFormat` options (currency, percent, fraction digits…). */
  format?: Intl.NumberFormatOptions;
  /** BCP 47 locale for formatting. Defaults to the runtime locale. */
  locale?: string;
  /** Start on mount, or when scrolled into view. @default "inView" */
  trigger?: 'mount' | 'inView';
  /** Reduced-motion override. Under reduced motion the final value is shown immediately. @default "system" */
  reducedMotion?: ReducedMotionSetting;
}

/** Counts up (or down) to a number with a spring. Screen readers only ever get the final value. */
export const NumberTicker = forwardRef<HTMLSpanElement, NumberTickerProps>(function NumberTicker(
  { value, from = 0, format, locale, trigger = 'inView', reducedMotion, className, ...rest },
  ref,
) {
  const reduced = useReducedMotion(reducedMotion);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `format` is usually an inline object; compare by content
  const fmt = useMemo(() => new Intl.NumberFormat(locale, format), [locale, JSON.stringify(format)]);
  const text = useRef<HTMLSpanElement>(null);
  const inView = useInView(text, { once: true });
  const spring = useSpring(from, motionTokens.spring.gentle);
  const started = trigger === 'mount' || inView;

  useMotionValueEvent(spring, 'change', (v) => {
    if (text.current) text.current.textContent = fmt.format(v);
  });
  useEffect(() => {
    if (reduced) spring.jump(value);
    else if (started) spring.set(value);
  }, [reduced, started, value, spring]);

  return (
    <span ref={ref} className={cx('umbra-number-ticker', className)} {...rest}>
      <span className="umbra-sr-only">{fmt.format(value)}</span>
      <span ref={text} aria-hidden="true">
        {fmt.format(reduced ? value : from)}
      </span>
    </span>
  );
});
