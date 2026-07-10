# Security and Traffic Hardening

## Required Cloudflare secrets

Set these before deploying the hardened build:

```sh
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put GOOGLE_SHEET_URL
npx wrangler secret put GMAIL_APP_PASSWORD
npx wrangler secret put WEB3FORMS_ACCESS_KEY
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put OWNER_EMAIL
```

Optional production setting:

```sh
npx wrangler secret put STRICT_RATE_LIMITS
```

Use `true` for `STRICT_RATE_LIMITS` only after the Supabase `check_rate_limit`
RPC in `db/rate_limit_setup.sql` is deployed and verified.

## Cloudflare dashboard rules

Add rate limiting or WAF rules for:

- `/api/*`: challenge obvious bots and cap abusive request bursts.
- `/api/slots`: stricter cap than general API traffic because it reaches Google Apps Script.
- `/api/generate-review`: strict cap because it can call Groq.
- `/admin/*`: managed challenge outside expected geographies/devices if needed.

## Monitoring thresholds

- Alert at 50%, 75%, and 90% of the Workers Free 100,000 requests/day limit.
- Watch Worker CPU exceeded errors, 5xx rate, cache hit ratio, Supabase errors, Google Apps Script failures, and form submission failures.
- Upgrade before sustained Worker traffic reaches 70,000 requests/day.

