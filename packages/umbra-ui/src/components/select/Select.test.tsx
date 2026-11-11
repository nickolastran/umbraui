import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { expectNoA11yViolations } from '../../test/axe';
import { Select, SelectGroup, SelectItem, SelectSeparator } from './Select';

const setup = (props: Partial<React.ComponentProps<typeof Select>> = {}) =>
  render(
    <Select aria-label="Region" placeholder="Choose a region" {...props}>
      <SelectGroup label="Europe">
        <SelectItem value="fra">Frankfurt</SelectItem>
        <SelectItem value="lhr">London</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectItem value="iad" disabled>Washington</SelectItem>
    </Select>,
  );

describe('Select', () => {
  it('renders a combobox trigger with placeholder, className and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    setup({ ref, className: 'mine', size: 'lg' });
    const trigger = screen.getByRole('combobox', { name: 'Region' });
    expect(trigger).toHaveTextContent('Choose a region');
    expect(trigger).toHaveClass('umbra-select', 'mine');
    expect(trigger).toHaveAttribute('data-size', 'lg');
    expect(ref.current).toBe(trigger);
  });

  it('opens with the keyboard, moves with arrows and selects with Enter', async () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Europe' })).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('lhr');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent('London');
    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it('closes on Escape without changing the value', async () => {
    const onValueChange = vi.fn();
    setup({ defaultOpen: true, defaultValue: 'fra', onValueChange });
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('supports controlled value', () => {
    const { rerender } = setup({ value: 'fra' });
    expect(screen.getByRole('combobox')).toHaveTextContent('Frankfurt');
    rerender(
      <Select aria-label="Region" value="lhr">
        <SelectItem value="fra">Frankfurt</SelectItem>
        <SelectItem value="lhr">London</SelectItem>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('London');
  });

  it('disabled and invalid states', () => {
    setup({ disabled: true, invalid: true });
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('has no axe violations closed or open', async () => {
    setup({ defaultOpen: true });
    await expectNoA11yViolations(document.body);
    await userEvent.keyboard('{Escape}');
    await expectNoA11yViolations(document.body);
  });
});
