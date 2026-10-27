import { getAllPosts } from "../src/lib/content";
getAllPosts(true).then((p) => console.log(`OK: ${p.length} post(s) valid`)).catch((e) => { console.error(`Content error: ${e.message}`); process.exit(1); });
