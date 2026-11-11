import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { expectNoA11yViolations } from '../../test/axe';
import { Button } from '../button/Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu/DropdownMenu';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '../popover/Popover';
import { Tooltip } from '../tooltip/Tooltip';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from './Dialog';

describe('Dialog', () => {
  const dialog = (props: Partial<React.ComponentProps<typeof Dialog>> = {}, content: Partial<React.ComponentProps<typeof DialogContent>> = {}) => (
    <Dialog {...props}>
      <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
      <DialogContent title="Delete project" description="This cannot be undone." {...content}>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
          <Button tone="danger">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  it('opens from the trigger with an accessible name and description', async () => {
    render(dialog());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const d = screen.getByRole('dialog', { name: 'Delete project' });
    expect(d).toHaveAccessibleDescription('This cannot be undone.');
  });

  it('traps focus, closes on Escape and restores focus to the trigger', async () => {
    render(dialog());
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    const d = screen.getByRole('dialog');
    for (let i = 0; i < 6; i++) {
      await userEvent.tab();
      expect(d).toContainElement(document.activeElement as HTMLElement);
    }
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
  });

  it('closes via the corner button and DialogClose; reports onOpenChange', async () => {
    const onOpenChange = vi.fn();
    render(dialog({ defaultOpen: true, onOpenChange }, { closeLabel: 'Close dialog' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports controlled state, size, hideClose, className and ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(dialog({ open: true }, { ref, size: 'lg', hideClose: true, className: 'mine' }));
    expect(ref.current).toHaveClass('umbra-dialog', 'mine');
    expect(ref.current).toHaveAttribute('data-size', 'lg');
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('has no axe violations when open', async () => {
    render(dialog({ defaultOpen: true }));
    await expectNoA11yViolations(document.body);
  });
});

describe('Popover', () => {
  const popover = (
    <Popover>
      <PopoverTrigger asChild><Button>Rename</Button></PopoverTrigger>
      <PopoverContent arrow className="mine" aria-label="Rename branch">
        <input aria-label="Branch name" />
        <PopoverClose asChild><Button>Save</Button></PopoverClose>
      </PopoverContent>
    </Popover>
  );

  it('opens by keyboard, moves focus inside, closes on Escape and restores focus', async () => {
    render(popover);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    const content = screen.getByRole('dialog', { name: 'Rename branch' });
    expect(content).toHaveClass('umbra-popover', 'mine');
    expect(content).toContainElement(document.activeElement as HTMLElement);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rename' })).toHaveFocus();
  });

  it('PopoverClose closes it; no axe violations while open', async () => {
    render(popover);
    await userEvent.click(screen.getByRole('button', { name: 'Rename' }));
    await expectNoA11yViolations(document.body);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('Tooltip', () => {
  it('shows on keyboard focus, describes the trigger and hides on Escape', async () => {
    render(<Tooltip content="Search the docs" className="mine"><Button>Search</Button></Tooltip>);
    await userEvent.tab();
    const tip = await screen.findByRole('tooltip');
    expect(tip).toHaveTextContent('Search the docs');
    expect(screen.getByRole('button', { name: 'Search' })).toHaveAccessibleDescription('Search the docs');
    expect(document.querySelector('.umbra-tooltip')).toHaveClass('mine');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('supports controlled open and has no axe violations', async () => {
    render(<Tooltip content="Hint" open><Button>Target</Button></Tooltip>);
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    await expectNoA11yViolations(document.body);
  });
});

describe('DropdownMenu', () => {
  function Menu({ onSelect = () => {} }: { onSelect?: (v: string) => void }) {
    const [wrap, setWrap] = useState(false);
    const [level, setLevel] = useState('info');
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button>Actions</Button></DropdownMenuTrigger>
        <DropdownMenuContent className="mine">
          <DropdownMenuLabel>Deployment</DropdownMenuLabel>
          <DropdownMenuItem shortcut="⌘O" onSelect={() => onSelect('open')}>Open</DropdownMenuItem>
          <DropdownMenuItem disabled onSelect={() => onSelect('promote')}>Promote</DropdownMenuItem>
          <DropdownMenuItem tone="danger" onSelect={() => onSelect('delete')}>Delete</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>Wrap lines</DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value={level} onValueChange={setLevel}>
            <DropdownMenuRadioItem value="info">Info</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="error">Error</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  it('opens with the keyboard, skips disabled items and selects with Enter', async () => {
    const onSelect = vi.fn();
    render(<Menu onSelect={onSelect} />);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('menu')).toHaveClass('umbra-menu', 'mine');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /Open/ })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('delete');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus();
  });

  it('checkbox and radio items reflect state', async () => {
    render(<Menu />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menuitemradio', { name: 'Info' })).toBeChecked();
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Wrap lines' }));
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menuitemcheckbox', { name: 'Wrap lines' })).toBeChecked();
  });

  it('closes on Escape and has no axe violations while open', async () => {
    render(<Menu />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    await expectNoA11yViolations(document.body);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
