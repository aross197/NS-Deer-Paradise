# Authentication & Email Confirmation Flow

## Goal

1. User registers for a **free account**
2. System sends a **confirmation email**
3. User clicks the link → account verified
4. User is **logged into paradise** (dashboard)

## Recommended Implementation (Auth.js v5 + Resend)

### 1. Packages already in package.json
- `next-auth` (Auth.js)
- `@auth/prisma-adapter`
- `resend`
- `bcryptjs` (if using credentials provider)
- `zod` for validation

### 2. High-level flow

```
Register form
    ↓
Create User (emailVerified = null) + hashed password
    ↓
Generate VerificationToken (Prisma model)
    ↓
Send email via Resend with link: /api/auth/verify?token=...
    ↓
User clicks link
    ↓
Mark emailVerified = now()
Delete token
Create session
Redirect to /dashboard  (“Paradise”)
```

### 3. Key files to implement next

- `auth.ts` — Auth.js configuration (Credentials + Email provider or pure credentials + custom verification)
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/auth/register/route.ts` — handles form POST, creates user, sends email
- `app/api/auth/verify/route.ts` — verifies token, sets emailVerified, signs in
- `lib/email.ts` — Resend wrapper with a nice “Welcome to NS Deer Paradise” template
- `app/dashboard/page.tsx` — protected route (the paradise)

### 4. Environment variables needed

See `.env.example`:
- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `RESEND_API_KEY`
- `EMAIL_FROM`

### 5. Security notes

- Tokens expire (e.g. 24 hours)
- Rate-limit registration and resend
- Never store plain-text passwords
- Use HTTPS in production
- Consider CAPTCHA later if spam becomes an issue

### 6. Alternative: Magic-link only

Auth.js has excellent Email provider support. You can skip passwords entirely and send a magic login link every time. Many modern hunting apps prefer this for simplicity.

---

Once the above is wired, the landing page CTAs will fully work and every new hunter lands in paradise after confirming their email.
