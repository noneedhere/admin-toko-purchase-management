-- Aktifkan foreign key support (SQLite)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name    VARCHAR(255) NOT NULL,
    price           DECIMAL(15,2) NOT NULL CHECK(price > 0),
    description     TEXT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_stocks (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id      INTEGER NOT NULL UNIQUE,
    stock_quantity  INTEGER NOT NULL DEFAULT 0 CHECK(stock_quantity >= 0),
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS purchases (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number  VARCHAR(50) NOT NULL UNIQUE,
    product_id      INTEGER NOT NULL,
    quantity        INTEGER NOT NULL CHECK(quantity > 0),
    unit_price      DECIMAL(15,2) NOT NULL CHECK(unit_price > 0),
    total_price     DECIMAL(15,2) NOT NULL CHECK(total_price > 0),
    purchase_date   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK(status IN ('active', 'cancelled')),
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX IF NOT EXISTS idx_purchases_product_id ON purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_product_stocks_product_id ON product_stocks(product_id);
