import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema, type Options } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export interface Post { slug: string; title: string; description: string; date: string; updatedAt?: string; author: string; tags: string[]; category: string; featured: boolean; draft: boolean; readingMinutes: number; html: string; }

const DIR = path.join(process.cwd(), "content", "posts");

export function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
export function readingMinutes(text: string): number {
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
}
function isoDate(v: unknown, field: string, file: string): string {
  const d = v instanceof Date ? v : new Date(String(v));
  if (!v || Number.isNaN(d.getTime())) throw new Error(`${file}: "${field}" must be a valid date (YYYY-MM-DD), got ${JSON.stringify(v)}`);
  return d.toISOString().slice(0, 10);
}
// Raw HTML in Markdown is dropped by remark-rehype; sanitize additionally strips unsafe URLs (javascript:) and scripts.
const schema: Options = { ...defaultSchema, attributes: { ...defaultSchema.attributes, code: [...(defaultSchema.attributes?.code ?? []), ["className", /^language-./, /^hljs/]], span: [...(defaultSchema.attributes?.span ?? []), ["className", /^hljs/]] } };

export async function renderMarkdown(md: string): Promise<string> {
  const out = await unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSlug).use(rehypeSanitize, schema).use(rehypeHighlight, { detect: false }).use(rehypeStringify).process(md);
  return String(out);
}
export function parsePost(file: string, raw: string): Omit<Post, "html"> & { body: string } {
  const { data, content } = matter(raw);
  const str = (k: string): string => { if (typeof data[k] !== "string" || !data[k].trim()) throw new Error(`${file}: missing required "${k}"`); return data[k].trim(); };
  if (data.tags !== undefined && !Array.isArray(data.tags)) throw new Error(`${file}: "tags" must be a list`);
  const slug = data.slug ? slugify(String(data.slug)) : slugify(path.basename(file, path.extname(file)));
  if (!slug) throw new Error(`${file}: could not derive a slug`);
  return { slug, title: str("title"), description: str("description"), date: isoDate(data.date, "date", file), updatedAt: data.updatedAt ? isoDate(data.updatedAt, "updatedAt", file) : undefined, author: typeof data.author === "string" ? data.author : SITE_AUTHOR, tags: (data.tags ?? []).map(String), category: typeof data.category === "string" ? data.category : "Notes", featured: data.featured === true, draft: data.draft === true, readingMinutes: readingMinutes(content), body: content };
}
const SITE_AUTHOR = "InkForge";

let cache: Promise<Post[]> | null = null;
export function getAllPosts(includeDrafts = process.env.NODE_ENV !== "production"): Promise<Post[]> {
  cache ??= (async () => {
    const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => /\.mdx?$/.test(f)).sort() : [];
    const seen = new Map<string, string>();
    const posts: Post[] = [];
    for (const f of files) {
      const { body, ...meta } = parsePost(f, fs.readFileSync(path.join(DIR, f), "utf8"));
      if (seen.has(meta.slug)) throw new Error(`Duplicate slug "${meta.slug}" in ${seen.get(meta.slug)} and ${f}. Set an explicit "slug" in one of them.`);
      seen.set(meta.slug, f);
      posts.push({ ...meta, html: await renderMarkdown(body) });
    }
    return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  })();
  return cache.then((p) => (includeDrafts ? p : p.filter((x) => !x.draft)));
}
export const getPost = async (slug: string) => (await getAllPosts()).find((p) => p.slug === slug);
export const getTags = async () => { const m = new Map<string, number>(); for (const p of await getAllPosts()) for (const t of p.tags) m.set(t, (m.get(t) ?? 0) + 1); return [...m].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])); };
