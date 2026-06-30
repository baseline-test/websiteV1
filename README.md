# Baseline — Waitlist Site

A small static site: a one-page homepage (hero, flavors, waitlist) plus a separate
About page. The waitlist form writes submissions straight into a Google Sheet for free,
using Google Apps Script as the connector — no paid form service, no submission cap.

## Files

| File             | What it is                                                        |
|------------------|-------------------------------------------------------------------|
| `index.html`     | Homepage — nav, hero, "why no crash", flavors, waitlist form       |
| `about.html`     | About page                                                        |
| `styles.css`     | All styling. **All theming knobs are at the top in `:root`.**      |
| `script.js`      | Form handling (honeypot, email validation, submit). **Set your URL here.** |
| `apps-script.gs` | The Google Apps Script you paste into your Sheet                   |

---

## Setup (about 10 minutes, done once)

### 1. Make the Google Sheet
- Create a new Google Sheet (any name). That's it — the script makes the tab and headers itself.

### 2. Add the script
- In the Sheet: **Extensions → Apps Script**.
- Delete the starter code, paste in everything from `apps-script.gs`, and **Save**.

### 3. Publish it as a web app
- Top right: **Deploy → New deployment**.
- Click the gear → choose **Web app**.
- Set **Execute as: Me** and **Who has access: Anyone**.
- **Deploy**, approve the permission prompt, then **copy the Web app URL**.
  (It looks like `https://script.google.com/macros/s/AKfy.../exec`.)
- Optional check: paste that URL in a browser — you should see a small "endpoint is running" message.

### 4. Connect the form to it
- Open `script.js`, and replace the placeholder on the first line:
  ```js
  const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
  ```
  with the URL you copied.

### 5. Put it online
Drag the folder into any free static host:
- **Netlify** (netlify.com/drop — literally drag and drop)
- **Cloudflare Pages** or **GitHub Pages**

That's the whole pipeline: form → Apps Script → Sheet.

> **Note on how submitting works:** the form sends data in "no-cors" mode, which is what
> lets a plain static page talk to Google Apps Script. The trade-off is the page can't read
> the script's reply, so it shows "success" as soon as the request goes through. The row still
> lands in your Sheet. If a submission ever looks missing, check the Sheet directly.

---

## Changing the branding later (the easy part)

Everything you'll want to tweak is grouped, so you don't go digging.

### Colors
Open `styles.css`. At the very top, in `:root`, change these values:
```css
--color-primary:   #2E5D4B;   /* buttons, links */
--color-secondary: #7E9A8B;   /* muted text */
--color-accent:    #E0A458;   /* the steady "Baseline" line, highlights */
--color-bg:        #F4F4EF;   /* page background */
--color-ink:       #18261D;   /* main text */
```
Change one value, it updates everywhere that color is used. The current palette is a
placeholder ("green tea & honey").

### Fonts
Also in `:root`:
```css
--font-display: "Spectral", Georgia, serif;             /* headings */
--font-body:    "Hanken Grotesk", system-ui, sans-serif;/* everything else */
```
To use different fonts, swap the `<link href="...fonts.googleapis.com...">` line in the
`<head>` of both HTML files, then update these two variables.

### Logo
Right now the logo is the text wordmark **Baseline.** (the dot is the accent color).
When you have a real logo, find `class="wordmark"` in `index.html` and `about.html` and
replace the text with an image, e.g.:
```html
<a href="#top" class="wordmark"><img src="logo.svg" alt="Baseline" height="28"></a>
```

### Text / copy
Every editable bit of writing is marked with an `EDIT COPY` comment in the HTML so it's
easy to find. The current copy is intentionally generic placeholder — replace it with
the real Baseline voice before launch.

---

## The spam + validation guards (already built in)

- **Honeypot** — a hidden "company" field. People never see it; bots fill it. Anything that
  fills it is silently ignored (checked both in `script.js` and in `apps-script.gs`). Don't remove it.
- **Email validation** — the input is `type="email"` (the browser blocks obvious junk) plus a
  backup pattern check in `script.js` before anything is sent.
