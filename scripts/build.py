"""Build the public companion sites from reviewed brand copy and public WP snapshots.
No credentials, network requests, dependencies or WordPress writes are used.
"""
from pathlib import Path
from html import escape, unescape
from html.parser import HTMLParser
import json
import re

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://mooreliving777.github.io/moore-brand-websites/"
SOURCES = json.loads((ROOT / "data/source-snapshot.json").read_text())["sites"]
SOURCE = {r["site"]["id"]: r for r in SOURCES}

class Images(HTMLParser):
    def __init__(self):
        super().__init__(); self.images = []
    def handle_starttag(self, tag, attrs):
        if tag == "img": self.images.append(dict(attrs))

def clean(value):
    return unescape(re.sub(r"<[^>]+>", "", str(value))).replace("\xa0", " ").strip()
def esc(value): return escape(str(value), quote=True)
def page(source, slug, fallback=None):
    return next((p["link"] for p in source["pages"] if p["slug"] == slug), fallback or source["site"]["url"])
def media(source, item):
    return next(m for m in source["media"] if m["id"] == item)
def hero(source, item=None, index=0):
    if item is not None: return media(source, item)
    p = Images(); p.feed(source["home"]["content"]); im = p.images[index]
    return {"url":unescape(im.get("data-large-file") or im["src"]), "alt": im.get("alt", source["site"]["title"])}

# All price/availability-sensitive details lead to the source service for confirmation.
BRANDS = [
 {"id":258041023,"slug":"leonard-e-moore","name":"Leonard E. Moore","mark":"LEM","theme":"leonard","category":"ENTREPRENEUR · AUTHOR · ARTIST","headline":"Chicago roots.<br>Limitless ambition.","intro":"Music, media, websites and business technology—connected by useful ideas, honest storytelling and a drive to build something that lasts.","hero":hero(SOURCE[258041023]),"caption":"Leonard E. Moore / Mellow G — original brand artwork.","primary":["Explore the ventures","businesses"],"secondary":["Connect & collaborate","contact"],"universe_hub":True,"newsletter":["The Legacy Insider","legacy-insider-letter"],"services":[["Business & technology","Practical web services and tools for entrepreneurs building their next chapter.","services"],["Music & media","Explore the creative work, stories and perspectives behind the Mellow G name.","media"],["Ideas into systems","Discover AI-assisted development and business-workspace projects.","ai-developer-portfolio"]],"promise":"Get it. Put it together. Tell the people."},
 {"id":258041285,"slug":"city-web-design-pros","name":"City Web Design Pros","mark":"CITY / WEB","theme":"city","category":"WORDPRESS DESIGN · WEBSITE RESCUE","headline":"Make your website<br>mean business.","intro":"A stronger first impression. A clearer customer journey. WordPress design and practical website support for entrepreneurs, creators and growing businesses.","hero":hero(SOURCE[258041285]),"caption":"City Web Design Pros campaign artwork.","primary":["Request a website review","contact"],"secondary":["See $99 Rescue","rescue_preview"],"newsletter":["Free website growth checklist","free-website-growth-guide"],"services":[["WordPress design","Thoughtful layouts, readable content and clear next steps across desktop and mobile.","services"],["Website rescue","Explore the $99 package for eligible minor issues. Scope and price are confirmed before payment.","website-rescue"],["Portfolio & possibilities","Review the design direction and discuss the needs of your own business.","portfolio"]],"rescue_offer":True,"promise":"Professional websites. Real business results."},
 {"id":258041553,"slug":"moore-legacy-management","name":"Moore Legacy Management","mark":"M / L","theme":"legacy","category":"TALENT · MEDIA · BRAND PARTNERSHIPS","headline":"Talent has a story.<br>Build its next chapter.","intro":"Thoughtful representation, elevated partnerships and a serious approach to the business behind creative opportunity.","hero":hero(SOURCE[258041553],50),"caption":"Creative studio brand illustration; not a claim about office facilities.","primary":["Discuss a partnership","brand-partnerships"],"secondary":["Booking inquiries","booking-inquiries"],"newsletter":["Partnership readiness","partnership-readiness"],"services":[["Talent & media","Explore representation and media opportunities with an emphasis on fit and purpose.","talent-and-media"],["Brand partnerships","Bring audience, deliverables, timeline and usage rights into the conversation early.","brand-partnerships"],["Appearances & bookings","Submit your organization, proposed dates and budget range for individual review.","booking-inquiries"]],"promise":"Where talent meets opportunity."},
 {"id":258041754,"slug":"the-harsh-truth-clothing","name":"The Harsh Truth Clothing","mark":"THE / HARSH TRUTH","theme":"clothing","category":"INDEPENDENT STREETWEAR · SELF-EXPRESSION","headline":"Wear your truth.<br>Make it unmistakable.","intro":"Statement streetwear concepts built around resilience, individuality and honest self-expression. Explore the direction. Find the piece that speaks to you.","hero":{"url":"https://cdn.shopify.com/s/files/1/0793/2772/3683/files/HT01_Italian_Inspired_Signature_Hoodie_CONCEPT_NOT_FOR_PRODUCTION.png?v=1794300807","alt":"Digital design mockup of The Harsh Truth Italian-inspired signature hoodie; not a manufactured garment or available inventory"},"caption":"Official Shopify garment concept, not a manufactured sample. Availability, fit, pricing and fulfillment are unconfirmed.","primary":["View signature hoodie concept","featured_concept"],"secondary":["Ask about garment details","shop-vip-and-merchandise"],"newsletter":["VIP drop alerts","vip-drop-alerts"],"services":[["Signature identity","Discover the clothing label's black-and-gold direction and statement-making point of view.","our-story"],["Collections in development","See concept pieces, color stories and merchandise previews. Availability is confirmed individually.","collections"],["Merchandise inquiries","Ask about preferred items and quantities. Final pricing, stock and delivery are confirmed before payment.","product-showcase"]],"featured_concept":{"heading":"An Italian-inspired statement. Still a concept.","note":"The HT-01 hoodie image comes from the official Shopify product draft. It is a digital garment mockup—not a physical sample, finished product or item ready to buy. Manufacturer quotes, construction details and sample approval remain outstanding."},"promise":"Identity. Expression. No apologies."},
 {"id":258042257,"slug":"moore-computer-solutions","name":"Moore Computer Solutions","mark":"MCS","theme":"computer","category":"REMOTE COMPUTER SUPPORT","headline":"Technology solved.<br>Business moving.","intro":"Clear communication and focused technical assistance for people and small businesses. Start with the problem. Get a practical next step.","hero":hero(SOURCE[258042257],51),"caption":"Illustrative technician photograph from the existing WordPress media library.","primary":["Request technical help","contact"],"secondary":["See support services","services"],"newsletter":["Free computer care guide","free-computer-care-guide"],"services":[["Remote assistance","Support begins with your consent. You remain in control and can end a session at any time.","remote-support"],["Computer support","Describe the issue and request an assessment and quote before work begins.","services"],["WordPress support","Explore assistance for the website tools that keep your business moving.","wordpress-support"]],"promise":"Consent required. Clear scope. Customer control."},
 {"id":258042416,"slug":"fireworks-tv","name":"Fireworks TV","mark":"FIREWORKS / TV","theme":"fireworks","category":"INDEPENDENT MEDIA · FILM · MUSIC","headline":"Stories that ignite.<br>Truth that travels.","intro":"A developing independent entertainment destination for original perspectives, investigative storytelling, music culture and voices worth hearing.","hero":hero(SOURCE[258042416],95),"caption":"Cinematic brand artwork. Original projects are in development.","primary":["Explore original series","original-series"],"secondary":["Discuss a partnership","contact"],"newsletter":["The Fireworks Inside Track","fireworks-inside-track"],"services":[["Original series","Discover the direction of developing original programming. Final release details are announced when confirmed.","original-series"],["Documentaries","Explore investigative perspectives and documentary concepts.","documentaries"],["Music & conversation","Discover music culture, podcasts and creator-focused educational resources.","music-entertainment"]],"promise":"Independent voices. Original perspectives."},
 {"id":258042582,"slug":"bridge-to-better","name":"Bridge to Better Foundation","mark":"BRIDGE / TO BETTER","theme":"foundation","category":"RECOVERY · EMPLOYMENT · COMMUNITY","headline":"A stronger bridge.<br>A better tomorrow.","intro":"A developing nonprofit vision connecting recovery, meaningful work and financial confidence with dignity and the possibility of lasting stability.","hero":hero(SOURCE[258042582],49),"caption":"Mission illustration. Program availability and individual support must be confirmed directly.","primary":["Explore our mission","our-mission"],"secondary":["Get involved","get-involved"],"newsletter":["Community updates","community-updates"],"services":[["Recovery & employment","Explore the developing recovery-connected employment and life-skills framework.","recovery-employment"],["Financial empowerment","Learn about the focus on practical confidence, budgeting and stronger foundations.","financial-empowerment"],["Housing support","Read about the housing-support vision. This website does not provide emergency placement or guarantee assistance.","housing-support"]],"promise":"Dignity. Opportunity. Progress."},
 {"id":258042754,"slug":"amanda-halterman","name":"Amanda Halterman","mark":"AMANDA / HALTERMAN","theme":"amanda","category":"REAL LIFE · TELEVISION · COMMUNITY","headline":"Real life.<br>Unfiltered stories.","intro":"A personal space for real moments, creative projects, television and brand conversations shaped by honesty, individuality and community.","hero":hero(SOURCE[258042754],index=1),"caption":"Amanda Halterman — personal portrait from her official WordPress website.","primary":["Meet Amanda","about-amanda"],"secondary":["Work together","brand-partnerships"],"newsletter":["Amanda's inside updates","amanda-inside-updates"],"services":[["Beyond the screen","Learn more about Amanda and the person behind the television moments.","about-amanda"],["Television & media","Explore official viewing resources and selected clips. Full episodes may require a subscription.","television-media"],["Partnerships with personality","Start a conversation about a thoughtful collaboration, appearance or campaign.","brand-partnerships"]],"promise":"Authentic life. Unfiltered stories."},
 {"id":258052283,"slug":"ai-developer-portfolio","name":"Leonard E. Moore · AI Developer","mark":"LEM / DEV","theme":"developer","category":"AI-ASSISTED DEVELOPMENT · WEB DESIGN","headline":"Ideas into interfaces.<br>Concepts into systems.","intro":"A digital portfolio exploring AI-assisted development, web design and business software—with testing, design clarity and practical delivery at the center.","hero":hero(SOURCE[258052283],50),"caption":"Concept studio artwork, not a screenshot of a live product or deployed interface.","primary":["Explore the portfolio","website-command-center-wireframe-portfolio"],"secondary":["Read the development journal","blog"],"newsletter":["Digital innovation brief","digital-innovation-brief"],"services":[["Web & interface design","Explore wireframes and visual thinking across the connected brand network.","website-command-center-wireframe-portfolio"],["AI-assisted workflow","Read about designing, testing and verifying software work without overselling the tools.","blog"],["Moorvio","View the public project showcase for the business workspace. Gateway deployment remains pending.","moorvio"]],"promise":"Design. Test. Verify."},
 {"id":258106136,"slug":"the-harsh-truth-store","name":"The Harsh Truth Official Store","mark":"THE HARSH TRUTH / STORE","theme":"store","category":"CLOTHING · MERCHANDISE · IN DEVELOPMENT","headline":"Your statement.<br>Your next signature piece.","intro":"The official merchandise direction for The Harsh Truth. Explore the brand and get in touch about upcoming clothing and accessories.","hero":hero(SOURCE[258106136],42),"caption":"Collection concept board. The store is in preparation; pricing and order options are not yet confirmed.","primary":["Ask about merchandise","contact"],"secondary":["Read the style journal","blog"],"newsletter":["Follow the store journal","blog"],"services":[["The brand","Meet the ideas behind the clothing and merchandise label.","about"],["Clothing & accessories","Browse the brand's published direction and ask about what is being developed.","contact"],["Style & expression","Read about choosing statement streetwear that reflects your point of view.","blog"]],"promise":"Wear your truth."},
 {"id":258153899,"slug":"b3-the-place-2-be","name":"B3 The Place 2 Be","mark":"B3","theme":"b3","category":"ACRYLIC NAILS · EVANSVILLE, INDIANA","headline":"Small details.<br>Main-character energy.","intro":"A private nail experience by Ka’Chyia Moore for a set that feels like you. Explore real portfolio work and plan your next B3 appointment.","hero":hero(SOURCE[258153899],4),"caption":"Real B3 nail portfolio work, sourced from the existing official website.","primary":["Book your B3 set","book"],"secondary":["Explore the nail gallery","gallery"],"newsletter":["Booking & deposit guide","booking-guide"],"services":[["Acrylics, with personality","Start with your preferred style and confirm design, length and final quote directly.","services"],["The nail edit","Explore the real-work gallery for inspiration before your appointment.","gallery"],["Your next appointment","The source site lists services from $50+ and a $25 deposit. Review current pricing and policies on the booking service.","book"]],"promise":"Let your hands do the talking."},
 {"id":211320061,"slug":"rich-nerdz-nation","name":"Rich Nerdz Nation","mark":"RNN","theme":"richnerdz","category":"LEGACY BRAND · MUSIC & CULTURE","headline":"Creative roots.<br>A fresh chapter.","intro":"A companion home for the Rich Nerdz Nation name within Leonard E. Moore's creative network.","hero":hero(SOURCE[258042416],65),"caption":"Editorial music-workspace photograph from the network's published media library.","primary":["Explore the current network","network"],"secondary":["Visit the original domain","original"],"newsletter":["Explore Fireworks TV","fireworks"],"services":[["The legacy","This companion page preserves the brand's place in the wider creative network.","network"],["Music & media today","Explore the current Fireworks TV website for published media and creative resources.","fireworks"],["Original website","The original Jetpack connection is disconnected. Content and availability could not be verified for this build.","original"]],"promise":"Part of the Leonard E. Moore creative network.","original":"http://www.richnerdznation.com","legacy":True},
 {"id":211078514,"slug":"the-rich-rapper","name":"Rich Nerdz Nation · The Rich Rapper","mark":"RICH / RAPPER","theme":"richrapper","category":"LEGACY WORDPRESS SITE · COMING SOON","headline":"Nerdz do it better.<br>The next chapter awaits.","intro":"A public companion page for the legacy Rich Rapper WordPress address. Its original site is marked coming soon; unpublished material has not been imported.","hero":hero(SOURCE[258042416],65),"caption":"Editorial music-workspace photograph from the network's published media library.","primary":["Explore the current network","network"],"secondary":["Original WordPress address","original"],"newsletter":["Explore Fireworks TV","fireworks"],"services":[["A place in the story","The Rich Rapper address remains part of the connected WordPress inventory.","network"],["Discover current work","Explore the active brands and creative projects in the network.","network"],["Coming soon at WordPress","The original WordPress site has not been launched. This companion does not publish its drafts.","original"]],"promise":"Creative ambition. A connected legacy.","original":"https://therichrapper.wordpress.com","legacy":True},
]

def source_for(b):
    return SOURCE.get(b["id"], {"site":{"url":b.get("original", "")},"pages":[],"posts":[],"media":[],"home":{"content":""}})
def link(b, slug):
    source = source_for(b)
    if slug == "network": return "../"
    if slug == "original": return b["original"]
    if slug == "fireworks": return "../fireworks-tv/"
    if slug == "moorvio": return "https://mooreliving777.github.io/business-command-center/"
    if slug == "featured_concept": return "#garment-preview"
    if b["slug"] == "city-web-design-pros" and slug == "rescue_preview": return "#rescue-preview"
    if b["slug"] == "the-harsh-truth-clothing" and slug == "shop-vip-and-merchandise":
        return "https://theharshtruthclothinglinellc.wordpress.com/shop-vip-and-merchandise/"
    return page(source, slug)
def button(b, pair, kind="primary"):
    return f'<a class="button {kind}" href="{esc(link(b,pair[1]))}">{esc(pair[0])}<span aria-hidden="true">↗</span></a>'
def brand_page(b):
    from landing_sections import funnel_sections
    sections = funnel_sections(b, link)
    s=source_for(b); image=b["hero"]; posts=s["posts"][:3]
    posts_markup=""
    for p in posts:
        pic=next((m for m in s["media"] if m["id"]==p["featured_media"]),image)
        posts_markup+=f'<article class="journal-card"><a href="{esc(p["link"])}"><img src="{esc(pic["url"])}" alt="{esc(pic["alt"])}" loading="lazy" width="900" height="600"><div><time datetime="{esc(p["date"][:10])}">{esc(p["date"][:10])}</time><h3>{esc(clean(p["title"]))}</h3><p>{esc(clean(p["excerpt"])[:190])}</p><span class="read">Read on WordPress ↗</span></div></a></article>'
    journal=f'<section class="journal section" id="journal"><div class="section-heading"><p class="eyebrow">THE JOURNAL</p><h2>Ideas worth your time.</h2><p>Selected published stories. Open the original article for the full post and subscription options.</p></div><div class="journal-grid">{posts_markup}</div></section>' if posts else ""
    service_html="".join(f'<a class="service-card" href="{esc(link(b,slug))}"><span class="number">0{i+1}</span><h3>{esc(title)}</h3><p>{esc(desc)}</p><span class="read">Explore <span aria-hidden="true">↗</span></span></a>' for i,(title,desc,slug) in enumerate(b["services"]))
    ids=re.findall(r"youtube\.com/embed/([A-Za-z0-9_-]{11})",s["home"]["content"])
    watch=f'<a class="resource-link" href="https://www.youtube.com/watch?v={esc(ids[0])}"><span class="play" aria-hidden="true">▶</span><span>Watch a selected video resource<small>From the original site · hosted by its original YouTube publisher</small></span><span aria-hidden="true">↗</span></a>' if ids else ""
    wp=s["site"]["url"];name=b["name"];desc=b["intro"];slug=b["slug"]
    preview_src = "../assets/ht01-signature-hoodie-preview.webp" if b.get("featured_concept") else image["url"]
    upgrade_attr = f' data-upgrade-src="{esc(image["url"])}"' if b.get("featured_concept") else ""
    garment_preview = ""
    if b.get("featured_concept"):
        concept = b["featured_concept"]
        details_url = esc(link(b, "shop-vip-and-merchandise"))
        garment_preview = (
            '<section class="merch-preview section" id="garment-preview" aria-labelledby="garment-preview-title">'
            '<div class="merch-preview-copy"><p class="eyebrow">HT-01 · SIGNATURE HOODIE / DESIGN CONCEPT</p>'
            f'<h2 id="garment-preview-title">{esc(concept["heading"])}</h2>'
            f'<p>{esc(concept["note"])}</p>'
            '<p class="merch-preview-proof">DESIGN MOCKUP · NOT FOR SALE · NO PREORDERS · NO CHECKOUT</p>'
            f'<a class="button primary" href="{details_url}">Explore merchandise inquiries <span aria-hidden="true">↗</span></a>'
            '</div></section>'
        )
    city_rescue = ""
    if b.get("rescue_offer"):
        city_rescue = (
            '<section class="city-rescue" id="rescue-preview" aria-labelledby="city-rescue-title">'
            '<div class="city-rescue-inner"><div class="city-rescue-copy">'
            '<p class="city-rescue-kicker">WEBSITE RESCUE · CLEAR SCOPE FIRST</p>'
            '<h2 id="city-rescue-title">A small website fix.<br><em>A bigger way forward.</em></h2>'
            '<p>For an eligible minor WordPress issue, City Web Design Pros offers a $99 repair service. '
            'Your request is reviewed first; the exact work and price are confirmed in writing before you approve any payment or repair.</p>'
            '<div class="city-rescue-actions">'
            '<a class="button primary" href="https://citywebdesignprosllc.wordpress.com/website-rescue/">Review the $99 Rescue offer <span aria-hidden="true">↗</span></a>'
            '<a class="city-rescue-link" href="https://calendly.com/mooreliving777/city-web-design-pros-website-consultation">'
            'Optional free 30-minute consultation <span aria-hidden="true">↗</span></a>'
            '</div></div><div class="city-rescue-stamp" aria-label="$99 eligible minor WordPress repair offer">'
            '<span class="city-rescue-stamp-top">WORDPRESS / LIMITED SCOPE</span>'
            '<strong>$99</strong><span class="city-rescue-stamp-label">ELIGIBLE MINOR REPAIR</span>'
            '<div class="city-rescue-stamp-rule"></div>'
            '<p>Issue review → written scope → your approval → authorized fix and reasonable testing.</p>'
            '</div></div>'
            '<p class="city-rescue-note">Full redesigns, malware recovery, migrations and major development require separate assessment and pricing. '
            'This companion page does not collect payment or credentials. Do not submit passwords in an inquiry.</p>'
            '</section>'
        )
    universe_hub = ""
    if b.get("universe_hub"):
        universe_hub = (
            '<section class="moore-universe" id="moore-universe" aria-labelledby="moore-universe-heading">'
            '<div class="moore-universe-inner"><p class="moore-universe-kicker">ONE DESTINATION · EVERY PUBLIC LANE</p>'
            '<div class="moore-universe-layout"><div class="moore-universe-copy">'
            '<h2 id="moore-universe-heading">The Moore<br><em>Universe.</em></h2>'
            '<p>Discover the official public directory for Leonard E. Moore: business websites, '
            'AI projects, music, media, fashion, learning resources and creator work. '
            'Projects still in development are identified as such on the source directory.</p>'
            '<div class="moore-universe-actions">'
            '<a class="button primary" href="https://leonardemoorellc.wordpress.com/projects-and-links/">Explore all projects &amp; links <span aria-hidden="true">↗</span></a>'
            '<a class="moore-universe-text-link" href="https://mooreliving777.github.io/leonard-moore-portfolio/">Developer portfolio <span aria-hidden="true">↗</span></a>'
            '</div></div><div class="moore-universe-orbit" aria-hidden="true">'
            '<span class="moore-universe-core">LEM<span>✦</span></span>'
            '<span class="moore-universe-orbit-word word-ai">AI</span><span class="moore-universe-orbit-word word-music">MUSIC</span>'
            '<span class="moore-universe-orbit-word word-media">MEDIA</span><span class="moore-universe-orbit-word word-business">BUSINESS</span>'
            '</div></div>'
            '<p class="moore-universe-foot">Public links are maintained on the original WordPress directory. '
            'This companion does not imply that unpublished products or programs have launched.</p>'
            '</div></section>'
        )
    news_style = '<link rel="stylesheet" href="../assets/newsletter-entry.css">' if not b.get("legacy") else ""
    news_script = '<script type="module" src="../assets/newsletter-wiring.mjs"></script>' if not b.get("legacy") else ""
    newsletter_root = (f'<div class="newsletter-entry-root" data-newsletter-entry data-brand-slug="{esc(slug)}" data-brand-name="{esc(name)}" data-offer="{esc(b["newsletter"][0])}" hidden></div>'
                       if not b.get("legacy") else "")
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(name)} | Moore Brand Network</title><meta name="description" content="{esc(desc)}">
<meta name="theme-color" content="#10121c"><meta property="og:title" content="{esc(name)}"><meta property="og:description" content="{esc(desc)}"><meta property="og:image" content="{esc(image["url"])}"><meta property="og:url" content="{BASE+slug}/"><link rel="canonical" href="{esc(wp)}"><link rel="stylesheet" href="../assets/network.css"><link rel="stylesheet" href="../assets/landing-sections.css"><link rel="stylesheet" href="../assets/image-fallback.css">{news_style}<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"></head>
<body class="brand-page theme-{b["theme"]}"><a class="skip" href="#main">Skip to content</a>
<header class="site-header"><a class="brand" href="./" aria-label="{esc(name)} home">{esc(b["mark"]).replace(" / ","<span>")}{'</span>' if ' / ' in b['mark'] else ''}</a><nav aria-label="Main navigation">{'<a href="#rescue-preview">Rescue</a>' if b.get("rescue_offer") else ''}{'<a href="#moore-universe">All links</a>' if b.get("universe_hub") else ''}<a href="#explore">Explore</a><a href="#faq">FAQ</a>{'<a href="#journal">Journal</a>' if posts else '<a href="#connect">Connect</a>'}<a href="../blog/">Blog</a><a href="../">Brand network ↗</a></nav></header>
<main id="main"><section class="hero"><div class="hero-copy"><p class="eyebrow">{esc(b["category"])}</p><h1>{b["headline"]}</h1><p class="intro">{esc(desc)}</p><div class="hero-actions">{button(b,b["primary"])}{button(b,b["secondary"],"secondary")}</div><p class="signature">{esc(b["promise"])}</p></div><figure class="hero-art"><img src="{esc(preview_src)}"{upgrade_attr} alt="{esc(image["alt"])}" width="1400" height="1050" fetchpriority="high"><figcaption>{esc(b["caption"])}</figcaption></figure></section>
{garment_preview}
{city_rescue}
{universe_hub}
<div class="brand-ribbon"><span>{esc(name)}</span><span>{esc(b["promise"])}</span><span>USA</span></div>
{sections["trust"]}
{sections["problem"]}
{sections["solution"]}
<section class="section explore" id="explore"><div class="section-heading"><p class="eyebrow">FIND YOUR NEXT STEP</p><h2>{'Explore the legacy.' if b.get('legacy') else 'Made for your next chapter.'}</h2><p>Choose a direction below. Detailed information and service inquiries continue on the original brand website.</p></div><div class="services">{service_html}</div>{watch}</section>
{sections["how"]}
{sections["voices"]}
{sections["access"]}
{journal}
{sections["faq"]}
<section class="connect section" id="connect"><p class="eyebrow">10 / YOUR NEXT MOVE</p><h2>{esc(b["newsletter"][0])}</h2><p>{'Explore the published work and active brands in the network.' if b.get('legacy') else 'Continue to the original site for the full experience, updates and the latest details.'}</p>{button(b,b["newsletter"])}{newsletter_root}<a class="source-link" href="{esc(wp)}">Original WordPress {'address' if b.get('legacy') else 'website'} ↗</a></section></main>
<footer><div><strong>{esc(name)}</strong><p>Part of the Leonard E. Moore brand network · United States</p></div><div><a href="../">All brand websites ↗</a><p>© 2026 · Brand assets reserved.</p></div><p class="footer-note">GitHub Pages companion website. Published article links and imagery were selected from the existing brand network on October 25, 2026. Forms, bookings, subscriptions and any checkout remain with their original services. This page does not collect account or payment information.</p></footer><script type="module" src="../assets/image-fallback.mjs"></script>{news_script}</body></html>'''

def directory():
    def card_image(b):
        image = b["hero"]
        if b.get("featured_concept"):
            return ('assets/ht01-signature-hoodie-preview.webp',
                    f' data-upgrade-src="{esc(image["url"])}"')
        return (image["url"], "")
    cards="".join(f'<a class="directory-card theme-{b["theme"]}" href="{b["slug"]}/"><img src="{esc(card_image(b)[0])}"{card_image(b)[1]} alt="{esc(b["hero"]["alt"])}" loading="lazy" width="800" height="500"><div><span class="eyebrow">{esc(b["category"])}</span><h2>{esc(b["name"])}</h2><p>{esc(b["promise"])}</p><span class="read">Explore website ↗</span></div></a>' for b in BRANDS)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Moore Brand Network | Independent ideas. Connected purpose.</title><meta name="description" content="Explore thirteen GitHub-hosted companion websites for Leonard E. Moore's business, creative and community brands."><link rel="canonical" href="{BASE}"><link rel="stylesheet" href="assets/network.css"><link rel="stylesheet" href="assets/image-fallback.css"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"></head><body class="directory"><a class="skip" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="./">MOORE<span>BRAND NETWORK</span></a><nav aria-label="Main navigation"><a href="#brands">Explore the brands</a><a href="https://github.com/mooreliving777/moore-brand-websites">GitHub ↗</a></nav></header><main id="main"><section class="network-intro"><p class="eyebrow">BUSINESS · CULTURE · COMMUNITY</p><h1>Independent ideas.<br><em>Connected purpose.</em></h1><p>Thirteen websites. A shared drive to create opportunities, tell meaningful stories and build a lasting legacy.</p><a class="button primary" href="#brands">Find your next connection <span aria-hidden="true">↓</span></a></section><section class="directory-grid" id="brands" aria-label="Brand websites">{cards}</section><section class="network-note"><h2>A connected network. A clear next step.</h2><p>Each brand has its own website and identity. Articles, inquiries, appointments and subscriptions continue through the existing WordPress sites and services. Two older addresses are represented as legacy or coming-soon companion pages.</p><a href="https://mooreliving777.github.io/business-command-center/">Discover Moorvio — the business workspace project ↗</a></section></main><footer><strong>LEONARD E. MOORE · BRAND NETWORK</strong><p>United States · © 2026 · Brand assets reserved. Static website code: MIT.</p></footer><script type="module" src="assets/image-fallback.mjs"></script></body></html>'''

if __name__ == "__main__":
    for brand in BRANDS:
        folder=ROOT/brand["slug"];folder.mkdir(exist_ok=True)
        (folder/"index.html").write_text(brand_page(brand))
    (ROOT/"index.html").write_text(directory())
    # Publish only reviewed public metadata, not raw content or authenticated site details.
    safe=[{"name":b["name"],"path":b["slug"]+"/","wordpress_url":source_for(b)["site"]["url"],"hero":b["hero"],"legacy":bool(b.get("legacy"))} for b in BRANDS]
    (ROOT/"data/site-map.json").write_text(json.dumps(safe,indent=2))
    # Discover every published HTML page so new journal posts stay in the sitemap.
    paths = sorted({f.relative_to(ROOT).as_posix().removesuffix("index.html")
                    if f.name == "index.html" else f.relative_to(ROOT).as_posix()
                    for f in ROOT.rglob("*.html")
                    if not any(part.startswith(".") or part in {"node_modules", "dist"}
                               for part in f.relative_to(ROOT).parts)})
    (ROOT/"sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join('  <url><loc>'+esc(BASE+path)+'</loc></url>\n' for path in paths)+'</urlset>\n')
    (ROOT/"data/page-map.json").write_text(json.dumps({"base_url": BASE, "pages": paths}, indent=2)+"\n")
    (ROOT/"robots.txt").write_text("User-agent: *\nAllow: /\nSitemap: "+BASE+"sitemap.xml\n")
    print("Built 13 brand websites and the directory.")
