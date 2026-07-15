# Playwright SDET Framework

A production-style test automation framework built with **Playwright + TypeScript**, targeting
a real SaaS-style dashboard app ([OrangeHRM demo](https://opensource-demo.orangehrmlive.com)) for
UI coverage, plus an API layer test suite. Built to demonstrate SDET fundamentals, not just script
a few clicks.

## Why this project

Anyone can write a Playwright script that logs in and clicks a button. This repo is meant to show
the things an SDET role actually cares about:

- **Architecture** — Page Object Model, custom fixtures, clean separation of test data/logic/pages
- **Coverage strategy** — UI, API, cross-browser, and mobile viewport testing in one suite
- **Reliability** — explicit waits (no arbitrary `sleep`), retry config, trace/video on failure
- **CI/CD** — GitHub Actions matrix run across 3 browsers with fail-fast smoke gating
- **Maintainability** — typed code, lint/format tooling, environment-driven config

## Architecture

```
src/
  pages/        Page Object Model — one class per page/component, no assertions inside pages
  fixtures/      Custom Playwright fixtures (page objects + pre-authenticated session)
  utils/         Test data generators/providers, kept out of spec files
tests/
  smoke/         Fast, critical-path checks — tagged @smoke, gates the CI pipeline
  regression/    Broader functional coverage — tagged @regression
  api/           API-layer tests using Playwright's request context (no browser)
```

**Design decisions worth asking me about in an interview:**
- Page objects expose *behavior* (`login()`, `deleteFirstResult()`), never raw locators, to callers.
- The `authenticatedPage` fixture removes login boilerplate from every regression test while keeping
  `login.spec.ts` itself free to test login as a first-class flow.
- Config is environment-driven (`ENV=staging` vs `ENV=prod` loads different `.env` files) so the same
  suite can run against multiple environments without code changes.
- Reports are HTML (human debugging) + JUnit (CI dashboards) + JSON (custom tooling) simultaneously.

## Getting started

Only prerequisite: [Node.js](https://nodejs.org) installed on your machine (LTS version).

**Mac/Linux:**
```bash
bash setup.sh
```

**Windows:** double-click `setup.bat`

That single command installs dependencies, downloads the browsers, and sets up the environment
file — everything else is already configured. Then run:

```bash
npm run test:smoke        # fast critical-path checks only
npm test                  # full suite, all browsers
npm run test:headed       # watch the browser while it runs
npm run report            # open the last HTML report
```

## CI

`.github/workflows/playwright.yml` runs on every push/PR to `main`:
1. Smoke tests run first per browser (fail fast before burning CI minutes on regression).
2. Full regression suite runs across Chromium, Firefox, and WebKit in parallel matrix jobs.
3. HTML + JUnit reports are uploaded as build artifacts either way.

## Debugging notes (real triage, kept intentionally)

Two issues surfaced when first running this against the live public demo site — kept here as a
worked example of root-causing failures rather than just re-running until green:

1. **"Empty credentials" test failed on every browser.** The assertion checked for a server-side
   error banner (`.oxd-alert-content-text`), but empty fields never reach the server — client-side
   validation blocks submission and shows per-field `.oxd-input-field-error-message` "Required"
   text instead. Fix: split the assertion so empty-field cases check field-level validation, and
   wrong-credential cases check the server error banner — because these are two genuinely different
   failure paths, not one.
2. **Intermittent `page.goto` timeouts on WebKit/mobile-chrome.** Caused by hammering a shared
   public demo site with 4 parallel workers. Fixed by lowering local worker count, adding one local
   retry, raising `navigationTimeout`, and switching to `waitUntil: 'domcontentloaded'` since the
   site keeps background XHR activity running past the point the page is actually usable.

## Roadmap / what I'd add next

- Visual regression via `expect(page).toHaveScreenshot()` baseline snapshots
- Accessibility checks with `@axe-core/playwright`
- Dockerized test runner for environment parity
- Allure reporting for richer historical trend dashboards
- Flaky test quarantine tagging (`@flaky`) with a nightly-only re-run job

## Tech stack

Playwright · TypeScript · GitHub Actions · dotenv · ESLint/Prettier
