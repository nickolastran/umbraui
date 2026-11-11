import { forwardRef, useEffect, useMemo, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import { animate, useInView, useMotionValue, useMotionValueEvent } from 'motion/react';
import { cx } from '../../utils/cx';
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
  /** Seconds the count takes. @default 2 */
  duration?: number;
  /** Start on mount, or when scrolled into view. @default "inView" */
  trigger?: 'mount' | 'inView';
  /** Reduced-motion override. Under reduced motion the final value is shown immediately. @default "system" */
  reducedMotion?: ReducedMotionSetting;
}

/**
 * Counts up (or down) to a number, fast at first and settling gently, with no overshoot. Screen readers only ever get the
 * final value. The final width is reserved up front, so surrounding layout does not shift as digits are added.
 */
export const NumberTicker = forwardRef<HTMLSpanElement, NumberTickerProps>(function NumberTicker(
  { value, from = 0, format, locale, duration = 2, trigger = 'inView', reducedMotion, className, ...rest },
  ref,
) {
  const reduced = useReducedMotion(reducedMotion);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `format` is usually an inline object; compare by content
  const fmt = useMemo(() => new Intl.NumberFormat(locale, format), [locale, JSON.stringify(format)]);
  const text = useRef<HTMLSpanElement>(null);
  const inView = useInView(text, { once: true });
  const count = useMotionValue(from);
  const started = trigger === 'mount' || inView;
  // Whole-number counts stay whole on the way, so in-between frames don't flash decimals.
  const whole = Number.isInteger(value) && Number.isInteger(from) && format?.maximumFractionDigits === undefined && format?.style !== 'percent';

  useMotionValueEvent(count, 'change', (v) => {
    if (text.current) text.current.textContent = fmt.format(whole ? Math.round(v) : v);
  });
  useEffect(() => {
    if (reduced) {
      count.jump(value);
      return;
    }
    if (!started) return;
    const controls = animate(count, value, { duration, ease: [0.33, 1, 0.68, 1] });
    return () => controls.stop();
  }, [reduced, started, value, duration, count]);

  // Reserve the wider of the start and end values so the box never changes size mid-count.
  const [a, b] = [fmt.format(from), fmt.format(value)];
  const widest = a.length > b.length ? a : b;

  return (
    <span ref={ref} className={cx('umbra-number-ticker', className)} {...rest}>
      <span className="umbra-sr-only">{fmt.format(value)}</span>
      <span ref={text} className="umbra-number-ticker__value" aria-hidden="true">
        {fmt.format(reduced ? value : from)}
      </span>
      <span className="umbra-number-ticker__sizer" aria-hidden="true">
        {widest}
      </span>
    </span>
  );
});
