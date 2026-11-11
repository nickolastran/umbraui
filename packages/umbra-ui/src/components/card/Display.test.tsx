import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { expectNoA11yViolations } from '../../test/axe';
import { Alert } from '../alert/Alert';
import { Avatar } from '../avatar/Avatar';
import { Badge } from '../badge/Badge';
import { Divider } from '../divider/Divider';
import { Kbd } from '../kbd/Kbd';
import { Box, Container, Grid, Inline, Stack } from '../layout/Layout';
import { Skeleton } from '../skeleton/Skeleton';
import { Table, TableBody, TableCaption, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '../table/Table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

describe('Card', () => {
  it('renders its parts with variants, className, rest props and ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} variant="outline" size="lg" className="mine" data-testid="c">
        <CardHeader><CardTitle>Title</CardTitle><CardDescription>Desc</CardDescription></CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(ref.current).toBe(screen.getByTestId('c'));
    expect(ref.current).toHaveClass('umbra-card', 'mine');
    expect(ref.current).toHaveAttribute('data-variant', 'outline');
    expect(ref.current).toHaveAttribute('data-size', 'lg');
    expect(screen.getByRole('heading', { level: 3, name: 'Title' })).toHaveClass('umbra-card__title');
  });

  it('interactive asChild card is a single keyboard-reachable link', async () => {
    render(<Card interactive asChild><a href="/x">Open</a></Card>);
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Open' })).toHaveFocus();
    expect(screen.getByRole('link')).toHaveClass('umbra-card');
  });
});

describe('Badge', () => {
  it('renders tone, variant, size, dot, className and ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref} tone="success" variant="solid" size="sm" dot className="mine">Live</Badge>);
    expect(ref.current).toHaveTextContent('Live');
    expect(ref.current).toHaveClass('umbra-badge', 'mine');
    expect(ref.current).toHaveAttribute('data-tone', 'success');
    expect(ref.current).toHaveAttribute('data-variant', 'solid');
    expect(ref.current!.querySelector('.umbra-badge__dot')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('Avatar', () => {
  it('shows initials named after the person until the image loads', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} name="Ada Lovelace" src="/ada.png" size="lg" shape="square" className="mine" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
    expect(ref.current).toHaveClass('umbra-avatar', 'mine');
    expect(ref.current).toHaveAttribute('data-size', 'lg');
  });
  it('handles single names', () => {
    render(<Avatar name="Plato" />);
    expect(screen.getByRole('img', { name: 'Plato' })).toHaveTextContent('P');
  });
});

describe('Alert', () => {
  it('uses role=alert for danger/warning and role=status otherwise', () => {
    render(<><Alert tone="danger" title="Failed">Build broke</Alert><Alert tone="success" title="Done" /></>);
    expect(screen.getByRole('alert')).toHaveTextContent('FailedBuild broke');
    expect(screen.getByRole('status')).toHaveTextContent('Done');
  });
  it('dismiss button is keyboard operable', async () => {
    const onDismiss = vi.fn();
    render(<Alert title="Heads up" onDismiss={onDismiss} dismissLabel="Close alert" />);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Close alert' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onDismiss).toHaveBeenCalledOnce();
  });
  it('icon can be replaced or removed; className and ref are forwarded', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Alert ref={ref} icon={null} className="mine" title="Plain" />);
    expect(container.querySelector('.umbra-alert__icon')).toBeNull();
    expect(ref.current).toHaveClass('umbra-alert', 'mine');
  });
});

describe('Table', () => {
  it('renders semantic table structure', () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <TableContainer aria-label="Deployments">
        <Table ref={ref} size="sm" interactive className="mine">
          <TableCaption>Deployments</TableCaption>
          <TableHeader><TableRow><TableHead>Id</TableHead><TableHead numeric>Time</TableHead></TableRow></TableHeader>
          <TableBody><TableRow selected><TableCell>a1</TableCell><TableCell numeric>42</TableCell></TableRow></TableBody>
        </Table>
      </TableContainer>,
    );
    expect(screen.getByRole('table', { name: 'Deployments' })).toBe(ref.current);
    expect(ref.current).toHaveClass('umbra-table', 'mine');
    expect(screen.getByRole('columnheader', { name: 'Id' })).toHaveAttribute('scope', 'col');
    expect(screen.getByRole('row', { name: 'a1 42' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('cell', { name: '42' })).toHaveAttribute('data-numeric');
  });
  it('scroll container is focusable by keyboard', async () => {
    render(<TableContainer aria-label="Deployments"><Table><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table></TableContainer>);
    await userEvent.tab();
    expect(screen.getByRole('region', { name: 'Deployments' })).toHaveFocus();
  });
});

describe('Skeleton, Kbd, Divider', () => {
  it('Skeleton is hidden from assistive tech and sized by props', () => {
    const { container } = render(<Skeleton variant="rect" width={120} height="2rem" animated={false} className="mine" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveClass('umbra-skeleton', 'mine');
    expect(el).toHaveStyle({ width: '120px', height: '2rem' });
    expect(el).not.toHaveAttribute('data-animated');
  });
  it('Kbd renders a <kbd>', () => {
    const ref = createRef<HTMLElement>();
    render(<Kbd ref={ref} size="sm">⌘K</Kbd>);
    expect(ref.current!.tagName).toBe('KBD');
    expect(ref.current).toHaveAttribute('data-size', 'sm');
  });
  it('Divider is decorative by default and a separator when asked', () => {
    const { rerender, container } = render(<Divider />);
    expect(container.firstChild).toHaveAttribute('role', 'none');
    rerender(<Divider decorative={false} orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });
});

describe('Layout primitives', () => {
  it('resolve spacing props to token variables and support `as`', () => {
    render(
      <Container as="main" size="sm" data-testid="container">
        <Stack gap="6" align="center" data-testid="stack">
          <Inline gap="1.5" justify="between" wrap={false} data-testid="inline" />
          <Grid columns={3} gap="2" data-testid="grid" />
          <Grid minItemWidth="200px" data-testid="auto" />
          <Box padding="4" paddingX="8" surface="surface-2" radius="md" bordered data-testid="box" />
        </Stack>
      </Container>,
    );
    expect(screen.getByRole('main')).toHaveAttribute('data-size', 'sm');
    expect(screen.getByTestId('stack').style.gap).toBe('var(--umbra-space-6)');
    expect(screen.getByTestId('stack').style.alignItems).toBe('center');
    expect(screen.getByTestId('inline').style.gap).toBe('var(--umbra-space-1_5)');
    expect(screen.getByTestId('inline').style.justifyContent).toBe('space-between');
    expect(screen.getByTestId('inline').style.flexWrap).toBe('nowrap');
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
    expect(screen.getByTestId('auto').style.gridTemplateColumns).toContain('auto-fit');
    const box = screen.getByTestId('box');
    expect(box.style.paddingInline).toBe('var(--umbra-space-8)');
    expect(box.style.backgroundColor).toBe('var(--umbra-color-surface-2)');
    expect(box).toHaveAttribute('data-bordered');
  });
});

it('display components have no axe violations', async () => {
  const { container } = render(
    <main>
      <Card><CardHeader><CardTitle>Title</CardTitle></CardHeader><CardContent>Body</CardContent></Card>
      <Badge tone="info">New</Badge>
      <Avatar name="Ada Lovelace" />
      <Alert tone="warning" title="Careful" onDismiss={() => {}}>Body</Alert>
      <TableContainer aria-label="Data">
        <Table><TableCaption>Data</TableCaption><TableHeader><TableRow><TableHead>A</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>1</TableCell></TableRow></TableBody></Table>
      </TableContainer>
      <Skeleton /><Kbd>K</Kbd><Divider /><Divider decorative={false} />
    </main>,
  );
  await expectNoA11yViolations(container);
});
