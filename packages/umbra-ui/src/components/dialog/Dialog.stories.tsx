import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button/Button';
import { FormField } from '../form-field/FormField';
import { Input } from '../input/Input';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from './Dialog';

const meta: Meta<typeof DialogContent> = {
  title: 'Static/Dialog',
  component: DialogContent,
  args: { title: 'Delete project', description: 'This removes all deployments and domains. It cannot be undone.', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button tone="danger" variant="soft">Delete project</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <FormField label="Type the project name to confirm">
          <Input placeholder="acme-production" />
        </FormField>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" tone="neutral">Cancel</Button>
          </DialogClose>
          <Button tone="danger">Delete project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
export default meta;
type Story = StoryObj<typeof DialogContent>;

export const Playground: Story = {};
export const Open: Story = {
  render: (args) => (
    <Dialog defaultOpen>
      <DialogContent {...args}>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" tone="neutral">Cancel</Button>
          </DialogClose>
          <Button tone="danger">Delete project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  decorators: [(Story) => <div style={{ minHeight: 360 }}><Story /></div>],
};
export const Small: Story = { ...Open, args: { size: 'sm' } };
export const Large: Story = { ...Open, args: { size: 'lg' } };
export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open from state</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent {...args} title="Controlled dialog" description="Open state lives in the parent.">
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  },
};
