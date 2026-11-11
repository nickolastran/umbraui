import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Tabs as T } from 'radix-ui';
import { cx } from '../../utils/cx';

/** Props for {@link Tabs}. */
export interface TabsProps extends Omit<ComponentPropsWithoutRef<typeof T.Root>, 'asChild'> {
  /** `underline` sits on a rule; `pill` is a segmented control. @default "underline" */
  variant?: 'underline' | 'pill';
  /** Trigger height. @default "md" */
  size?: 'sm' | 'md';
}

/** Switches between panels of related content. Controlled via `value` or uncontrolled via `defaultValue`. */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs({ variant = 'underline', size = 'md', className, ...rest }, ref) {
  return <T.Root ref={ref} className={cx('umbra-tabs', className)} data-variant={variant} data-size={size} {...rest} />;
});

/** Props for {@link TabsList}. */
export type TabsListProps = Omit<ComponentPropsWithoutRef<typeof T.List>, 'asChild'>;
/** The row of triggers. Give it an `aria-label` when the purpose is not obvious from context. */
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList({ className, ...rest }, ref) {
  return <T.List ref={ref} className={cx('umbra-tabs__list', className)} {...rest} />;
});

/** Props for {@link TabsTrigger}. */
export type TabsTriggerProps = Omit<ComponentPropsWithoutRef<typeof T.Trigger>, 'asChild'>;
/** A tab. Arrow keys move between triggers; Home/End jump to the ends. */
export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger({ className, ...rest }, ref) {
  return <T.Trigger ref={ref} className={cx('umbra-tabs__trigger', className)} {...rest} />;
});

/** Props for {@link TabsContent}. */
export type TabsContentProps = Omit<ComponentPropsWithoutRef<typeof T.Content>, 'asChild'>;
/** The panel shown while its trigger is selected. */
export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent({ className, ...rest }, ref) {
  return <T.Content ref={ref} className={cx('umbra-tabs__content', className)} {...rest} />;
});
