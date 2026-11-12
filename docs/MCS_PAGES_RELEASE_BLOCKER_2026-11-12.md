# Moore Computer Solutions — GitHub Pages release blocker

Date checked: 2026-11-12. Status: BLOCKED; review-only, no automatic publication authorized.

## Evidence
- The owner-approved MCS companion was committed to `main` as `ae75dddba072b6f98e77875676e94078af0b7bab` on 2026-11-11.
- GitHub's `pages build and deployment` workflow for that commit ended `startup_failure` without producing any jobs: https://github.com/mooreliving777/moore-brand-websites/actions/runs/43095654188
- The later QA workflow on draft PR #15 reported 7/8 public resources passing. The published `moore-computer-solutions/` page lacked the `id="support-safety"` marker now present on `main`: https://github.com/mooreliving777/moore-brand-websites/actions/runs/43246853355
- The new QA script also verifies four separate remote-support safety steps, populated original brand artwork and the local image fallback stylesheet. This script has NOT passed against the published site.

## Release gate — owner action required
1. Confirm the repository's **Settings → Pages** source, publishing branch/folder or custom GitHub Actions workflow, and GitHub Pages/Actions availability. A `startup_failure` has no job logs, so the exact platform/settings cause cannot be inferred from these results alone.
2. After separate owner approval, repair the publishing setup or request a controlled Pages publication of the already-reviewed `main` content. **This draft does not authorize publication.**
3. Verify the public MCS URL against `main` for the four safety steps, Wix-hosted support inquiry CTA, original artwork and stylesheet. Do not imply the form or human support is guaranteed beyond earlier evidence.
4. Re-run **Verify published Moore Network Pages** against the actual public Pages URL; require all eight checks to pass and record the run URL.
5. Review any remaining CodeRabbit comments, security/consent requirements and owner sign-off before merging PR #15.

No purchases, provider API calls, customer submissions, website publication, merge, or account-setting changes are part of this QA documentation.


## Owner-gated fallback prepared in this draft

`.github/workflows/pages-manual-recovery.yml` is a **new manual-only publishing option** prepared in draft PR #15. Its pull-request job only checks content and assembles a public-file allowlist. A PR cannot publish. The production job runs only on a manually dispatched workflow from `main` when the confirmation input exactly equals `PUBLISH VERIFIED MAIN`; the `github-pages` environment can enforce additional review.

The fallback is **not activated** by this draft. After separately approved merge and controlled GitHub Pages settings review, an owner may choose **Settings → Pages → Build and deployment → Source: GitHub Actions**, then explicitly invoke the recovery workflow on `main`. Do not switch the source or dispatch publishing until approved; a publishing-source change could affect the existing live URL. Successful artifact generation does not prove a successful Pages release—verify the live URL afterward.

The workflow copies public landing pages, artwork and approved public JSON files into a temporary release directory; it excludes `scripts/`, `test/`, `.github/`, documentation, and `data/source-snapshot.json` from the publishing artifact. All content is from the approved `main` commit; no external API keys, paid models or customer details are accessed.
