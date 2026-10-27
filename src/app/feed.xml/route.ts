import { getAllPosts } from "../../lib/content";
import { SITE } from "../../lib/site";
export const dynamic = "force-static";
const esc = (s: string) => s.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
export async function GET() {
  const posts = await getAllPosts(false);
  const items = posts.map((p) => `<item><title>${esc(p.title)}</title><link>${SITE.url}/posts/${p.slug}/</link><guid>${SITE.url}/posts/${p.slug}/</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(SITE.name)}</title><link>${SITE.url}/</link><description>${esc(SITE.description)}</description>${items}</channel></rss>`, { headers: { "Content-Type": "application/rss+xml" } });
}
