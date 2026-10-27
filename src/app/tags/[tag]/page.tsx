import Link from "next/link";
import { getAllPosts, getTags } from "../../../lib/content";
type P = { params: Promise<{ tag: string }> };
export const dynamicParams = false;
export async function generateStaticParams() { const t = await getTags(); return t.length ? t.map(([tag]) => ({ tag })) : [{ tag: "none" }]; }
export default async function Tag({ params }: P) {
  const tag = decodeURIComponent((await params).tag); const posts = (await getAllPosts()).filter((p) => p.tags.includes(tag));
  return (<div className="wrap"><section className="hero"><div className="kicker sans">Tag</div><h1>#{tag}</h1></section>
    <section className="list">{posts.length === 0 ? <p className="empty sans">No articles with this tag.</p> : posts.map((p) => (<article className="item" key={p.slug}><div className="meta sans">{p.date}</div><div><h2><Link href={`/posts/${p.slug}/`}>{p.title}</Link></h2><p>{p.description}</p></div></article>))}</section></div>);
}
