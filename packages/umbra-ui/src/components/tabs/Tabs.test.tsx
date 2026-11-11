import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { expectNoA11yViolations } from '../../test/axe';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const tabs = (props: Partial<React.ComponentProps<typeof Tabs>> = {}) => (
  <Tabs defaultValue="a" {...props}>
    <TabsList aria-label="Sections">
      <TabsTrigger value="a">Alpha</TabsTrigger>
      <TabsTrigger value="b">Beta</TabsTrigger>
      <TabsTrigger value="c" disabled>Gamma</TabsTrigger>
    </TabsList>
    <TabsContent value="a">Panel A</TabsContent>
    <TabsContent value="b">Panel B</TabsContent>
    <TabsContent value="c">Panel C</TabsContent>
  </Tabs>
);

describe('Tabs', () => {
  it('shows the default panel and forwards variant, size, className and ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(tabs({ ref, variant: 'pill', size: 'sm', className: 'mine' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
    expect(ref.current).toHaveClass('umbra-tabs', 'mine');
    expect(ref.current).toHaveAttribute('data-variant', 'pill');
    expect(screen.getByRole('tablist', { name: 'Sections' })).toBeInTheDocument();
  });

  it('switches on click and calls onValueChange', async () => {
    const onValueChange = vi.fn();
    render(tabs({ onValueChange }));
    await userEvent.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('arrow keys, Home and End move between enabled tabs', async () => {
    render(tabs());
    await userEvent.tab();
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
  });

  it('supports controlled value', () => {
    const { rerender } = render(tabs({ value: 'b', defaultValue: undefined }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
    rerender(tabs({ value: 'a', defaultValue: undefined }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
  });

  it('has no axe violations', async () => {
    const { container } = render(tabs());
    await expectNoA11yViolations(container);
  });
});
