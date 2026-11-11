import { forwardRef } from 'react';
import type { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

/** Props for {@link TableContainer}. */
export interface TableContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the scrollable region. Required so keyboard users know what they are scrolling. */
  'aria-label': string;
}

/** Optional bordered wrapper that scrolls horizontally on narrow screens and is keyboard-focusable. */
export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(function TableContainer({ className, ...rest }, ref) {
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable regions must be focusable (WCAG 2.1.1)
  return <div ref={ref} role="region" tabIndex={0} className={cx('umbra-table-container', className)} {...rest} />;
});

/** Props for {@link Table}. */
export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Row density. @default "md" */
  size?: 'sm' | 'md';
  /** Highlights rows on hover. @default false */
  interactive?: boolean;
}

/** A data table. Compose with TableHeader, TableBody, TableRow, TableHead, TableCell and TableCaption. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table({ size = 'md', interactive = false, className, ...rest }, ref) {
  return <table ref={ref} className={cx('umbra-table', className)} data-size={size} data-interactive={interactive || undefined} {...rest} />;
});

/** Props for {@link TableHeader}, {@link TableBody} and {@link TableRow}. */
export type TableSectionProps = HTMLAttributes<HTMLTableSectionElement>;
/** `<thead>`. */
export const TableHeader = forwardRef<HTMLTableSectionElement, TableSectionProps>(function TableHeader({ className, ...rest }, ref) {
  return <thead ref={ref} className={cx('umbra-table__header', className)} {...rest} />;
});
/** `<tbody>`. */
export const TableBody = forwardRef<HTMLTableSectionElement, TableSectionProps>(function TableBody({ className, ...rest }, ref) {
  return <tbody ref={ref} className={cx('umbra-table__body', className)} {...rest} />;
});

/** Props for {@link TableRow}. */
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Marks the row as selected (sets `aria-selected` and a highlight). */
  selected?: boolean;
}
/** `<tr>`. */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow({ selected, className, ...rest }, ref) {
  return <tr ref={ref} className={cx('umbra-table__row', className)} aria-selected={selected} {...rest} />;
});

/** Props for {@link TableHead}. */
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Right-aligns numeric columns and uses tabular figures. @default false */
  numeric?: boolean;
}
/** `<th>`. Defaults to `scope="col"`. */
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { numeric = false, scope = 'col', className, ...rest },
  ref,
) {
  return <th ref={ref} scope={scope} className={cx('umbra-table__head', className)} data-numeric={numeric || undefined} {...rest} />;
});

/** Props for {@link TableCell}. */
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Right-aligns numeric columns and uses tabular figures. @default false */
  numeric?: boolean;
}
/** `<td>`. */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell({ numeric = false, className, ...rest }, ref) {
  return <td ref={ref} className={cx('umbra-table__cell', className)} data-numeric={numeric || undefined} {...rest} />;
});

/** Props for {@link TableCaption}. */
export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;
/** `<caption>`: the table's accessible name, shown below it. */
export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(function TableCaption({ className, ...rest }, ref) {
  return <caption ref={ref} className={cx('umbra-table__caption', className)} {...rest} />;
});
