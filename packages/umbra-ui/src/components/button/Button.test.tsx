import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { expectNoA11yViolations } from '../../test/axe';
import { Button, IconButton } from './Button';

describe('Button', () => {
  it('renders a button with defaults, className, rest props and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} className="mine" data-testid="b">Save</Button>);
    const b = screen.getByRole('button', { name: 'Save' });
    expect(b).toHaveAttribute('type', 'button');
    expect(b).toHaveClass('umbra-button', 'mine');
    expect(b).toHaveAttribute('data-variant', 'solid');
    expect(b).toHaveAttribute('data-tone', 'accent');
    expect(b).toHaveAttribute('data-size', 'md');
    expect(ref.current).toBe(screen.getByTestId('b'));
  });

  it('activates with click, Enter and Space', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('does not fire when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('loading keeps focusability, sets aria-busy and swallows clicks', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Saving</Button>);
    const b = screen.getByRole('button', { name: 'Saving' });
    expect(b).toHaveAttribute('aria-busy', 'true');
    expect(b).toHaveAttribute('aria-disabled', 'true');
    await userEvent.tab();
    expect(b).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('asChild renders the child element with button styling', () => {
    render(<Button asChild><a href="/docs">Docs</a></Button>);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveClass('umbra-button');
    expect(link).not.toHaveAttribute('type');
  });

  it('IconButton exposes its aria-label as the name', () => {
    render(<IconButton aria-label="Close"><svg /></IconButton>);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('umbra-icon-button');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Button startIcon={<svg />}>Save</Button>
        <Button loading>Saving</Button>
        <Button disabled>Off</Button>
        <IconButton aria-label="Close"><svg /></IconButton>
      </>,
    );
    await expectNoA11yViolations(container);
  });
});
