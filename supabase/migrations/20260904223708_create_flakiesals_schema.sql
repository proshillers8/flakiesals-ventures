/*
# FLAKIESALS Ventures E-Commerce Schema

## Overview
Creates the complete database schema for the FLAKIESALS Ventures e-commerce store.
This is a single-tenant app (no customer sign-in), so all policies allow anon + authenticated access.

## New Tables

1. **products** - Stores all product information
   - id (text, primary key) - Product ID from CSV
   - name (text) - Product name
   - category (text) - Product category
   - price (integer) - Price in Naira
   - image (text) - Image file path
   - description (text) - Product description
   - badge (text) - Badge label (e.g. "New", "Sale")
   - stock (integer) - Available inventory
   - is_featured (boolean) - Show on homepage featured section
   - is_best_seller (boolean) - Show as best seller
   - is_new_arrival (boolean) - Show as new arrival
   - is_special_offer (boolean) - Show as special offer
   - is_active (boolean) - Product visibility
   - created_at (timestamp) - Creation time

2. **orders** - Stores customer orders
   - id (uuid, primary key) - Order ID
   - customer_name (text) - Customer full name
   - customer_phone (text) - Phone number
   - customer_email (text) - Email address
   - customer_address (text) - Delivery address/notes
   - items (jsonb) - Array of order items with product_id, name, price, quantity, image
   - total (integer) - Total order amount in Naira
   - payment_status (text) - pending | confirmed | failed
   - order_status (text) - new | processing | fulfilled | cancelled
   - created_at (timestamp) - Order time

## Security
- RLS enabled on both tables
- All CRUD operations allowed for anon + authenticated (single-tenant, no sign-in)
*/

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  price integer NOT NULL DEFAULT 0,
  image text NOT NULL DEFAULT '',
  description text,
  badge text,
  stock integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_best_seller boolean NOT NULL DEFAULT false,
  is_new_arrival boolean NOT NULL DEFAULT false,
  is_special_offer boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  customer_address text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total integer NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending',
  order_status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products policies (single-tenant: anon + authenticated)
DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

-- Orders policies (single-tenant: anon + authenticated)
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment ON orders(payment_status);
