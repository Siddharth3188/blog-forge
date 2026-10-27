import Link from "next/link";
import { getAllPosts, getTags } from "../lib/content";
export default async function Home() {
  const posts = await getAllPosts(); const tags = await getTags(); const [lead, ...rest] = posts;
  return (<div className="wrap">
    <section className="hero"><div className="kicker sans">A Markdown-first publication</div><h1>Write in plain text. Publish as a craft.</h1><p>Essays and field notes on building software, set in type meant for reading. Every page here is compiled from a Markdown file.</p></section>
    {!lead ? (<div className="empty sans"><p>No articles yet. Add <code>content/posts/hello.md</code> with a <code>title</code>, <code>description</code> and <code>date</code>, then run <code>npm run build</code>.</p></div>) : (<>
      <section className="list" aria-label="Latest articles">
        {[lead, ...rest].map((p, i) => (<article className="item" key={p.slug}>
          <div className="meta sans">{p.date}<br />{p.readingMinutes} min read</div>
          <div>{i === 0 && p.featured && <div className="kicker sans">Featured</div>}<h2><Link href={`/posts/${p.slug}/`}>{p.title}</Link></h2><p>{p.description}</p><div style={{ marginTop: ".5rem" }}>{p.tags.map((t) => <Link key={t} className="tag sans" href={`/tags/${encodeURIComponent(t)}/`}>#{t}</Link>)}</div></div>
        </article>))}
      </section>
      {tags.length > 0 && <p className="sans meta">Browse: {tags.map(([t, n]) => <Link key={t} className="tag" href={`/tags/${encodeURIComponent(t)}/`}>{t} ({n})</Link>)}</p>}</>)}
  </div>);
}
