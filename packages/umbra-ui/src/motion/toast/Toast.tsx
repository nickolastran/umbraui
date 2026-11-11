import { forwardRef, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CloseIcon } from '../../components/internal/icons';
import type { Tone } from '../../components/internal/types';
import { cx } from '../../utils/cx';
import { transitions } from '../presets';
import { useReducedMotion, type ReducedMotionSetting } from '../../utils/reduced-motion';

/** Options for {@link toast}. */
export interface ToastOptions {
  /** Stable id. Reusing an id updates that toast in place. Generated when omitted. */
  id?: string;
  /** Main message. */
  title: ReactNode;
  /** Secondary line. */
  description?: ReactNode;
  /** Colour intent. `danger` is announced assertively. @default "neutral" */
  tone?: Tone;
  /** Milliseconds before auto-dismiss; `Infinity` keeps it until dismissed. @default 5000 */
  duration?: number;
  /** One optional action button. The toast is dismissed after it runs. */
  action?: { label: string; onClick: () => void };
}

type ToastRecord = ToastOptions & { id: string };

// Module-level store so `toast()` can be called from anywhere, including outside React.
let records: ToastRecord[] = [];
let counter = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};
const EMPTY: ToastRecord[] = [];

/**
 * Shows a toast in the mounted {@link Toaster} and returns its id.
 *
 * @example toast({ title: 'Deployment ready', tone: 'success' })
 */
export function toast(options: ToastOptions | string): string {
  const opts = typeof options === 'string' ? { title: options } : options;
  const id = opts.id ?? `umbra-toast-${++counter}`;
  const next = { ...opts, id };
  records = records.some((r) => r.id === id) ? records.map((r) => (r.id === id ? next : r)) : [...records, next];
  emit();
  return id;
}

/** Dismisses one toast by id, or every toast when called without one. */
toast.dismiss = (id?: string) => {
  records = id === undefined ? [] : records.filter((r) => r.id !== id);
  emit();
};

/** Props for {@link Toaster}. */
export interface ToasterProps extends HTMLAttributes<HTMLElement> {
  /** Screen corner or edge the stack is anchored to. @default "bottom-right" */
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  /** Maximum toasts shown at once; older ones wait their turn. @default 4 */
  max?: number;
  /** Accessible name of the notifications landmark. @default "Notifications" */
  label?: string;
  /** `KeyboardEvent.key` that moves focus to the newest toast from anywhere. @default "F8" */
  hotkey?: string;
  /** Accessible label of each toast's dismiss button. @default "Dismiss notification" */
  closeLabel?: string;
  /** Reduced-motion override. Under reduced motion toasts fade without sliding. @default "system" */
  reducedMotion?: ReducedMotionSetting;
}

/**
 * Renders the toasts created with {@link toast}. Mount once, near the root.
 *
 * Accessibility: a labelled landmark containing a polite live region (assertive for `danger`);
 * timers pause on hover and focus; the hotkey jumps to the stack; Escape dismisses the focused
 * toast and focus returns to where it was before entering the stack.
 */
export const Toaster = forwardRef<HTMLElement, ToasterProps>(function Toaster(
  { position = 'bottom-right', max = 4, label = 'Notifications', hotkey = 'F8', closeLabel = 'Dismiss notification', reducedMotion, className, ...rest },
  ref,
) {
  const all = useSyncExternalStore(subscribe, () => records, () => EMPTY);
  const visible = all.slice(0, max);
  const reduced = useReducedMotion(reducedMotion);
  const region = useRef<HTMLOListElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const fromTop = position.startsWith('top');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== hotkey) return;
      const items = region.current?.querySelectorAll<HTMLElement>('.umbra-toast');
      items?.[items.length - 1]?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [hotkey]);

  const dismiss = useCallback((id: string) => {
    const el = region.current;
    if (el?.contains(document.activeElement)) {
      const others = Array.from(el.querySelectorAll<HTMLElement>('.umbra-toast')).filter((t) => t.dataset.id !== id);
      (others[others.length - 1] ?? returnTo.current)?.focus();
    }
    toast.dismiss(id);
  }, []);

  return (
    <section ref={ref} aria-label={`${label} (${hotkey})`} className={cx('umbra-toaster', className)} data-position={position} {...rest}>
      <ol
        ref={region}
        className="umbra-toaster__list"
        aria-live="polite"
        aria-relevant="additions text"
        onFocusCapture={(e) => {
          const from = e.relatedTarget as HTMLElement | null;
          if (from && !e.currentTarget.contains(from)) returnTo.current = from;
        }}
      >
        <AnimatePresence initial={false}>
          {visible.map((t) => (
            <ToastItem key={t.id} record={t} reduced={reduced} fromTop={fromTop} closeLabel={closeLabel} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </ol>
    </section>
  );
});

interface ToastItemProps {
  record: ToastRecord;
  reduced: boolean;
  fromTop: boolean;
  closeLabel: string;
  onDismiss: (id: string) => void;
}

const ToastItem = forwardRef<HTMLLIElement, ToastItemProps>(function ToastItem({ record, reduced, fromTop, closeLabel, onDismiss }, ref) {
  const { id, title, description, tone = 'neutral', duration = 5000, action } = record;
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (held || !Number.isFinite(duration)) return;
    const timer = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timer);
  }, [held, duration, id, onDismiss, title, description]);

  const offset = reduced ? 0 : fromTop ? -16 : 16;
  return (
    <motion.li
      ref={ref}
      layout={reduced ? false : 'position'}
      role={tone === 'danger' ? 'alert' : undefined}
      aria-atomic="true"
      tabIndex={0}
      className="umbra-toast"
      data-tone={tone}
      data-id={id}
      initial={{ opacity: 0, y: offset, scale: reduced ? 1 : 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: reduced ? 1 : 0.96, transition: transitions.fast }}
      transition={reduced ? transitions.base : transitions.smooth}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onDismiss(id);
      }}
    >
      <span className="umbra-toast__bar" aria-hidden="true" />
      <div className="umbra-toast__body">
        <div className="umbra-toast__title">{title}</div>
        {description ? <div className="umbra-toast__description">{description}</div> : null}
      </div>
      {action ? (
        <button
          type="button"
          className="umbra-button umbra-toast__action"
          data-variant="soft"
          data-tone="neutral"
          data-size="sm"
          onClick={() => {
            action.onClick();
            onDismiss(id);
          }}
        >
          {action.label}
        </button>
      ) : null}
      <button
        type="button"
        className="umbra-button umbra-icon-button umbra-toast__close"
        data-variant="ghost"
        data-tone="neutral"
        data-size="sm"
        aria-label={closeLabel}
        onClick={() => onDismiss(id)}
      >
        <CloseIcon />
      </button>
    </motion.li>
  );
});
