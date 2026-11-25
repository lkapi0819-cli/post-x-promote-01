// post-x-promote-make-your-own-bounty-01 entry program (Node 22, standard library only).
//
// The entry itself is a post on X: a quote of make.fun's make-your-own-bounty
// post, with a photo of its own attached and the entrant's play code in its
// text. This program's only job is to hand the post's address to the grader:
// it copies POST.json from the repository root to /output/POST.json, byte for
// byte, after checking the file is shaped like a post address.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly on a malformed POST.json instead of handing the grader a file
// it cannot read: the address must be a JSON object whose url is an X post
// address, https://x.com/<handle>/status/<id> (or the same on twitter.com).
const post = JSON.parse(readFileSync(join(BOT_DIR, 'POST.json'), 'utf8')) as { url?: unknown };
if (typeof post.url !== 'string' || !/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/.test(post.url)) {
  console.error('POST.json holds no usable X post url');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
console.log(`handed in the post: ${post.url}`);
