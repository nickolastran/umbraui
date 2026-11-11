import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { expectNoA11yViolations } from '../../test/axe';
import { Textarea } from '../textarea/Textarea';
import { Input } from './Input';

describe.each([
  ['Input', Input, 'umbra-input'],
  ['Textarea', Textarea, 'umbra-textarea'],
] as const)('%s', (_name, Comp, cls) => {
  const C = Comp as typeof Input;

  it('renders with className, rest props and ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<C ref={ref} className="mine" aria-label="Name" placeholder="Type" />);
    const el = screen.getByRole('textbox', { name: 'Name' });
    expect(el).toHaveClass(cls, 'mine');
    expect(el).toHaveAttribute('placeholder', 'Type');
    expect(ref.current).toBe(el);
  });

  it('works uncontrolled', async () => {
    render(<C aria-label="Name" defaultValue="a" />);
    await userEvent.type(screen.getByRole('textbox'), 'bc');
    expect(screen.getByRole('textbox')).toHaveValue('abc');
  });

  it('works controlled', async () => {
    function Upper() {
      const [v, setV] = useState('');
      return <C aria-label="Name" value={v} onChange={(e) => setV(e.target.value.toUpperCase())} />;
    }
    render(<Upper />);
    await userEvent.type(screen.getByRole('textbox'), 'abc');
    expect(screen.getByRole('textbox')).toHaveValue('ABC');
  });

  it('maps invalid to aria-invalid and honours disabled', async () => {
    const { rerender } = render(<C aria-label="Name" invalid />);
    expect(screen.getByRole('textbox')).toBeInvalid();
    rerender(<C aria-label="Name" disabled />);
    await userEvent.type(screen.getByRole('textbox'), 'x');
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('is reachable by keyboard and has no axe violations', async () => {
    const { container } = render(<C aria-label="Name" />);
    await userEvent.tab();
    expect(screen.getByRole('textbox')).toHaveFocus();
    await expectNoA11yViolations(container);
  });
});

it('Input passes htmlSize through as the native size attribute', () => {
  render(<Input aria-label="Code" htmlSize={6} size="sm" />);
  expect(screen.getByRole('textbox')).toHaveAttribute('size', '6');
  expect(screen.getByRole('textbox')).toHaveAttribute('data-size', 'sm');
});
