# creative-ballet-site

Static website for Creative Ballet Academy — https://creativeballetacademy.com

Served by Cloudflare Pages. Files are deployed as-is (no build step) by `.github/workflows/deploy.yml` on every push to `main` (setup steps at the top of that file).

| Path | Page |
| --- | --- |
| `index.html` | English home (`/`) |
| `workshops/index.html` | English workshops (`/workshops/`) |
| `he/index.html` | Hebrew home (`/he/`) |
| `he/workshops/index.html` | Hebrew workshops (`/he/workshops/`) |
| `404.html` | Not-found page |
| `assets/site.css`, `assets/site.js` | Shared styles and script (enquiry form, language button) for all pages |
| `assets/` | Logo, icons, share image (`og-image.jpg`) and self-hosted web fonts |
| `robots.txt`, `sitemap.xml` | For search engines |
| `_headers` | Cloudflare Pages cache rules |

## Enquiry forms

The forms are OpalSwift's own named forms, embedded in a frame (`.opal-form` boxes, built by
`assets/site.js`): `creativeballet.opalswift.com/embed/f/classes` on the home pages and
`/embed/f/parties` on the workshops pages. Questions are edited in OpalSwift, not here.
The frame needs no CORS setting.

Links with `?src=instagram&campaign=chanuka` (or `utm_source` / `utm_campaign`) are passed to the
form, so the lead's channel and campaign show in OpalSwift. Channels OpalSwift knows: email,
whatsapp, instagram, facebook, google, sms, flyer, linkedin, direct; anything else shows as website.
