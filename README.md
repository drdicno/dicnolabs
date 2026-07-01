# Dicno Labs Website

A static content website for Dicno Labs, built with HTML, CSS, and JavaScript only. The site is GitHub Pages compatible, designed for the root domain `https://dicnolabs.com/`, and keeps the AdMob `app-ads.txt` file at the root.

- `assets/header.png`
- `assets/logo.png`
- `assets/homeloan-compass-icon.png`

## Files

- `index.html` - Main Dicno Labs homepage
- `developer/index.html` - Original developer profile style page
- `apps/index.html` - Apps index
- `apps/homeloan-compass/index.html` - HomeLoan Compass app page
- `tools/index.html` - SEO tools directory
- `blog/index.html` - Blog index
- `privacy-policy/index.html` - Privacy Policy
- `terms/index.html` - Terms of Service
- `contact/index.html` - Contact page
- `ads.txt` - Root Google AdSense advertising file
- `app-ads.txt` - Root Google AdMob app advertising file
- `style.css` - Responsive visual design and layout
- `script.js` - Header state, mobile navigation, and copyright year
- `assets/` - Brand images

## SEO Tools QA Report

Last QA pass: July 1, 2026.

### Tools Added

The tools directory now includes active finance, text, developer, image, education, and health tools. Priority tools verified:

- Mortgage Calculator
- PITI Calculator
- Home Affordability Calculator
- Refinance Calculator
- Word Counter
- Character Counter
- Password Generator
- JSON Formatter
- Base64 Encoder
- UUID Generator
- Timestamp Converter
- BMI Calculator
- Age Calculator
- Date Calculator
- QR Code Generator

Additional active tools currently present include Loan Calculator, Savings Calculator, GPA Calculator, Study Time Calculator, Extra Payment Calculator, and Amortization Calculator.

### Routes Verified

Local static-server QA returned HTTP 200 for `/`, `/tools/`, all tool routes, `/contact/`, `/privacy-policy/`, `/terms/`, `/ads.txt`, and `/app-ads.txt`.

Priority tool pages were checked for:

- Working rendered result areas with no browser console errors
- One H1 per page
- SEO title, meta description, canonical URL, Open Graph tags, and Twitter Card tags
- Breadcrumb, WebApplication, and FAQ JSON-LD schema
- Related tools and related articles links
- Mobile layout at 390px width with no horizontal overflow

### Known Limitations

- Copy buttons and reset buttons are not currently part of the tool UI, so no copy/reset behavior was tested.
- `/tools/refinancing-calculator/` remains as a legacy reachable alias, but the active linked and canonical route is `/tools/refinance-calculator/`.

### Deployment Checklist

1. Keep `ads.txt` and `app-ads.txt` in the project root.
2. Confirm both advertising files contain the Google publisher record before deployment.
3. Deploy the root folder to GitHub Pages.
4. After deployment, verify `https://dicnolabs.com/tools/`, `https://dicnolabs.com/ads.txt`, and `https://dicnolabs.com/app-ads.txt`.
5. Spot-check priority tool pages on mobile and desktop.

## Markdown Articles

Future Learn articles are drafted in `content/` as Markdown first, then rendered into the matching HTML pages.

## Advertising Files

The project intentionally keeps both advertising files in the root:

- `ads.txt` is required for Google AdSense.
- `app-ads.txt` is required for Google AdMob.

Both files intentionally coexist in the project root and use the same publisher record:

`google.com, pub-5090757060485426, DIRECT, f08c47fec0942fa0`

They should resolve at:

- `https://dicnolabs.com/ads.txt`
- `https://dicnolabs.com/app-ads.txt`

## GitHub Pages Deployment

1. Create a GitHub repository for the website.
2. Upload all website files and folders, including `ads.txt` and `app-ads.txt`.
3. In GitHub, open the repository settings.
4. Go to **Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and the root folder.
7. Save the settings.

GitHub Pages will publish the site after the first deployment finishes.

## Local Preview

Open `index.html` directly in a browser, or serve the folder with any simple static server.
