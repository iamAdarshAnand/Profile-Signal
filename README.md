# Profile Signal

Profile Signal screens Facebook, X (Twitter), and Instagram accounts for observable impersonation, scam, and spam signals. It runs entirely in the browser.

**Created by Adarsh Anand** · [GitHub](https://github.com/iamAdarshAnand)

## Run locally

1. Clone this repository or download and extract its ZIP from GitHub.
2. Open `dist/index.html` in your browser.
3. Select a platform, optionally enter a handle or URL, and answer the checklist. Use **Unknown** when you lack evidence.
4. Click **Analyze profile** to see the risk level, flagged observations, and verification steps. **Try an example** loads fictional data.

No packages, API keys, or build step are required. To serve over HTTP with Python, run `python -m http.server 8000 --directory dist` and open `http://localhost:8000`.

## Scoring

| Observation | Points |
| --- | ---: |
| Requests money or sensitive information | 5 |
| Copies an identity | 4 |
| Sends suspicious links | 4 |
| Uses pressure or urgency | 3 |
| Profile details conflict | 2 |
| Repeats promotional activity | 2 |
| Shows an abrupt change in activity | 2 |

Each **Yes** adds its points. **No** and **Unknown** add zero. A money or sensitive-information request, or a total of 8 or more, triggers **High risk**. Totals of 3–7 are **Elevated risk**. Below 3 points, fewer than four reviewed signals produce **Insufficient evidence**. Otherwise the result is **Low observed risk**.

The rules are a screening aid. They do not estimate the probability that a profile is fake or verify ownership. A profile link serves as a label. The app does not open that link, retrieve profile data, store answers, or send observations to a server.

## Files

- `dist/index.html` contains the form and report layout.
- `dist/style.css` styles the responsive interface.
- `dist/app.js` contains the checklist, scoring, and report rendering.

## Project discovery

**Browser-Based Fake Social Media Profile Risk Checker** — Privacy-friendly browser-based checklist for assessing observable scam, spam and impersonation indicators on social media profiles.

**Related developer searches:** fake profile detection, social media scam checker, impersonation detection, browser security, JavaScript.

**Source:** [Profile-Signal](https://github.com/iamAdarshAnand/Profile-Signal) · **Author:** [Adarsh Anand](https://github.com/iamAdarshAnand)
