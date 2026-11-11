import createMDX from '@next/mdx';

const withMDX = createMDX({});

// Set when the site is served from a sub-path, e.g. "/umbraui" for a GitHub Pages project site.
// Leave unset for Vercel, a custom domain, or a <user>.github.io repository.
const basePath = process.env.DOCS_BASE_PATH?.replace(/\/$/, '') || undefined;

/** Fully static: `next build` writes the site to ./out, which Vercel, GitHub Pages or any static host serves as-is. */
export default withMDX({
  output: 'export',
  basePath,
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: { unoptimized: true },
  trailingSlash: true,
});
