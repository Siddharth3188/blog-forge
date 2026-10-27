---
title: "Why Static-First Publishing Still Wins"
description: "Pre-rendering every page at build time gives you speed, security and very cheap hosting."
date: "2026-10-20"
tags: [Engineering, Web]
category: "Engineering"
---

A static site is compiled once and served as files. There is no server to patch and nothing to scale.

## What you trade

You give up request-time personalization. For articles that rarely change, that is a bargain.

```ts
export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}
```
