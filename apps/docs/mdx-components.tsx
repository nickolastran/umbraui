import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/components/CodeBlock';

const text = (node: unknown): string =>
  typeof node === 'string' ? node : Array.isArray(node) ? node.map(text).join('') : ((node as { props?: { children?: unknown } })?.props?.children ? text((node as { props: { children: unknown } }).props.children) : '');

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: ({ children }) => <CodeBlock code={text(children).trimEnd()} />,
  };
}
