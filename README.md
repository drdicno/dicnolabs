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
- `tools/index.html` - Financial tools index
- `blog/index.html` - Blog index
- `privacy-policy/index.html` - Privacy Policy
- `terms/index.html` - Terms of Service
- `contact/index.html` - Contact page
- `ads.txt` - Root Google AdSense advertising file
- `app-ads.txt` - Root Google AdMob app advertising file
- `style.css` - Responsive visual design and layout
- `script.js` - Header state, mobile navigation, and copyright year
- `assets/` - Brand images

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
