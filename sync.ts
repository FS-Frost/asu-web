import { $ } from "bun";

await $`cp ../asu-regex-js/build/asu.browser.js src/lib/asu/asu.browser.js`;
await $`cp ../asu-regex-js/build/asu.browser.js.map src/lib/asu/asu.browser.js.map`;
await $`cp ../asu-regex-js/build/asu.browser.d.ts src/lib/asu/asu.browser.d.ts`;
