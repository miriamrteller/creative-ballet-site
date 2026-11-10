# creative-ballet-site

Static website for Creative Ballet Academy — https://creativeballetacademy.com

Served by Cloudflare Pages. Files are deployed as-is (no build step).

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

The forms send leads to OpalSwift production (studio `creativeballet`, Supabase project `oogxajjanbyqhljxcmql`) through the `crm-lead-capture` function. The function only accepts browsers from `*.opalswift.com` and the origin in its `CRM_CONTACTS_ALLOWED_ORIGIN` secret, so that secret must include `https://creativeballetacademy.com`.
Links with `?src=instagram&campaign=chanuka` (or `utm_source` / `utm_campaign`) tag the lead's
channel and campaign in OpalSwift. Channels OpalSwift knows: email, whatsapp, instagram, facebook,
google, sms, flyer, linkedin, direct; anything else shows as website.
