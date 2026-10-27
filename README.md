# InkForge
A Markdown-to-static-site publishing engine (Next.js 15, TypeScript strict).

## Use
- `npm install`, `npm run dev`
- Add `content/posts/my-post.md` with frontmatter: `title`, `description`, `date` (required); `slug`, `updatedAt`, `author`, `tags`, `category`, `featured`, `draft` (optional).
- `npm run check-content` validates; `npm test` runs engine tests; `npm run build` writes the static site to `out/`; `npm run preview` serves it.
- Set the public URL with `SITE_URL` (see `src/lib/site.ts`). Deploy `out/` to any static host.

## Security
Raw HTML is dropped by remark-rehype and output is also passed through rehype-sanitize (strips scripts and `javascript:` URLs).
