# ZIA Subcloud Tool

A single-file web dashboard for comparing your Zscaler ZIA subcloud Data Centers against the full Zscaler CENR DC list.

## Features

- **Live CENR check** — fetches `https://config.zscaler.com/zscaler.net/cenr` on load to detect new or removed DCs
- **Subcloud sync** — upload a HAR file or trigger a live API call to refresh which DCs are in your subcloud
- **HAR fallback** — if the live call is blocked by CORS, paste the JSON from DevTools directly
- **Regional Surcharge filter** — highlights DCs that incur additional charges (India, China, Africa, Middle East, LatAm, Oceania)
- **ES / EN language toggle**
- **Filters** — All, EMEA, Americas, APAC, In subcloud, Outside subcloud, Regional Surcharge + search

## Usage

Open `index.html` directly in a browser — no server required.

### Refreshing subcloud data

1. In the ZIA admin portal, navigate to **Administration → Subclouds**
2. Open browser DevTools → Network tab
3. Export as HAR, or copy the response from the `/zsapi/v1/subclouds` request
4. Drop the HAR onto the page, or paste the JSON into the paste box

### Checking for new Zscaler DCs

Click **🌐 Check CENR** (or wait for the auto-check on load). The page will highlight any new DCs added to the CENR since the last build.

## Cloud

`zscaler.net` · Tenant `2fino.com`
