import createMDX from '@next/mdx';

const withMDX = createMDX({});

/** Fully static: `next build` writes the site to ./out, which Vercel (or any static host) serves as-is. */
export default withMDX({
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: { unoptimized: true },
  trailingSlash: true,
});
