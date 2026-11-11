import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button/Button';
import { FormField } from '../form-field/FormField';
import { Input } from '../input/Input';
import { Stack } from '../layout/Layout';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './Popover';

const meta: Meta<typeof PopoverContent> = {
  title: 'Static/Popover',
  component: PopoverContent,
  args: { side: 'bottom', align: 'start', arrow: false },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  decorators: [(Story) => <div style={{ minHeight: 240, padding: 60 }}><Story /></div>],
  render: (args) => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="soft" tone="neutral">Rename</Button>
      </PopoverTrigger>
      <PopoverContent {...args}>
        <Stack gap="3">
          <FormField label="Branch name">
            <Input defaultValue="feat/tokens" />
          </FormField>
          <PopoverClose asChild>
            <Button size="sm">Save name</Button>
          </PopoverClose>
        </Stack>
      </PopoverContent>
    </Popover>
  ),
};
export default meta;
type Story = StoryObj<typeof PopoverContent>;

export const Playground: Story = {};
export const WithArrow: Story = { args: { arrow: true } };
export const Right: Story = { args: { side: 'right', arrow: true } };
