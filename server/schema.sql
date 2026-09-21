CREATE TABLE IF NOT EXISTS shipping_rates (
 governorate TEXT PRIMARY KEY,
 amount_egp INTEGER NOT NULL CHECK(amount_egp >= 0),
 enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)),
 verified_at TEXT NOT NULL
);
-- No rates are seeded: no unverified shipping fees or free-shipping assumptions.
-- Rates, when approved, apply per order. If quotes depend on quantity or address,
-- keep the relevant governorate disabled and quote the order individually.
CREATE TABLE IF NOT EXISTS orders (
 reference TEXT PRIMARY KEY,
 request_key TEXT UNIQUE NOT NULL,
 body_hash TEXT NOT NULL,
 parent_name TEXT NOT NULL,
 phone TEXT NOT NULL,
 governorate TEXT NOT NULL,
 city TEXT NOT NULL,
 address TEXT NOT NULL,
 quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 20),
 payment_method TEXT NOT NULL CHECK(payment_method IN ('instapay','bank')),
 notes TEXT NOT NULL DEFAULT '',
 locale TEXT NOT NULL CHECK(locale IN ('ar','en')),
 unit_price_egp INTEGER NOT NULL CHECK(unit_price_egp = 200),
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
CREATE INDEX IF NOT EXISTS orders_review ON orders(status,created_at);
CREATE TABLE IF NOT EXISTS request_limits(bucket TEXT PRIMARY KEY,attempts INTEGER NOT NULL,expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS request_limits_expiry ON request_limits(expires_at);
