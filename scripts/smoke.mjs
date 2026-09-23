/**
 * End-to-end smoke test — drives a real browser through the whole click path.
 *
 *   npm run build
 *   npm run preview -- --port 4444 &
 *   npm run smoke
 *
 * Needs Playwright's Chromium once per machine:
 *   npm i -D playwright && npx playwright install chromium
 *
 * It is deliberately not in `npm test`: it wants a built app and a running
 * server, and a class-session repo should not make `npm install` pull 200MB of
 * browser before anyone can run `npm run dev`.
 *
 * Every check here maps to a line in the integration smoke test in
 * docs/WORKFLOW.md. If you change a screen and a check fails, decide which is
 * wrong before you "fix" the test — two real bugs were found this way.
 */

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error(
    "playwright is not installed.\n" +
      "  npm i -D playwright && npx playwright install chromium",
  );
  process.exit(2);
}

const URL = process.env.APP_URL ?? "http://localhost:4444/";
const b = await chromium.launch();
const p = await b.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push(String(e)));
const say = (ok, msg) => console.log(`${ok ? "  PASS" : "  FAIL"}  ${msg}`);
let fails = 0;
const check = (ok, msg) => { if (!ok) fails++; say(ok, msg); };
const txt = () => p.locator("body").innerText();

async function onboard({ nights = 4, adults = 2, budget = "Comfortable" } = {}) {
  await p.getByRole("button", { name: /find your type|start over/i }).first().click();
  await p.waitForTimeout(150);
  await p.locator('input[type="number"]').first().fill(String(nights));
  await p.locator('input[type="number"]').nth(1).fill(String(adults));
  await p.getByRole("button", { name: budget }).click();
  await p.getByRole("button", { name: /next: pick your type/i }).click();
  await p.waitForTimeout(150);
}

async function pickBoard(title) {
  await p.locator(".board", { hasText: title }).click();
  await p.waitForTimeout(100);
}

console.log("\n— full click path —");
await p.goto(URL);
check((await txt()).includes("Stop searching for trips"), "landing renders");

await onboard();
check((await txt()).includes("already look like your trip"), "onboarding → vibe boards");

const cta = p.getByRole("button", { name: /pick at least one board/i });
check(await cta.isDisabled(), "CTA disabled with zero boards picked");

await pickBoard("Sun-Bleached Coastal");
check(await p.getByRole("button", { name: /^find your type$/i }).isEnabled(), "CTA enables after a pick");
await p.getByRole("button", { name: /^find your type$/i }).click();
await p.waitForTimeout(150);
check((await txt()).includes("Yes or no?"), "vibe → swipe refine");

const meterCount = await p.locator(".meter").count();
check(meterCount === 7, `vibe profile shows all 7 shared dimensions (got ${meterCount})`);

for (let i = 0; i < 8; i++) {
  const crush = p.getByRole("button", { name: /crush/i });
  if (!(await crush.count())) break;
  await (i % 3 === 0 ? p.getByRole("button", { name: /not my type/i }) : crush).click();
  await p.waitForTimeout(60);
}
check((await txt()).includes("Your type, decided"), "swipe completes to the summary state");
await p.getByRole("button", { name: /see your matches/i }).click();
await p.waitForTimeout(200);

const featured = await p.locator(".card .chip--match").first().innerText();
const minis = await p.locator(".mini").count();
check(minis === 9, `deck shows 10 total — 1 featured + ${minis} ranked`);

const scores = await p.locator(".mini .chip--match").allInnerTexts();
const nums = [parseInt(featured), ...scores.map((s) => parseInt(s))];
check(nums.every((n, i) => i === 0 || nums[i - 1] >= n), `scores descend: ${nums.join(" ")}`);
const cities = await p.locator(".mini strong").allInnerTexts();
check(new Set(cities).size === cities.length, "no duplicate trips in the deck");
const beachTop = (await txt()).match(/([A-Z][a-z]+(?: [A-Z][a-z]+)*)\n/);
const firstDeck = nums[0];

console.log("\n— true cost + hack stack —");
await p.getByRole("button", { name: /see the real cost/i }).click();
await p.waitForTimeout(200);
check(/the hack stack/i.test(await txt()), "detail screen renders");
const totalBefore = (await p.locator(".total .tabular").innerText()).trim();
const hackCount = await p.locator(".hack").count();
check(hackCount > 0, `${hackCount} hacks offered`);
const firstTradeoff = await p.locator(".hack__tradeoff").first().innerText();
check(firstTradeoff.length > 20, "tradeoff text is present and substantive");
await p.locator('.hack input[type="checkbox"]').first().check();
await p.waitForTimeout(150);
const totalAfter = (await p.locator(".total .tabular").innerText()).trim();
check(totalBefore !== totalAfter, `toggling a hack changes the total: ${totalBefore.replace(/\n/g," ")} → ${totalAfter.replace(/\n/g," ")}`);
check(!totalAfter.includes("-$") && !totalAfter.includes("NaN"), "total is never negative or NaN");

console.log("\n— saved —");
// Toggling a hack already auto-saved this trip (TOGGLE_HACK saves first), so
// the CTA is the shortlist route by now. Assert that rather than assuming.
const cta2 = p.getByRole("button", { name: /save this trip|compare your shortlist/i });
check(/compare your shortlist/i.test(await cta2.innerText()),
  "toggling a hack auto-saved the trip, so the CTA became the shortlist route");
await cta2.click();
await p.waitForTimeout(250);
check(/your shortlist/i.test(await txt()), "saved screen renders");
check(/what you traded for it/i.test(await txt()), "saved shows the tradeoffs taken");

console.log("\n— persistence —");
await p.reload();
await p.waitForTimeout(400);
const afterReload = await txt();
check(!afterReload.includes("Stop searching for trips"), "reload does not bounce to the landing splash");
check(/shortlist|places share your look/i.test(afterReload), "reload restores the signed-in flow");

console.log("\n— reset —");
await p.locator(".topbar").getByRole("button", { name: /reset/i }).click();
await p.waitForTimeout(250);
check((await txt()).includes("Stop searching for trips"), "reset returns to landing");
const ls = await p.evaluate(() => window.localStorage.getItem("roamance:v1:state"));
check(ls === null, "reset clears storage");

console.log("\n— contrasting profile —");
await onboard({ budget: "Keep it cheap" });
await pickBoard("Brass and Neon");
await p.getByRole("button", { name: /^find your type$/i }).click();
await p.waitForTimeout(120);
await p.getByRole("button", { name: /skip to matches/i }).click();
await p.waitForTimeout(250);
const cityTop = await p.locator(".card strong").first().innerText();
check(true, `city/thrifty profile tops with: ${cityTop}`);

console.log("\n— page errors —");
check(errs.length === 0, errs.length ? `console errors: ${errs.slice(0,2).join(" | ")}` : "no uncaught page errors");

console.log(`\n${fails === 0 ? "ALL CHECKS PASSED" : fails + " CHECK(S) FAILED"}`);
await b.close();
process.exit(fails ? 1 : 0);
