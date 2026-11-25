# Lumora AutoLights 🔦

**Premium Automotive Lighting E-Commerce Website**

Built with Next.js 14, TypeScript, Tailwind CSS — inspired by the design aesthetics of professional automotive lighting brands.

---

## ✨ Features

- 🏠 **Homepage** — Hero, Categories, Best Sellers, Promo Banner, New Arrivals, Testimonials
- 🔍 **Product Catalog** — Search, filter by category, filter by price, sort (newest/best seller/price)
- 📦 **Product Detail** — Photo gallery, variant selector, quantity selector, specifications
- 🛒 **Shopping Cart** — Add/remove/update items, persisted with localStorage
- 💬 **Checkout via WhatsApp** — Auto-formatted WhatsApp message with order details
- 🔧 **Admin Dashboard** — Manage products (add/edit/delete), toggle status, settings
- 📱 **Responsive** — Mobile, tablet, desktop
- 🎨 **Premium Design** — Dark theme, red accents, automotive branding

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm / pnpm

### Installation

```bash
# 1. Clone or navigate to project directory
cd lumora-autolights

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your WhatsApp number, store info, etc.

# 4. Run development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

---

## 📁 Project Structure

```
lumora-autolights/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage
│   │   ├── products/           # Products catalog
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx # Product detail
│   │   ├── cart/page.tsx       # Shopping cart
│   │   ├── checkout/page.tsx   # Checkout + WhatsApp
│   │   ├── categories/page.tsx # Category listing
│   │   ├── about/page.tsx      # About Us
│   │   ├── contact/page.tsx    # Contact
│   │   └── admin/              # Admin dashboard
│   │       ├── page.tsx        # Login
│   │       └── dashboard/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx      # Sticky navbar + mobile menu
│   │   │   └── Footer.tsx      # Footer with links
│   │   └── ui/
│   │       ├── ProductCard.tsx # Reusable product card
│   │       ├── StarRating.tsx  # Star rating component
│   │       └── FloatingWhatsApp.tsx
│   ├── context/
│   │   └── CartContext.tsx     # Cart state (localStorage)
│   ├── data/
│   │   └── products.ts         # Mock product data + testimonials
│   ├── lib/
│   │   ├── config.ts           # Store config + WA URL builder
│   │   └── utils.ts            # Currency formatters
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── .env.example                # Environment variables template
├── .env.local                  # Your local environment variables
├── SUPABASE_SETUP.md           # Guide to connect Supabase
└── package.json
```

---

## ⚙️ Configuration

Edit `.env.local` to customize:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Admin WhatsApp (format: `62812xxxxxxxx`) |
| `NEXT_PUBLIC_STORE_NAME` | Store name |
| `NEXT_PUBLIC_STORE_ADDRESS` | Physical store address |
| `NEXT_PUBLIC_INSTAGRAM` | Instagram handle |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | Optional Google Maps embed |
| `NEXT_PUBLIC_ADMIN_USERNAME` | Admin login username |

---

## 🛒 WhatsApp Checkout

The checkout flow:
1. Customer fills name, WhatsApp, address, city
2. Click "CHECKOUT VIA WHATSAPP"
3. Browser opens WhatsApp with auto-formatted order message
4. Admin confirms, processes payment & shipping via WhatsApp

**No payment gateway needed.** All transactions handled manually via WhatsApp.

---

## 🔐 Admin Dashboard

Access at `/admin`

Default credentials (change in `.env.local`):
- Username: `admin`
- Password: `lumora2024admin`

Admin features:
- View product stats overview
- Add / Edit / Delete products
- Toggle product active status
- Mark as Best Seller / New Arrival
- Set discount prices
- Manage store settings & WhatsApp number

---

## 🗄️ Database (Supabase — Optional)

The app works with local mock data out-of-the-box. To connect Supabase for production:

See **SUPABASE_SETUP.md** for complete SQL schema and setup instructions.

---

## 🎨 Design System

| Color | Usage |
|---|---|
| `#E50000` (Red) | Primary accent, CTAs, badges |
| `#0A0A0A` (Black) | Background |
| `#1A1A1A` (Dark gray) | Cards, sections |
| `#9CA3AF` (Gray) | Secondary text |
| `#FFFFFF` (White) | Primary text |

**Fonts:** Inter (body) + Rajdhani (headings)

---

## 📱 Pages

| URL | Page |
|---|---|
| `/` | Homepage |
| `/products` | Product catalog with filters |
| `/products/[slug]` | Product detail |
| `/categories` | Category listing |
| `/cart` | Shopping cart |
| `/checkout` | Checkout form + WhatsApp |
| `/about` | About Us |
| `/contact` | Contact information |
| `/admin` | Admin login |
| `/admin/dashboard` | Admin dashboard |

---

## 🔧 Customization

### Add a new product
1. Go to `/admin/dashboard` → Kelola Produk → Tambah Produk
2. Fill in product details and save
3. (In production) Products are stored in Supabase

### Change WhatsApp number
Edit `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=628123456789
```

### Add categories
Edit `src/types/index.ts` → update the `Category` union type, then update `src/data/products.ts`.

---

Made with ❤️ for automotive enthusiasts | Lumora AutoLights
