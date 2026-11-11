import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../checkbox/Checkbox';
import { Input } from '../input/Input';
import { Stack } from '../layout/Layout';
import { Radio, RadioGroup } from '../radio/Radio';
import { Select, SelectItem } from '../select/Select';
import { Textarea } from '../textarea/Textarea';
import { FormField } from './FormField';

const meta: Meta<typeof FormField> = {
  title: 'Static/FormField',
  component: FormField,
  args: { label: 'Project name', description: 'Lowercase letters, numbers and dashes.' },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof FormField>;

export const Playground: Story = { render: (args) => <FormField {...args}><Input placeholder="acme-production" /></FormField> };
export const Required: Story = { ...Playground, args: { required: true } };
export const WithError: Story = {
  args: { error: 'That name is already taken.' },
  render: (args) => <FormField {...args}><Input defaultValue="acme" /></FormField>,
};
export const Disabled: Story = { ...Playground, args: { disabled: true } };
export const EveryControl: Story = {
  render: () => (
    <Stack gap="5">
      <FormField label="Name" required><Input /></FormField>
      <FormField label="Notes" description="Markdown is supported."><Textarea /></FormField>
      <FormField label="Region">
        <Select placeholder="Choose a region">
          <SelectItem value="iad">Washington, D.C.</SelectItem>
          <SelectItem value="fra">Frankfurt</SelectItem>
        </Select>
      </FormField>
      <FormField label="Visibility">
        <RadioGroup defaultValue="private">
          <Radio value="private">Private</Radio>
          <Radio value="public">Public</Radio>
        </RadioGroup>
      </FormField>
      <Checkbox>Email me when a deployment fails</Checkbox>
    </Stack>
  ),
};
