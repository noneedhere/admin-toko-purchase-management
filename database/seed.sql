-- Seed: 10 Data Produk
INSERT INTO products (product_name, price, description, created_at) VALUES
('Laptop ASUS VivoBook 14', 8500000.00, 'Laptop ringan dengan prosesor Intel Core i5, RAM 8GB, SSD 512GB, layar FHD 14 inci.', '2025-01-10 08:00:00'),
('Mouse Wireless Logitech M235', 185000.00, 'Mouse wireless dengan koneksi USB nano receiver, baterai tahan lama hingga 12 bulan.', '2025-01-10 08:05:00'),
('Keyboard Mechanical Rexus K9', 350000.00, 'Keyboard mechanical full-size dengan switch blue, RGB backlight, anti-ghosting.', '2025-01-10 08:10:00'),
('Monitor LG 24MP400 24 Inch', 2100000.00, 'Monitor IPS FHD 24 inci, 75Hz refresh rate, AMD FreeSync, panel anti-glare.', '2025-01-15 09:00:00'),
('Headset Gaming Rexus HX20', 275000.00, 'Headset gaming stereo dengan mikrofon noise-cancelling, kompatibel PC dan konsol.', '2025-01-15 09:10:00'),
('SSD External Sandisk 1TB', 1450000.00, 'SSD portable 1TB dengan kecepatan baca 550MB/s, antarmuka USB 3.2, tahan benturan.', '2025-01-20 10:00:00'),
('RAM DDR4 Corsair 16GB 3200MHz', 650000.00, 'RAM DDR4 16GB single stick, frekuensi 3200MHz, timing CL16, cocok untuk gaming dan multitasking.', '2025-01-20 10:15:00'),
('Webcam Logitech C270 HD', 390000.00, 'Webcam HD 720p dengan mikrofon terintegrasi, plug and play, kompatibel Windows & Mac.', '2025-02-01 11:00:00'),
('Cooling Pad Laptop Havit F2073', 145000.00, 'Cooling pad laptop 15.6 inci dengan 3 kipas besar, lampu LED biru, USB powered.', '2025-02-01 11:10:00'),
('Tas Laptop Targus 15.6 Inch', 320000.00, 'Tas laptop dengan kompartemen laptop + tablet, bahan water-resistant, padding tebal.', '2025-02-05 12:00:00');

-- Seed: Stok Awal untuk setiap produk
INSERT INTO product_stocks (product_id, stock_quantity, updated_at) VALUES
(1, 15, CURRENT_TIMESTAMP),
(2, 50, CURRENT_TIMESTAMP),
(3, 30, CURRENT_TIMESTAMP),
(4, 10, CURRENT_TIMESTAMP),
(5, 40, CURRENT_TIMESTAMP),
(6, 20, CURRENT_TIMESTAMP),
(7, 35, CURRENT_TIMESTAMP),
(8, 25, CURRENT_TIMESTAMP),
(9, 45, CURRENT_TIMESTAMP),
(10, 28, CURRENT_TIMESTAMP);
