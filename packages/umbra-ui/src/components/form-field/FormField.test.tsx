import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/axe';
import { Input } from '../input/Input';
import { Radio, RadioGroup } from '../radio/Radio';
import { Select, SelectItem } from '../select/Select';
import { Switch } from '../switch/Switch';
import { Textarea } from '../textarea/Textarea';
import { FormField } from './FormField';

describe('FormField', () => {
  it('labels the control and links description', () => {
    render(<FormField label="Email" description="We never share it."><Input /></FormField>);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleDescription('We never share it.');
    expect(input).toBeValid();
  });

  it('marks the control invalid and announces the error', () => {
    render(<FormField label="Email" description="Work address" error="Enter a valid email."><Input /></FormField>);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription('Enter a valid email. Work address');
    expect(screen.getByText('Enter a valid email.')).toHaveAttribute('aria-live', 'polite');
  });

  it('passes required and disabled down; explicit props win', () => {
    render(<FormField label="Email" required disabled><Input disabled={false} /></FormField>);
    const input = screen.getByRole('textbox', { name: /Email/ });
    expect(input).toBeRequired();
    expect(input).toBeEnabled();
  });

  it('clicking the label focuses the control', async () => {
    render(<FormField label="Notes"><Textarea /></FormField>);
    await userEvent.click(screen.getByText('Notes'));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('wires Select, Switch and RadioGroup', () => {
    render(
      <>
        <FormField label="Region"><Select placeholder="Pick"><SelectItem value="a">A</SelectItem></Select></FormField>
        <FormField label="Alerts"><Switch /></FormField>
        <FormField label="Plan" error="Choose a plan."><RadioGroup><Radio value="a">A</Radio></RadioGroup></FormField>
      </>,
    );
    expect(screen.getByRole('combobox', { name: 'Region' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Alerts' })).toBeInTheDocument();
    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group).toHaveAccessibleDescription('Choose a plan.');
    expect(group).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards className and rest props, and has no axe violations', async () => {
    const { container } = render(
      <FormField label="Email" description="Work address" error="Required." className="mine" data-testid="f"><Input /></FormField>,
    );
    expect(screen.getByTestId('f')).toHaveClass('umbra-field', 'mine');
    await expectNoA11yViolations(container);
  });
});
