import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { expectNoA11yViolations } from '../test/axe';
import { CommandPalette, type CommandItem } from './command-palette/CommandPalette';
import { Toaster, toast } from './toast/Toast';

describe('Toast', () => {
  afterEach(() => act(() => toast.dismiss()));

  it('renders toasts in a labelled landmark with a polite live region', async () => {
    const ref = createRef<HTMLElement>();
    render(<Toaster ref={ref} className="mine" label="Updates" />);
    const landmark = screen.getByRole('region', { name: 'Updates (F8)' });
    expect(landmark).toBe(ref.current);
    expect(landmark).toHaveClass('umbra-toaster', 'mine');
    const list = within(landmark).getByRole('list');
    expect(list).toHaveAttribute('aria-live', 'polite');
    act(() => void toast({ title: 'Saved', description: 'All changes are live.', tone: 'success' }));
    const item = await screen.findByText('Saved');
    expect(item.closest('.umbra-toast')).toHaveAttribute('data-tone', 'success');
    expect(screen.getByText('All changes are live.')).toBeInTheDocument();
  });

  it('announces danger toasts assertively', () => {
    render(<Toaster />);
    act(() => void toast({ title: 'Build failed', tone: 'danger' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Build failed');
  });

  it('accepts a string, returns an id, updates in place and dismisses by id', async () => {
    render(<Toaster />);
    let id = '';
    act(() => void (id = toast('Uploading…')));
    act(() => void toast({ id, title: 'Uploaded' }));
    expect(screen.getByText('Uploaded')).toBeInTheDocument();
    expect(screen.queryByText('Uploading…')).not.toBeInTheDocument();
    act(() => toast.dismiss(id));
    await waitFor(() => expect(screen.queryByText('Uploaded')).not.toBeInTheDocument());
  });

  it('auto-dismisses after its duration and pauses while focused', async () => {
    render(<Toaster />);
    act(() => void toast({ title: 'Quick', duration: 80 }));
    await waitFor(() => expect(screen.queryByText('Quick')).not.toBeInTheDocument(), { timeout: 2000 });

    act(() => void toast({ title: 'Held', duration: 80 }));
    act(() => (screen.getByText('Held').closest('.umbra-toast') as HTMLElement).focus());
    await act(() => new Promise((r) => setTimeout(r, 250)));
    expect(screen.getByText('Held')).toBeInTheDocument();
  });

  it('hotkey focuses the newest toast; Escape dismisses it and returns focus', async () => {
    render(
      <>
        <button>Trigger</button>
        <Toaster />
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    trigger.focus();
    act(() => void toast({ title: 'One', duration: Infinity }));
    await userEvent.keyboard('{F8}');
    const item = screen.getByText('One').closest('.umbra-toast') as HTMLElement;
    expect(item).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
    await waitFor(() => expect(screen.queryByText('One')).not.toBeInTheDocument());
  });

  it('has a keyboard-reachable dismiss button and action', async () => {
    const onClick = vi.fn();
    render(<Toaster closeLabel="Close" />);
    act(() => void toast({ title: 'Archived', duration: Infinity, action: { label: 'Undo', onClick } }));
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onClick).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByText('Archived')).not.toBeInTheDocument());
  });

  it('shows at most `max` toasts', () => {
    render(<Toaster max={2} />);
    act(() => {
      toast({ title: 'A', duration: Infinity });
      toast({ title: 'B', duration: Infinity });
      toast({ title: 'C', duration: Infinity });
    });
    expect(document.querySelectorAll('.umbra-toast')).toHaveLength(2);
  });

  it('has no axe violations', async () => {
    render(<main><Toaster reducedMotion="always" /></main>);
    act(() => void toast({ title: 'Saved', description: 'Done', tone: 'success', duration: Infinity, action: { label: 'Undo', onClick() {} } }));
    await expectNoA11yViolations(document.body);
  });
});

describe('CommandPalette', () => {
  const run = vi.fn();
  const items: CommandItem[] = [
    { id: 'new', label: 'New project', group: 'Projects', onSelect: () => run('new') },
    { id: 'import', label: 'Import repository', group: 'Projects', keywords: ['github'] },
    { id: 'domain', label: 'Add domain', group: 'Projects', disabled: true },
    { id: 'theme', label: 'Toggle theme', group: 'Preferences', shortcut: '⌘J' },
  ];
  beforeEach(() => run.mockClear());

  it('opens with ⌘K / Ctrl+K, focuses the search field and closes with Escape, restoring focus', async () => {
    const onOpenChange = vi.fn();
    render(
      <>
        <button>Before</button>
        <CommandPalette items={items} onOpenChange={onOpenChange} />
      </>,
    );
    screen.getByRole('button', { name: 'Before' }).focus();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.keyboard('{Control>}k{/Control}');
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveFocus();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 3000 });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus());
    await userEvent.keyboard('{Meta>}k{/Meta}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('exposes combobox + grouped listbox semantics', () => {
    render(<CommandPalette items={items} defaultOpen />);
    const input = screen.getByRole('combobox');
    const listbox = screen.getByRole('listbox', { name: 'Command palette' });
    expect(input).toHaveAttribute('aria-controls', listbox.id);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(within(listbox).getByRole('group', { name: 'Projects' })).toBeInTheDocument();
    const first = screen.getByRole('option', { name: 'New project' });
    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', first.id);
    expect(screen.getByRole('option', { name: 'Add domain' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('arrow keys move the active option, skipping disabled and wrapping; Home/End jump', async () => {
    render(<CommandPalette items={items} defaultOpen />);
    const selected = () => screen.getByRole('option', { selected: true });
    await userEvent.keyboard('{ArrowDown}');
    expect(selected()).toHaveTextContent('Import repository');
    await userEvent.keyboard('{ArrowDown}');
    expect(selected()).toHaveTextContent('Toggle theme');
    await userEvent.keyboard('{ArrowDown}');
    expect(selected()).toHaveTextContent('New project');
    await userEvent.keyboard('{ArrowUp}');
    expect(selected()).toHaveTextContent('Toggle theme');
    await userEvent.keyboard('{Home}');
    expect(selected()).toHaveTextContent('New project');
    await userEvent.keyboard('{End}');
    expect(selected()).toHaveTextContent('Toggle theme');
    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it('filters by label and keywords, announces the count and shows the empty state', async () => {
    render(<CommandPalette items={items} defaultOpen emptyMessage="Nothing found." />);
    await userEvent.type(screen.getByRole('combobox'), 'github');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option')).toHaveTextContent('Import repository');
    expect(screen.getByRole('status')).toHaveTextContent('1 result');
    await userEvent.type(screen.getByRole('combobox'), 'zzz');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(screen.getByText('Nothing found.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('0 results');
  });

  it('Enter runs the active item and closes; clicking works; disabled items do nothing', async () => {
    const onSelect = vi.fn();
    const { rerender } = render(<CommandPalette items={items} defaultOpen onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('option', { name: 'Add domain' }));
    expect(onSelect).not.toHaveBeenCalled();
    await userEvent.keyboard('{Enter}');
    expect(run).toHaveBeenCalledWith('new');
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'new' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 3000 });

    rerender(<CommandPalette items={items} open closeOnSelect={false} onSelect={onSelect} />);
    await userEvent.click(await screen.findByRole('option', { name: /Toggle theme/ }));
    expect(onSelect).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'theme' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('traps focus while open', async () => {
    render(
      <>
        <button>Outside</button>
        <CommandPalette items={items} defaultOpen />
      </>,
    );
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
  });

  it('can disable the hotkey, forwards className/ref, and has no axe violations', async () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(<CommandPalette items={items} hotkey={false} />);
    await userEvent.keyboard('{Control>}k{/Control}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    rerender(<CommandPalette ref={ref} items={items} open className="mine" reducedMotion="always" />);
    expect(await screen.findByRole('dialog')).toBe(ref.current);
    expect(ref.current).toHaveClass('umbra-command', 'mine');
    await expectNoA11yViolations(document.body);
  });
});
