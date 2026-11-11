import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Dialog as D } from 'radix-ui';
import { SearchIcon } from '../../components/internal/icons';
import { cx } from '../../utils/cx';
import { transitions } from '../presets';
import { useReducedMotion, type ReducedMotionSetting } from '../../utils/reduced-motion';

/** One entry in a {@link CommandPalette}. */
export interface CommandItem {
  /** Unique id. */
  id: string;
  /** Visible text; also what the search matches. */
  label: string;
  /** Heading the item is grouped under. */
  group?: string;
  /** Extra search terms that are not shown. */
  keywords?: string[];
  /** Icon shown before the label (decorative). */
  icon?: ReactNode;
  /** Shortcut hint shown at the end of the row (visual only). */
  shortcut?: ReactNode;
  /** Shown but not selectable. */
  disabled?: boolean;
  /** Runs when the item is chosen. */
  onSelect?: () => void;
}

type Conflicts = 'onSelect' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart';

/** Props for {@link CommandPalette}. Remaining props are spread onto the palette panel. */
export interface CommandPaletteProps extends Omit<HTMLAttributes<HTMLDivElement>, Conflicts> {
  /** Commands to search. */
  items: CommandItem[];
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the palette opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Called with the chosen item, after its own `onSelect`. */
  onSelect?: (item: CommandItem) => void;
  /** Toggle with ⌘K / Ctrl+K from anywhere on the page. @default true */
  hotkey?: boolean;
  /** Close after an item is chosen. @default true */
  closeOnSelect?: boolean;
  /** Accessible name of the dialog and the result list. @default "Command palette" */
  label?: string;
  /** Search field placeholder. @default "Type a command or search…" */
  placeholder?: string;
  /** Shown when nothing matches. @default "No results." */
  emptyMessage?: ReactNode;
  /** Reduced-motion override. Under reduced motion the palette fades without scaling. @default "system" */
  reducedMotion?: ReducedMotionSetting;
}

// ponytail: case-insensitive "every term is a substring" match. Swap in a fuzzy scorer if lists grow past a few hundred items.
const matches = (item: CommandItem, query: string) => {
  const hay = [item.label, item.group, ...(item.keywords ?? [])].join(' ').toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => hay.includes(term));
};

/**
 * A ⌘K command menu: a modal dialog with a search field driving a filtered, grouped listbox.
 *
 * Keyboard: ⌘K/Ctrl+K toggles, ↑/↓ move, Home/End jump, Enter runs, Escape closes. Focus is trapped
 * while open and restored on close. The result count is announced politely.
 */
export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(function CommandPalette(
  {
    items,
    open: controlled,
    defaultOpen = false,
    onOpenChange,
    onSelect,
    hotkey = true,
    closeOnSelect = true,
    label = 'Command palette',
    placeholder = 'Type a command or search…',
    emptyMessage = 'No results.',
    reducedMotion,
    className,
    ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(defaultOpen);
  const open = controlled ?? inner;
  const openRef = useRef(open);
  openRef.current = open;
  const setOpen = (next: boolean) => {
    setInner(next);
    onOpenChange?.(next);
  };
  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;

  const reduced = useReducedMotion(reducedMotion);
  const uid = useId();
  const listId = `${uid}-list`;
  const optionId = (id: string) => `${uid}-option-${id}`;
  const list = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | undefined>();

  const results = useMemo(() => items.filter((i) => matches(i, query.trim())), [items, query]);
  const enabled = results.filter((i) => !i.disabled);
  const active = enabled.find((i) => i.id === activeId) ?? enabled[0];
  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of results) map.set(item.group ?? '', [...(map.get(item.group ?? '') ?? []), item]);
    return [...map];
  }, [results]);

  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpenRef.current(!openRef.current);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [hotkey]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    if (active) list.current?.querySelector(`[id="${optionId(active.id)}"]`)?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the active option changes
  }, [active?.id]);

  const choose = (item: CommandItem | undefined) => {
    if (!item || item.disabled) return;
    item.onSelect?.();
    onSelect?.(item);
    if (closeOnSelect) setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const i = active ? enabled.indexOf(active) : -1;
    const go = (n: number) => {
      e.preventDefault();
      setActiveId(enabled[(n + enabled.length) % enabled.length]?.id);
    };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(enabled.length - 1);
    else if (e.key === 'Enter') {
      e.preventDefault();
      choose(active);
    }
  };

  return (
    <D.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open ? (
          <D.Portal forceMount>
            <D.Overlay asChild forceMount>
              <motion.div
                className="umbra-command__overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transitions.fast}
              />
            </D.Overlay>
            <D.Content
              asChild
              forceMount
              aria-describedby={undefined}
              // There is no trigger element (the palette opens from a hotkey), so remember and restore focus ourselves.
              onOpenAutoFocus={() => {
                returnFocus.current = document.activeElement as HTMLElement | null;
              }}
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                returnFocus.current?.focus();
              }}
            >
              <motion.div
                ref={ref}
                className={cx('umbra-command', className)}
                initial={{ opacity: 0, scale: reduced ? 1 : 0.97, y: reduced ? 0 : -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.98, transition: transitions.fast }}
                transition={reduced ? transitions.fast : transitions.snappy}
                {...rest}
              >
                <D.Title className="umbra-sr-only">{label}</D.Title>
                <div className="umbra-command__search">
                  <SearchIcon />
                  <input
                    className="umbra-command__input"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls={listId}
                    aria-activedescendant={active ? optionId(active.id) : undefined}
                    aria-autocomplete="list"
                    aria-label={placeholder}
                    placeholder={placeholder}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActiveId(undefined);
                    }}
                    onKeyDown={onKeyDown}
                  />
                  <kbd className="umbra-kbd" data-size="sm">
                    Esc
                  </kbd>
                </div>
                <div ref={list} id={listId} role="listbox" aria-label={label} className="umbra-command__list">
                  {groups.map(([group, groupItems]) => (
                    <div key={group} role="group" aria-label={group || undefined} className="umbra-command__group">
                      {group ? (
                        <div className="umbra-menu__label" aria-hidden="true">
                          {group}
                        </div>
                      ) : null}
                      {groupItems.map((item) => (
                        // Options are operated from the combobox input via aria-activedescendant; pointer use is an enhancement.
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                        <div
                          key={item.id}
                          id={optionId(item.id)}
                          role="option"
                          tabIndex={-1}
                          aria-selected={item.id === active?.id}
                          aria-disabled={item.disabled || undefined}
                          className="umbra-menu__item umbra-command__item"
                          data-selected={item.id === active?.id}
                          data-disabled={item.disabled ? '' : undefined}
                          // Keep focus in the search field so the keyboard keeps working after a click.
                          onMouseDown={(e) => e.preventDefault()}
                          onPointerMove={() => !item.disabled && setActiveId(item.id)}
                          onClick={() => choose(item)}
                        >
                          {item.icon ? (
                            <span className="umbra-command__icon" aria-hidden="true">
                              {item.icon}
                            </span>
                          ) : null}
                          {item.label}
                          {item.shortcut ? <span className="umbra-menu__shortcut">{item.shortcut}</span> : null}
                        </div>
                      ))}
                    </div>
                  ))}
                  {results.length === 0 ? <div className="umbra-command__empty">{emptyMessage}</div> : null}
                </div>
                <div className="umbra-sr-only" role="status" aria-live="polite">
                  {results.length === 1 ? '1 result' : `${results.length} results`}
                </div>
              </motion.div>
            </D.Content>
          </D.Portal>
        ) : null}
      </AnimatePresence>
    </D.Root>
  );
});
