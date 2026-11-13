import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";
const css=readFileSync(new URL("../integrations/headless/motion.css",import.meta.url),"utf8");
const js=readFileSync(new URL("../integrations/headless/motion.mjs",import.meta.url),"utf8");
test("portable motion honors accessibility and privacy",()=>{assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/data-moore-motion/);assert.match(js,/IntersectionObserver/);assert.match(js,/requestAnimationFrame/);assert.match(js,/if\(reduced.matches\)return/);assert.doesNotMatch(js,/fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|document.cookie/)});
