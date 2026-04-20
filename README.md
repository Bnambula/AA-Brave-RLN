# Raylane Express — Deployment Guide

## 🚀 Deploy to Vercel in 5 Minutes

### Prerequisites
- A free [Vercel account](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/cli) installed: `npm i -g vercel`

---

## Method 1: Vercel CLI (Recommended)

```bash
# 1. Navigate to the project folder
cd raylane-express

# 2. Login to Vercel
vercel login

# 3. Deploy (follow prompts — accept all defaults)
vercel

# 4. For production deployment
vercel --prod
```

Your site will be live at `https://raylane-express.vercel.app`

---

## Method 2: GitHub + Vercel Dashboard

1. Push this folder to a GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. Framework Preset: **Other**
5. Root Directory: `/` (leave blank)
6. Click **Deploy**

---

## Method 3: Drag & Drop

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag the `raylane-express` folder into the upload zone
3. Deploy automatically

---

## 🌐 Custom Domain Setup (raylaneexpress.com)

After deployment:
1. Go to your Vercel project → **Settings** → **Domains**
2. Add `raylaneexpress.com`
3. Add `www.raylaneexpress.com`
4. At your domain registrar (e.g. GoDaddy, Namecheap):
   - Add a **CNAME** record: `www` → `cname.vercel-dns.com`
   - Add an **A** record: `@` → `76.76.21.21`
5. SSL certificate is auto-issued (takes ~2 minutes)

---

## 📁 File Structure

```
raylane-express/
├── vercel.json              # Routing & deployment config
├── public/
│   ├── index.html           # Homepage (passenger-facing)
│   ├── book.html            # Booking flow (search → seat → pay → QR)
│   ├── track.html           # Real-time coach tracker
│   ├── parcels.html         # Parcel booking & tracking
│   ├── account.html         # Passenger account & loyalty
│   ├── partner.html         # Operator onboarding portal
│   ├── admin.html           # Super admin console
│   ├── operator.html        # Operator dashboard (with branding)
│   ├── driver.html          # Driver QR scanner PWA
│   ├── logo.png             # Raylane Express logo
│   ├── styles.css           # Global design system
│   ├── app.js               # Shared JavaScript utilities
│   └── manifest.json        # PWA manifest (Add to Home Screen)
└── README.md
```

---

## 🔌 Backend Integration (Supabase)

For production, connect to Supabase:

1. Create project at [supabase.com](https://supabase.com)
2. Add to Vercel environment variables:
   - `SUPABASE_URL` = your project URL
   - `SUPABASE_ANON_KEY` = your anon key
3. Enable Row Level Security on all tables
4. Key tables: `bookings`, `trips`, `operators`, `passengers`, `parcels`, `payouts`, `vehicles`, `drivers`

---

## 💳 Payment Integration (DPO Group)

1. Apply for merchant account at [dpo.africa](https://dpo.africa)
2. Documents needed: Business registration, TIN, director IDs, bank details
3. Approval: 5–10 business days
4. Add to Vercel env: `DPO_COMPANY_TOKEN`, `DPO_SERVICE_TYPE`

---

## 📱 SMS Integration (Africa Talking)

1. Create account at [africastalking.com](https://africastalking.com)
2. Apply for `RAYLANE` Sender ID (5–7 business days)
3. Add to Vercel env: `AT_API_KEY`, `AT_USERNAME`
4. Cost: UGX 25–35 per SMS (vs Twilio at UGX 80–120)

---

## 🔧 Environment Variables

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# DPO Group Payments
DPO_COMPANY_TOKEN=your-token
DPO_SERVICE_TYPE=your-service-type

# Africa Talking SMS
AT_API_KEY=your-key
AT_USERNAME=raylane
AT_SENDER_ID=RAYLANE

# Google Maps (for location detection)
GOOGLE_MAPS_API_KEY=your-key
```

---

## 🌍 Portal URLs

| Portal | URL |
|--------|-----|
| Public Website | `raylaneexpress.com` |
| Admin Console | `raylaneexpress.com/admin` |
| Operator Dashboard | `raylaneexpress.com/operator/[id]` |
| Partner Portal | `raylaneexpress.com/partner` |
| Driver Scanner | `raylaneexpress.com/driver/[plate]` |
| Book Travel | `raylaneexpress.com/book` |
| Track Coach | `raylaneexpress.com/track` |
| Parcel Booking | `raylaneexpress.com/parcels` |

---

## 📊 Key Platform Metrics (Steady State)

- 50 operators, 200 daily trips, 3,000 daily bookings
- Booking commission: UGX 50–80M/month
- SaaS subscriptions: UGX 15–25M/month
- Net margin: 65–72% on SaaS, 85–90% on commissions

---

*Raylane Express — Tusimbudde! 🇺🇬*
