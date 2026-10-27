import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "../lib/site";
export const metadata: Metadata = { metadataBase: new URL(SITE.url), title: { default: SITE.name, template: `%s — ${SITE.name}` }, description: SITE.description, alternates: { canonical: "./", types: { "application/rss+xml": "/feed.xml" } }, openGraph: { siteName: SITE.name, type: "website" }, twitter: { card: "summary" } };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>
    <header className="top sans"><div className="wrap"><Link href="/" className="brand">Ink<b>Forge</b></Link><nav aria-label="Primary"><Link href="/">Articles</Link><a href="/feed.xml">RSS</a></nav></div></header>
    <main>{children}</main>
    <footer className="sans"><div className="wrap">{SITE.name} — statically generated from Markdown.</div></footer>
  </body></html>);
}
