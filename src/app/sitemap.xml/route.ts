import { getAllPosts, getTags } from "../../lib/content";
import { SITE } from "../../lib/site";
export const dynamic = "force-static";
export async function GET() {
  const posts = await getAllPosts(false); const tags = await getTags();
  const urls = [`${SITE.url}/`, ...posts.map((p) => `${SITE.url}/posts/${p.slug}/`), ...tags.map(([t]) => `${SITE.url}/tags/${encodeURIComponent(t)}/`)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${u}</loc></url>`).join("")}</urlset>`, { headers: { "Content-Type": "application/xml" } });
}
