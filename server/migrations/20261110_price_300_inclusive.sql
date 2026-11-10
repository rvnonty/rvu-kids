-- One-time migration for existing order databases created with unit_price_egp = 200.
-- Backup the database and disable order writes while applying this migration.
-- This script preserves old 200 EGP order records and their references.
-- New orders use a 300 EGP price with shipping_egp = 0; see server/worker.mjs.
-- Do not execute twice. The former orders table is retained as a backup.
CREATE TABLE orders_price_300 (
 reference TEXT PRIMARY KEY,
 request_key TEXT UNIQUE NOT NULL,
 body_hash TEXT NOT NULL,
 parent_name TEXT NOT NULL,
 phone TEXT NOT NULL,
 governorate TEXT NOT NULL,
 city TEXT NOT NULL,
 address TEXT NOT NULL,
 quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 20),
 payment_method TEXT NOT NULL CHECK(payment_method IN ('instapay','vodafone_cash')),
 notes TEXT NOT NULL DEFAULT '',
 locale TEXT NOT NULL CHECK(locale IN ('ar','en')),
 unit_price_egp INTEGER NOT NULL CHECK(unit_price_egp > 0),
 subtotal_egp INTEGER NOT NULL,
 shipping_egp INTEGER,
 total_egp INTEGER,
 status TEXT NOT NULL DEFAULT 'pending_review' CHECK(status IN ('pending_review','awaiting_payment','paid_verified','printing','shipped','cancelled')),
 created_at TEXT NOT NULL,
 consent_version TEXT NOT NULL,
 payment_verified_at TEXT,
 payment_verified_by TEXT,
 CHECK(subtotal_egp = quantity * unit_price_egp),
 CHECK((shipping_egp IS NULL AND total_egp IS NULL) OR (shipping_egp IS NOT NULL AND shipping_egp >= 0 AND total_egp = subtotal_egp + shipping_egp)),
 CHECK(status NOT IN ('paid_verified','printing','shipped') OR (payment_verified_at IS NOT NULL AND payment_verified_by IS NOT NULL))
);
INSERT INTO orders_price_300 (reference, request_key, body_hash, parent_name, phone, governorate, city, address, quantity, payment_method, notes, locale, unit_price_egp, subtotal_egp, shipping_egp, total_egp, status, created_at, consent_version, payment_verified_at, payment_verified_by)
 SELECT reference, request_key, body_hash, parent_name, phone, governorate, city, address, quantity, payment_method, notes, locale, unit_price_egp, subtotal_egp, shipping_egp, total_egp, status, created_at, consent_version, payment_verified_at, payment_verified_by FROM orders;
ALTER TABLE orders RENAME TO orders_before_300_egp;
ALTER TABLE orders_price_300 RENAME TO orders;
DROP INDEX IF EXISTS orders_review;
CREATE INDEX IF NOT EXISTS orders_review ON orders(status,created_at);
