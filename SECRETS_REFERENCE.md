# LIBRARYOS — SECRETS & ENV VARS REFERENCE
# Kaun sa secret kahan dalna hai — poora map

---

## 1. SUPABASE EDGE FUNCTIONS SECRETS
### Set karo: Supabase Dashboard → Settings → Edge Functions → Secrets
### Ya CLI se: `supabase secrets set KEY=value`

| Secret Key | Value | Used In |
|-----------|-------|---------|
| `SUPABASE_URL` | `https://[PROJECT_REF].supabase.co` | Auto-available, but set karo |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role key | Auto-available |
| `SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon key | `generate-token`, `staff-clear-force` |
| `RAZORPAY_KEY_ID` | Razorpay Dashboard → Settings → API Keys | `create-payment-order`, `create-renewal-order` |
| `RAZORPAY_KEY_SECRET` | Razorpay Dashboard → Settings → API Keys | `verify-payment`, `create-renewal-order` |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Dashboard → Webhooks → Webhook Secret | `razorpay-webhook` |
| `JWT_SECRET` | apna strong random string (32+ chars) | `generate-token`, `verify-token`, `create-renewal-order`, `admin-login` |
| `ADMIN_EMAIL` | tera admin email | `admin-login` |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password | `admin-login` |

### Bcrypt hash generate karne ka tarika (ek baar run karo):
```javascript
// Node.js script
const bcrypt = require('bcryptjs')
const hash = bcrypt.hashSync('TERI_ADMIN_PASSWORD', 12)
console.log(hash)
// Copy output → ADMIN_PASSWORD_HASH
```

---

## 2. CLOUDFLARE PAGES — SITE 1 (libraryos.in)
### Set karo: Cloudflare Dashboard → Pages → site-1 project → Settings → Environment Variables

| Variable | Value | Type |
|----------|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[PROJECT_REF].supabase.co` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Public |
| `NEXT_PUBLIC_SUPABASE_EDGE_URL` | `https://[PROJECT_REF].supabase.co/functions/v1` | Public |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay publishable key (rzp_live_...) | Public |

⚠️ KABHI NAHI DAALNA CLOUDFLARE FRONTEND MEIN:
- `SUPABASE_SERVICE_ROLE_KEY` ❌
- `RAZORPAY_KEY_SECRET` ❌
- `RAZORPAY_WEBHOOK_SECRET` ❌
- `JWT_SECRET` ❌
- `ADMIN_PASSWORD_HASH` ❌

---

## 3. CLOUDFLARE PAGES — SITE 2 (app.libraryos.in)
### Set karo: Cloudflare Dashboard → Pages → site-2 project → Settings → Environment Variables

| Variable | Value | Type |
|----------|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[PROJECT_REF].supabase.co` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Public |
| `NEXT_PUBLIC_SUPABASE_EDGE_URL` | `https://[PROJECT_REF].supabase.co/functions/v1` | Public |
| `NEXT_PUBLIC_SITE1_URL` | `https://libraryos.in` | Public |

---

## 4. RAZORPAY DASHBOARD — WEBHOOK URL UPDATE
### Go to: Razorpay Dashboard → Settings → Webhooks → Edit

| Setting | Old Value | New Value |
|---------|-----------|-----------|
| Webhook URL | `https://libraryos.in/api/razorpay-webhook` | `https://[PROJECT_REF].supabase.co/functions/v1/razorpay-webhook` |
| Webhook Secret | (same, don't change) | (same) |
| Active Events | `order.paid`, `payment.captured`, `payment.failed` | (same, don't change) |

---

## 5. SUPABASE DASHBOARD — EDGE FUNCTION SETTINGS
### Go to: Supabase Dashboard → Edge Functions → razorpay-webhook → Settings

| Setting | Value |
|---------|-------|
| Enforce JWT Verification | ❌ DISABLED (Razorpay apna HMAC bhejta hai) |

### Baaki saari functions:
| Setting | Value |
|---------|-------|
| Enforce JWT Verification | ✅ ENABLED (ya handle karo khud Authorization header se) |

---

## 6. LOCAL DEVELOPMENT

### .env.local for Site 1 (delete before committing):
```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
NEXT_PUBLIC_SUPABASE_EDGE_URL=http://localhost:54321/functions/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_[test_key]
```

### .env.local for Site 2:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
NEXT_PUBLIC_SUPABASE_EDGE_URL=http://localhost:54321/functions/v1
NEXT_PUBLIC_SITE1_URL=http://localhost:3000
```

### supabase/.env (for local Edge Function testing):
```env
RAZORPAY_KEY_ID=rzp_test_[test_key]
RAZORPAY_KEY_SECRET=[test_secret]
RAZORPAY_WEBHOOK_SECRET=[test_webhook_secret]
JWT_SECRET=local_dev_jwt_secret_minimum_32_chars_long
ADMIN_EMAIL=admin@libraryos.in
ADMIN_PASSWORD_HASH=[bcrypt_hash]
```

### Local Edge Function testing commands:
```bash
# Start local Supabase
supabase start

# Serve a specific function locally
supabase functions serve razorpay-webhook --env-file supabase/.env

# Serve all functions
supabase functions serve --env-file supabase/.env

# Test webhook locally (use ngrok to expose)
ngrok http 54321
# Then use ngrok URL in Razorpay test webhook
```

---

## 7. DEPLOYMENT ORDER (follow this sequence)

```
1. supabase secrets set (set all secrets in Supabase)
2. supabase functions deploy (deploy all Edge Functions)
3. Disable JWT verification for razorpay-webhook in Supabase Dashboard
4. Update Razorpay webhook URL in Razorpay Dashboard
5. Build + deploy Site 1 to Cloudflare Pages
6. Build + deploy Site 2 to Cloudflare Pages
7. Set custom domains in Cloudflare
8. Test payment flow (test mode)
9. Switch to live Razorpay keys
10. Monitor Edge Function logs: supabase functions logs razorpay-webhook
```

---

## 8. QUICK REFERENCE — PROJECT REFS

Fill these in once:

| Item | Value |
|------|-------|
| Supabase Project Ref | `____________` |
| Supabase URL | `https://____________.supabase.co` |
| Cloudflare Account ID | `____________` |
| Cloudflare Pages Site 1 | `____________.pages.dev` |
| Cloudflare Pages Site 2 | `____________.pages.dev` |
| Razorpay New Webhook URL | `https://____________.supabase.co/functions/v1/razorpay-webhook` |
