# Site and design map

Updated October 28, 2026 from the current repository tree.

Public base: https://mooreliving777.github.io/moore-brand-websites/

| Site | Companion route | Original source |
|---|---|---|
| Leonard E. Moore | /leonard-e-moore/ | https://leonardemoorellc.wordpress.com |
| City Web Design Pros | /city-web-design-pros/ | https://citywebdesignprosllc.wordpress.com |
| Moore Legacy Management | /moore-legacy-management/ | https://moorelegacymanagementgroupllc.wordpress.com |
| The Harsh Truth Clothing | /the-harsh-truth-clothing/ | https://theharshtruthclothinglinellc.wordpress.com |
| Moore Computer Solutions | /moore-computer-solutions/ | https://moorecomputersolutions.wordpress.com |
| Fireworks TV | /fireworks-tv/ | https://fireworkstv.wordpress.com |
| Bridge to Better Foundation | /bridge-to-better/ | https://thebridgetobetterfoundationinc.wordpress.com |
| Amanda Halterman | /amanda-halterman/ | https://amandahaltermanllc.wordpress.com |
| Leonard E. Moore · AI Developer | /ai-developer-portfolio/ | https://leonardemooreaideveloperportfo.wordpress.com |
| The Harsh Truth Official Store | /the-harsh-truth-store/ | https://theharshtruthofficialstore.wordpress.com |
| B3 The Place 2 Be | /b3-the-place-2-be/ | https://b3theplace2be.wordpress.com |
| Rich Nerdz Nation | /rich-nerdz-nation/ | http://www.richnerdznation.com |
| Rich Nerdz Nation · The Rich Rapper | /the-rich-rapper/ | https://therichrapper.wordpress.com |

Shared routes: `/` (directory), `/blog/` (The Moore Journal), `/blog/website-launch-handoff-checklist/` (article). Total: 16 HTML pages. Anchors are sections, not separate sitemap URLs.

Figma network map: https://www.figma.com/design/C1ziG7NJL57DKIn3OoBmoc?node-id=23-86

`data/site-map.json` preserves the brand/source mapping. `data/page-map.json` lists every published HTML route. `scripts/build.py` discovers HTML pages to regenerate both the XML sitemap and page map, including new blog posts. No fabricated modification dates are emitted.

WordPress source pages remain at their original domains. Companion brand pages retain their existing WordPress canonicals. Rich Nerdz Nation is legacy/unverified; The Rich Rapper original is coming soon.
