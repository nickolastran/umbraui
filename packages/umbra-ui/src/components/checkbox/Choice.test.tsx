import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { expectNoA11yViolations } from '../../test/axe';
import { Radio, RadioGroup } from '../radio/Radio';
import { Switch } from '../switch/Switch';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('toggles by click, label click and Space (uncontrolled)', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange}>Accept</Checkbox>);
    const box = screen.getByRole('checkbox', { name: 'Accept' });
    await userEvent.click(box);
    expect(box).toBeChecked();
    await userEvent.click(screen.getByText('Accept'));
    expect(box).not.toBeChecked();
    box.focus();
    await userEvent.keyboard(' ');
    expect(box).toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
  });

  it('supports controlled and indeterminate state', async () => {
    function C() {
      const [v, setV] = useState<boolean | 'indeterminate'>('indeterminate');
      return <Checkbox checked={v} onCheckedChange={setV} aria-label="All" />;
    }
    render(<C />);
    const box = screen.getByRole('checkbox', { name: 'All' });
    expect(box).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(box);
    expect(box).toBeChecked();
  });

  it('className goes to the label wrapper when labelled, the control otherwise; ref always to the control', () => {
    const ref = createRef<HTMLButtonElement>();
    const { container, rerender } = render(<Checkbox ref={ref} className="mine">A</Checkbox>);
    expect(container.firstChild).toHaveClass('umbra-choice', 'mine');
    expect(ref.current).toBe(screen.getByRole('checkbox'));
    rerender(<Checkbox className="mine" aria-label="A" />);
    expect(screen.getByRole('checkbox')).toHaveClass('umbra-checkbox', 'mine');
  });

  it('disabled blocks interaction; invalid sets aria-invalid', async () => {
    render(<><Checkbox disabled>Off</Checkbox><Checkbox invalid>Bad</Checkbox></>);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Off' }));
    expect(screen.getByRole('checkbox', { name: 'Off' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Bad' })).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('RadioGroup', () => {
  const group = (props: Partial<React.ComponentProps<typeof RadioGroup>> = {}) => (
    <RadioGroup aria-label="Plan" {...props}>
      <Radio value="hobby">Hobby</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="ent" disabled>Enterprise</Radio>
    </RadioGroup>
  );

  it('selects by click and reports the value', async () => {
    const onValueChange = vi.fn();
    render(group({ onValueChange }));
    await userEvent.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('pro');
  });

  it('arrow keys move and select, skipping disabled; Tab is a single stop', async () => {
    render(<>{group({ defaultValue: 'hobby' })}<button>after</button></>);
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'Hobby' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Hobby' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
  });

  it('supports controlled value, orientation, className and ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(group({ value: 'pro', orientation: 'horizontal', className: 'mine', ref }));
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(ref.current).toHaveClass('umbra-radio-group', 'mine');
    expect(ref.current).toHaveAttribute('aria-orientation', 'horizontal');
  });
});

describe('Switch', () => {
  it('toggles by click, Space and Enter', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch onCheckedChange={onCheckedChange}>Alerts</Switch>);
    const sw = screen.getByRole('switch', { name: 'Alerts' });
    await userEvent.click(sw);
    expect(sw).toBeChecked();
    await userEvent.keyboard(' ');
    expect(sw).not.toBeChecked();
    await userEvent.keyboard('{Enter}');
    expect(sw).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledTimes(3);
  });

  it('supports controlled state, size, disabled and ref', async () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} checked size="sm" disabled aria-label="Alerts" className="mine" />);
    expect(ref.current).toBeChecked();
    expect(ref.current).toHaveClass('umbra-switch', 'mine');
    expect(ref.current).toHaveAttribute('data-size', 'sm');
    await userEvent.click(ref.current!);
    expect(ref.current).toBeChecked();
  });
});

it('choice controls have no axe violations', async () => {
  const { container } = render(
    <>
      <Checkbox>Accept</Checkbox>
      <Checkbox checked="indeterminate" aria-label="All" />
      <RadioGroup aria-label="Plan" defaultValue="a"><Radio value="a">A</Radio><Radio value="b">B</Radio></RadioGroup>
      <Switch>Alerts</Switch>
    </>,
  );
  await expectNoA11yViolations(container);
});
