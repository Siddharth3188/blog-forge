import assert from "node:assert/strict";
import { slugify, readingMinutes, parsePost, renderMarkdown } from "../src/lib/content";
assert.equal(slugify("Héllo, World!"), "hello-world");
assert.equal(readingMinutes("word ".repeat(440)), 2);
assert.throws(() => parsePost("a.md", "---\ntitle: x\n---\nhi"), /description/);
assert.throws(() => parsePost("a.md", "---\ntitle: x\ndescription: y\ndate: nope\n---\n"), /valid date/);
renderMarkdown('[x](javascript:alert(1)) <script>alert(1)</script>\n\n```ts\nconst a = 1\n```').then((h) => { assert.ok(!/javascript:|<script/i.test(h)); assert.ok(h.includes("hljs")); console.log("All tests passed"); });
