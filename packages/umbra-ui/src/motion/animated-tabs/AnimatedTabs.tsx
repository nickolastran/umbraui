import { createContext, forwardRef, useContext, useId, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/tabs/Tabs';
import type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps } from '../../components/tabs/Tabs';
import { transitions } from '../presets';
import { useReducedMotion, type ReducedMotionSetting } from '../../utils/reduced-motion';

const Ctx = createContext<{ value?: string; layoutId: string; reduced: boolean }>({ layoutId: '', reduced: false });

/** Props for {@link AnimatedTabs}. */
export interface AnimatedTabsProps extends TabsProps {
  /** Reduced-motion override. Under reduced motion the indicator jumps and panels only fade. @default "system" */
  reducedMotion?: ReducedMotionSetting;
}

/** Tabs whose indicator slides between triggers with a spring. Same API and keyboard behaviour as Tabs. */
export const AnimatedTabs = forwardRef<HTMLDivElement, AnimatedTabsProps>(function AnimatedTabs(
  { value, defaultValue, onValueChange, reducedMotion, ...rest },
  ref,
) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const layoutId = useId();
  const reduced = useReducedMotion(reducedMotion);
  const ctx = useMemo(() => ({ value: current, layoutId, reduced }), [current, layoutId, reduced]);
  return (
    <Ctx.Provider value={ctx}>
      <Tabs
        ref={ref}
        data-animated=""
        value={current}
        onValueChange={(v) => {
          setInner(v);
          onValueChange?.(v);
        }}
        {...rest}
      />
    </Ctx.Provider>
  );
});

/** Props for {@link AnimatedTabsList}. */
export type AnimatedTabsListProps = TabsListProps;
/** The row of triggers. */
export const AnimatedTabsList = TabsList;

/** Props for {@link AnimatedTabsTrigger}. */
export type AnimatedTabsTriggerProps = TabsTriggerProps;
/** A tab. The selected one carries the shared sliding indicator. */
export const AnimatedTabsTrigger = forwardRef<HTMLButtonElement, AnimatedTabsTriggerProps>(function AnimatedTabsTrigger(
  { children, ...rest },
  ref,
) {
  const { value, layoutId, reduced } = useContext(Ctx);
  return (
    <TabsTrigger ref={ref} {...rest}>
      {value === rest.value ? (
        <motion.span
          aria-hidden="true"
          className="umbra-tabs__indicator"
          layoutId={layoutId}
          transition={reduced ? transitions.instant : transitions.snappy}
        />
      ) : null}
      <span className="umbra-tabs__label">{children}</span>
    </TabsTrigger>
  );
});

/** Props for {@link AnimatedTabsContent}. */
export type AnimatedTabsContentProps = TabsContentProps;
/** A panel that fades (and, with motion allowed, rises slightly) into place when selected. */
export const AnimatedTabsContent = forwardRef<HTMLDivElement, AnimatedTabsContentProps>(function AnimatedTabsContent(
  { children, ...rest },
  ref,
) {
  const { reduced } = useContext(Ctx);
  return (
    <TabsContent ref={ref} {...rest}>
      <motion.div initial={{ opacity: 0, y: reduced ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={transitions.base}>
        {children}
      </motion.div>
    </TabsContent>
  );
});
