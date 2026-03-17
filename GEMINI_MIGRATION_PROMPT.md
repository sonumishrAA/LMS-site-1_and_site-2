# LIBRARYOS — FULL BACKEND MIGRATION PROMPT
# Backend: Next.js API Routes → Supabase Edge Functions (Deno)
# Frontend: Next.js → Cloudflare Pages (Static Export)

---

## YOUR ROLE

You are a senior full-stack engineer migrating a production Next.js SaaS app called **LibraryOS** from a monolithic Next.js deployment to:
- **Backend**: Supabase Edge Functions (Deno runtime, TypeScript)
- **Frontend**: Static Next.js exported to Cloudflare Pages

You will produce complete, production-ready code. Do not skip any function. Do not break any existing functionality.

---

## PROJECT OVERVIEW

LibraryOS is a multi-tenant library management SaaS with two Next.js apps:

### Site 1 — `libraryos.in` (Marketing + Registration + Admin)
- Public landing page, pricing, help, founder page
- 8-step library onboarding/registration wizard with Razorpay payment
- Library renewal flow
- Admin panel at `/lms-admin`
- Cross-site JWT token generation (for Site 2 → Site 1 renewal redirect)

### Site 2 — `app.libraryos.in` (Dashboard App)
- Protected dashboard (Supabase Auth)
- Student management, seat management, shifts, lockers
- Subscription renewal (redirects to Site 1 with JWT token)
- PWA enabled

---

## CURRENT API ROUTES (ALL must become Edge Functions)

### Site 1 API Routes:
| Route | Method | New Edge Function Name |
|-------|--------|----------------------|
| `/api/create-payment-order` | POST | `create-payment-order` |
| `/api/verify-payment` | POST | `verify-payment` |
| `/api/razorpay-webhook` | POST | `razorpay-webhook` |
| `/api/create-renewal-order` | POST | `create-renewal-order` |
| `/api/check-email` | POST | `check-email` |
| `/api/generate-token` | POST | `generate-token` |
| `/api/verify-token` | GET | `verify-token` |
| `/api/contact` | POST | `contact` |
| `/api/admin/login` | POST | `admin-login` |
| `/api/admin/logout` | POST | `admin-logout` |
| `/api/admin/libraries` | GET | `admin-libraries` |
| `/api/admin/libraries/[id]` | DELETE | `admin-library-by-id` |
| `/api/admin/messages` | GET, PATCH | `admin-messages` |
| `/api/staff/clear-force-password-change` | POST | `staff-clear-force-password-change` |

---

## CRITICAL MIGRATION RULES

### 1. Deno Runtime — Library Replacements
| Old (Node.js) | New (Deno) |
|---------------|-----------|
| `crypto` (Node built-in) | `globalThis.crypto` (Web Crypto API, built-in) |
| `jsonwebtoken` | `jose` from `npm:jose` |
| `bcryptjs` | `npm:bcryptjs` (works in Deno) |
| `razorpay` SDK | Direct `fetch()` to Razorpay REST API |
| `resend` SDK | Direct `fetch()` to Resend REST API |
| `next/server` | Native Deno `Request` / `Response` |
| `@supabase/supabase-js` | `npm:@supabase/supabase-js` |

### 2. HMAC Signature (Razorpay) — Web Crypto API
```typescript
async function hmacSHA256(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}
```

### 3. JWT with jose (replaces jsonwebtoken)
```typescript
import { SignJWT, jwtVerify } from 'npm:jose'

// Sign
const secret = new TextEncoder().encode(Deno.env.get('JWT_SECRET')!)
const token = await new SignJWT(payload)
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('15m')
  .sign(secret)

// Verify
const { payload } = await jwtVerify(token, secret)
```

### 4. Razorpay — Direct HTTP (no SDK)
```typescript
const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')!
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!
const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)

const res = await fetch('https://api.razorpay.com/v1/orders', {
  method: 'POST',
  headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: amountInPaise, currency: 'INR', receipt, notes })
})
const order = await res.json()
```

### 5. Admin Rate Limiting — Use Supabase Table (Edge Functions are stateless!)
Create a `admin_login_attempts` table:
```sql
create table admin_login_attempts (
  ip text primary key,
  count int default 0,
  last_attempt timestamptz default now()
);
```

### 6. Admin Cookie — Cross-origin cookie won't work from Edge Function to Cloudflare frontend
Use **localStorage + Authorization header** instead of httpOnly cookies for admin token:
- Edge Function returns `{ token: "..." }` in JSON
- Frontend stores in `localStorage`
- Every admin API call sends `Authorization: Bearer <token>` header
- Edge Function reads `Authorization` header to verify admin

### 7. CORS — Every Edge Function needs CORS headers
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // or specific domain in production
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-razorpay-signature',
}

// Handle OPTIONS preflight
if (req.method === 'OPTIONS') {
  return new Response(null, { headers: corsHeaders })
}
```

### 8. Supabase Edge Function Entry Pattern
```typescript
// supabase/functions/function-name/index.ts
import { createClient } from 'npm:@supabase/supabase-js'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  
  try {
    // ... logic
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
```

---

## WHAT TO BUILD

### TASK 1: Create ALL 14 Edge Functions

For each Edge Function, replicate the EXACT logic from the original Next.js route. Key ones explained:

#### `razorpay-webhook` (MOST CRITICAL)
- Read raw body as text for signature verification
- Use Web Crypto HMAC to verify `x-razorpay-signature` header
- Handle `order.paid`, `payment.captured`, `payment.failed` events
- Branch 1 (renewal): Update `libraries` table, insert `subscription_payments`, insert `notifications`
- Branch 2 (new registration / add-library): Fetch from `temp_registrations`, resolve/create auth users, call `complete_library_registration` RPC
- **IMPORTANT**: Razorpay Dashboard webhook URL must be updated to: `https://[PROJECT_REF].supabase.co/functions/v1/razorpay-webhook`
- No `Authorization: Bearer` header check needed — Razorpay signs with HMAC. But add `WEBHOOK_SECRET` env var.

#### `create-payment-order`
- Fetch pricing from `pricing_config` table
- Create Razorpay order via direct HTTP
- Insert into `temp_registrations` with form_data
- Insert pending row into `subscription_payments`

#### `verify-payment`
- HMAC verify: `razorpay_order_id|razorpay_payment_id` with `RAZORPAY_KEY_SECRET`
- Idempotency: check `subscription_payments.processed`
- Fetch `temp_registrations`, create auth users, call `complete_library_registration` RPC

#### `create-renewal-order`
- Verify JWT token (purpose: 'renew')
- Check owner has this library_id
- Create Razorpay order with notes: `{ type: 'subscription_renewal', library_id, plan_months }`

#### `generate-token`
- Authenticate user via Supabase `Authorization: Bearer <access_token>` header
- Check owner role in `staff` table
- Sign 15-minute JWT with `jose`

#### `admin-login`
- Compare email + bcrypt password
- Rate limit via `admin_login_attempts` table
- Return JWT token in JSON response body (NOT cookie — Cloudflare cross-origin)

#### `admin-libraries`
- GET: Fetch libraries, staff, students, auth users — enrich and return
- Protect with admin JWT from Authorization header

#### `admin-library-by-id`
- DELETE: Delete library, cleanup staff auth users, cleanup owner if no other libraries

#### `admin-messages`
- GET: Fetch contact_messages
- PATCH: Mark message as read

#### `contact`
- Insert into `contact_messages` table (no Resend needed, already works this way)

#### `check-email`
- Check if email exists as owner in `staff` table

#### `verify-token`
- Verify cross-site JWT, return payload + library info

#### `staff-clear-force-password-change`
- Authenticate user via Supabase header
- Update `staff.force_password_change = false` for that user_id

---

### TASK 2: Modify Next.js for Static Export (Cloudflare Pages)

#### `next.config.js` / `next.config.ts` for BOTH sites:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // Static HTML export
  trailingSlash: true,        // Cloudflare Pages requires this
  images: {
    unoptimized: true,        // No Next.js image optimization (use Cloudflare instead)
  },
  // Remove any: serverActions, middleware rewrite to /api, etc.
}
module.exports = nextConfig
```

#### Remove from both projects:
- All files in `src/app/api/` — DELETE them all
- `src/middleware.ts` if it does server-side auth redirects → move to client-side
- `src/lib/supabase/service.ts` (uses SERVICE_ROLE_KEY — never expose on frontend!)
- `src/lib/jwt.ts` (server-side JWT signing — move to Edge Function)
- Any `import { headers } from 'next/headers'`
- Any `import { cookies } from 'next/headers'`

#### Middleware replacement for auth:
Since static export has NO middleware, protect routes client-side:
```typescript
// src/components/AuthGuard.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/login')
    })
  }, [router])
  return <>{children}</>
}
```

#### Update ALL API calls in frontend:
Replace every `fetch('/api/...')` with the Edge Function URL:
```typescript
// Create this file: src/lib/api.ts
const EDGE_BASE = process.env.NEXT_PUBLIC_SUPABASE_EDGE_URL
// = 'https://[PROJECT_REF].supabase.co/functions/v1'

export const api = {
  createPaymentOrder: `${EDGE_BASE}/create-payment-order`,
  verifyPayment: `${EDGE_BASE}/verify-payment`,
  createRenewalOrder: `${EDGE_BASE}/create-renewal-order`,
  checkEmail: `${EDGE_BASE}/check-email`,
  generateToken: `${EDGE_BASE}/generate-token`,
  verifyToken: `${EDGE_BASE}/verify-token`,
  contact: `${EDGE_BASE}/contact`,
  adminLogin: `${EDGE_BASE}/admin-login`,
  adminLibraries: `${EDGE_BASE}/admin-libraries`,
  adminLibraryById: (id: string) => `${EDGE_BASE}/admin-library-by-id?id=${id}`,
  adminMessages: `${EDGE_BASE}/admin-messages`,
  staffClearForcePassword: `${EDGE_BASE}/staff-clear-force-password-change`,
}
```

#### Admin auth — change from cookie to localStorage:
```typescript
// Old (cookie-based, won't work cross-origin):
// response.cookies.set('admin_token', token)

// New (localStorage-based):
// In login page:
const res = await fetch(api.adminLogin, { method: 'POST', body: JSON.stringify({email, password}) })
const { token } = await res.json()
localStorage.setItem('admin_token', token)

// In every admin API call:
const token = localStorage.getItem('admin_token')
fetch(api.adminLibraries, { headers: { 'Authorization': `Bearer ${token}` } })
```

#### For generate-token (needs Supabase session):
```typescript
// Frontend passes Supabase access token in Authorization header
const { data: { session } } = await supabaseBrowser.auth.getSession()
const res = await fetch(api.generateToken, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token}`
  },
  body: JSON.stringify({ library_id, purpose: 'renew' })
})
```

#### Cloudflare Pages `_redirects` file (add to `public/` folder):
```
/* /index.html 200
```
This ensures SPA routing works on Cloudflare Pages.

#### Site 2 PWA config:
`next-pwa` requires server. Replace with manual `public/manifest.json` + `public/sw.js` OR use `@ducanh2912/next-pwa` which supports static export.

---

### TASK 3: Edge Function for generate-token — Authenticate via Supabase Header

The frontend passes `Authorization: Bearer <supabase_access_token>`. Edge Function verifies it:
```typescript
const authHeader = req.headers.get('Authorization')
const accessToken = authHeader?.replace('Bearer ', '')

// Create user-scoped Supabase client
const supabaseUser = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!,
  { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
)
const { data: { user } } = await supabaseUser.auth.getUser()
if (!user) return unauthorizedResponse()
```

---

### TASK 4: Update Razorpay Webhook URL

In **Razorpay Dashboard → Webhooks → Edit**:
- Old URL: `https://libraryos.in/api/razorpay-webhook`
- New URL: `https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/functions/v1/razorpay-webhook`

The webhook secret stays the same (`RAZORPAY_WEBHOOK_SECRET`).

---

### TASK 5: Cloudflare Pages Deployment Config

For **each site** (Site 1 and Site 2):

**Build settings in Cloudflare Pages dashboard:**
```
Build command:     npm run build
Build output dir:  out
Root directory:    /  (or site-1 / site-2 if monorepo)
Node.js version:   20
```

**Environment Variables in Cloudflare Pages (for each site):**
```
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
NEXT_PUBLIC_SUPABASE_EDGE_URL=https://[PROJECT_REF].supabase.co/functions/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=[razorpay_key_id]   # only site-1
```

**Custom Domains:**
- Site 1: `libraryos.in` → point to Cloudflare Pages project
- Site 2: `app.libraryos.in` → point to Cloudflare Pages project

---

### TASK 6: Supabase Edge Function Secrets (set via Supabase Dashboard or CLI)

```bash
supabase secrets set SUPABASE_URL=https://[PROJECT_REF].supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=[service_role_key]
supabase secrets set SUPABASE_ANON_KEY=[anon_key]
supabase secrets set RAZORPAY_KEY_ID=[key_id]
supabase secrets set RAZORPAY_KEY_SECRET=[key_secret]
supabase secrets set RAZORPAY_WEBHOOK_SECRET=[webhook_secret]
supabase secrets set JWT_SECRET=[your_jwt_secret]
supabase secrets set ADMIN_EMAIL=[admin_email]
supabase secrets set ADMIN_PASSWORD_HASH=[bcrypt_hash]
```

Note: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-available in Edge Functions — you only need to set the others.

---

### TASK 7: Deploy Edge Functions

```bash
# Deploy all at once
supabase functions deploy

# Or individually
supabase functions deploy razorpay-webhook
supabase functions deploy create-payment-order
# etc.
```

**IMPORTANT**: For `razorpay-webhook`, disable JWT verification in Supabase Dashboard:
- Go to Supabase Dashboard → Edge Functions → `razorpay-webhook` → Settings
- Uncheck "Enforce JWT Verification" (Razorpay sends its own HMAC, not a Supabase JWT)

---

## PERFORMANCE OPTIMIZATION TIPS

### 1. Cloudflare Pages = Global CDN (automatic)
- All static HTML/CSS/JS served from 300+ PoPs worldwide
- Time to first byte: ~5-15ms vs ~200ms for Vercel serverless
- No cold starts for frontend

### 2. Supabase Edge Functions = Deno Deploy (global)
- Edge Functions run on Deno Deploy infrastructure, close to users
- Cold start: ~50-100ms (vs Vercel: ~300-500ms)
- Keep functions small — don't import heavy libraries

### 3. Cache API responses on Cloudflare
For public, non-sensitive data (pricing, etc.), add cache headers:
```typescript
return new Response(JSON.stringify(data), {
  headers: {
    ...corsHeaders,
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300', // 5 min cache
  }
})
```

### 4. Supabase Connection Pooling
Edge Functions are stateless + high concurrency → use connection pooler:
- In Supabase: Settings → Database → Connection Pooling → copy Pooler URL
- Use `SUPABASE_DB_URL` (pooler) instead of direct connection for heavy queries

### 5. Reduce Edge Function size — tree-shake imports
```typescript
// BAD — imports whole library
import * as jose from 'npm:jose'

// GOOD — import only what you need
import { SignJWT, jwtVerify } from 'npm:jose'
```

### 6. Supabase Realtime for live dashboard
In Site 2, use `supabase.channel()` for real-time seat/student updates instead of polling. This keeps UI live without extra HTTP calls.

### 7. Next.js Static Export Optimizations
```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  compress: true,
  poweredByHeader: false,
  // Disable unnecessary features
  experimental: {
    optimizeCss: true,
  }
}
```

### 8. Font & Image optimization on Cloudflare
- Use `next/font` with `display: 'swap'` for fast text rendering
- Add `<link rel="preconnect" href="https://[PROJECT_REF].supabase.co">` in `<head>` to pre-warm Edge Function connections

---

## FOLDER STRUCTURE FOR EDGE FUNCTIONS

```
supabase/
  functions/
    _shared/
      cors.ts              ← shared CORS headers
      supabase.ts          ← shared admin client factory
      jwt.ts               ← shared jose sign/verify
      razorpay.ts          ← shared Razorpay HTTP helper
    create-payment-order/
      index.ts
    verify-payment/
      index.ts
    razorpay-webhook/
      index.ts
    create-renewal-order/
      index.ts
    check-email/
      index.ts
    generate-token/
      index.ts
    verify-token/
      index.ts
    contact/
      index.ts
    admin-login/
      index.ts
    admin-logout/
      index.ts
    admin-libraries/
      index.ts
    admin-library-by-id/
      index.ts
    admin-messages/
      index.ts
    staff-clear-force-password-change/
      index.ts
```

---

## SHARED HELPERS (create in `supabase/functions/_shared/`)

### cors.ts
```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-razorpay-signature',
}

export function handleOptions() {
  return new Response(null, { headers: corsHeaders })
}

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
```

### supabase.ts
```typescript
import { createClient } from 'npm:@supabase/supabase-js'

export function getAdminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
}

export function getUserClient(accessToken: string) {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  )
}
```

### jwt.ts
```typescript
import { SignJWT, jwtVerify } from 'npm:jose'

const getSecret = () => new TextEncoder().encode(Deno.env.get('JWT_SECRET')!)

export async function signCrossSiteToken(payload: Record<string, unknown>, expiresIn = '15m') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret())
}

export async function verifyCrossSiteToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload
  } catch {
    return null
  }
}

export async function signAdminToken(email: string) {
  return new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(getSecret())
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (payload.role !== 'admin') return null
    return payload
  } catch {
    return null
  }
}
```

### razorpay.ts
```typescript
const getAuth = () => btoa(
  `${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_KEY_SECRET')}`
)

export async function createRazorpayOrder(params: {
  amount: number
  currency: string
  receipt: string
  notes: Record<string, string>
}) {
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${getAuth()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
  if (!res.ok) throw new Error(`Razorpay error: ${await res.text()}`)
  return res.json()
}

export async function verifyWebhookSignature(rawBody: string, signature: string): Promise<boolean> {
  const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody))
  const expected = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0')).join('')
  return expected === signature
}

export async function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): Promise<boolean> {
  const secret = Deno.env.get('RAZORPAY_KEY_SECRET')!
  const data = `${orderId}|${paymentId}`
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  const expected = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0')).join('')
  return expected === signature
}
```

---

## FINAL CHECKLIST

Before deploying:

- [ ] All 14 Edge Functions created and deployed
- [ ] `razorpay-webhook` has JWT verification DISABLED in Supabase dashboard
- [ ] All secrets set via `supabase secrets set`
- [ ] Razorpay Dashboard webhook URL updated to Edge Function URL
- [ ] Both Next.js apps have `output: 'export'` in next.config
- [ ] All `/api/...` fetch calls replaced with Edge Function URLs
- [ ] `NEXT_PUBLIC_SUPABASE_EDGE_URL` env var set in Cloudflare Pages
- [ ] Admin login uses localStorage (not cookies)
- [ ] `public/_redirects` file added to both projects for SPA routing
- [ ] `supabase/functions/_shared/` helpers created first
- [ ] Site 2 PWA manifest moved to static `public/manifest.json`
- [ ] Test webhook locally: `supabase functions serve razorpay-webhook`
- [ ] Test payment flow end-to-end in Razorpay test mode
- [ ] Verify admin panel login works post-migration

---

*Now generate all 14 Edge Functions with complete, production-ready code. Start with the `_shared/` helpers, then proceed function by function in the order listed in the table above.*
