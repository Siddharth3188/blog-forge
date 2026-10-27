import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "../../../lib/content";
type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export async function generateStaticParams() { return (await getAllPosts()).map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getPost((await params).slug); if (!p) return {};
  return { title: p.title, description: p.description, alternates: { canonical: `/posts/${p.slug}/` }, openGraph: { title: p.title, description: p.description, type: "article", publishedTime: p.date }, twitter: { card: "summary", title: p.title, description: p.description } };
}
export default async function Post({ params }: P) {
  const p = await getPost((await params).slug); if (!p) notFound();
  const all = await getAllPosts(); const i = all.findIndex((x) => x.slug === p.slug); const next = all[i - 1]; const prev = all[i + 1];
  return (<article className="post">
    <Link href="/" className="meta sans">← All articles</Link>
    <div className="kicker sans" style={{ marginTop: "1.5rem" }}>{p.category}</div><h1>{p.title}</h1>
    <p className="meta sans">{p.author} · {p.date}{p.updatedAt && ` · updated ${p.updatedAt}`} · {p.readingMinutes} min read</p>
    <div className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />
    <hr style={{ margin: "3rem 0 1rem", border: 0, borderTop: "1px solid var(--line)" }} />
    <nav className="sans meta" style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }} aria-label="More articles">{prev ? <Link href={`/posts/${prev.slug}/`}>← {prev.title}</Link> : <span />}{next && <Link href={`/posts/${next.slug}/`}>{next.title} →</Link>}</nav>
  </article>);
}
