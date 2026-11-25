# Supabase Setup Guide — Lumora AutoLights

## Overview

Lumora AutoLights is designed to work with **Supabase** for production-ready database storage,
authentication, and image storage. By default, the app uses local mock data for products.

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account.
2. Create a new project. Note your **Project URL** and **anon key**.

---

## 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## 3. Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  specs JSONB DEFAULT '{}',
  compatible_vehicles TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  price INTEGER NOT NULL DEFAULT 0,
  original_price INTEGER,
  discount_percent INTEGER,
  stock INTEGER NOT NULL DEFAULT 0,
  is_best_seller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product variants
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read variants" ON product_variants
  FOR SELECT USING (true);

-- Admin full access (authenticated users)
CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage variants" ON product_variants
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## 4. Storage Setup (Product Images)

1. In Supabase Dashboard → Storage → Create bucket: `product-images`
2. Set bucket to **Public**
3. In `.env.local`, the Supabase storage URL will be:
   `https://your-project.supabase.co/storage/v1/object/public/product-images/`

---

## 5. Auth Setup (Admin Login)

1. In Supabase Dashboard → Authentication → Users → Add user
2. Use email/password auth
3. Update the admin login page to use `supabase.auth.signInWithPassword()`

---

## 6. Connecting the App to Supabase

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

Then replace `src/data/products.ts` mock data with Supabase queries:

```typescript
// In your page or API route:
const { data: products } = await supabase
  .from('products')
  .select('*, product_variants(*)')
  .eq('is_active', true)
  .order('created_at', { ascending: false });
```

---

## 7. Seeding Initial Data

After setting up the schema, you can seed the initial product data by running:

```bash
# Install Supabase CLI
npm install -g supabase

# Or use the Supabase dashboard Table Editor to insert rows manually
```

---

## Status

- ✅ Local mock data: Working (src/data/products.ts)
- ⏳ Supabase integration: Requires environment variables above
- ✅ WhatsApp checkout: Working (no database needed)
- ✅ Cart (localStorage): Working
- ✅ Admin Dashboard: Working (session-based, upgrade to Supabase Auth for production)
