-- seed categories
INSERT INTO categories (id, name, description, icon, product_count) VALUES (1, 'Electrónicos', 'Dispositivos y gadgets tecnológicos', '📱', 0);
INSERT INTO categories (id, name, description, icon, product_count) VALUES (2, 'Ropa', 'Vestimenta para todas las ocasiones', '👕', 0);
INSERT INTO categories (id, name, description, icon, product_count) VALUES (3, 'Deportes', 'Artículos deportivos y de fitness', '⚽', 0);
INSERT INTO categories (id, name, description, icon, product_count) VALUES (4, 'Libros', 'Literatura y libros educativos', '📚', 0);
INSERT INTO categories (id, name, description, icon, product_count) VALUES (5, 'Belleza', 'Productos de cuidado personal', '💄', 0);
INSERT INTO categories (id, name, description, icon, product_count) VALUES (6, 'Accesorios', 'Complementos y accesorios diversos', '🎒', 0);

-- seed products
INSERT INTO products (id, name, price, category, description, image, stock, created_at, user_id) VALUES (1, 'Auriculares Bluetooth Sony', 89999, 'Electrónicos', 'Auriculares inalámbricos con cancelación de ruido', 'https://picsum.photos/seed/auriculares/300/300', 15, '2025-01-05 10:15:00', NULL);
INSERT INTO products (id, name, price, category, description, image, stock, created_at, user_id) VALUES(2, 'Camiseta Deportiva Nike', 25999, 'Ropa', 'Camiseta deportiva de alta calidad para entrenar', 'https://picsum.photos/id/358/800/600', 30, '2025-01-08 14:30:00', NULL);
INSERT INTO products (id, name, price, category, description, image, stock, created_at, user_id) VALUES(3, 'Libro: JavaScript Avanzado', 15999, 'Libros', 'Guía completa para dominar JavaScript moderno', 'https://picsum.photos/id/250/800/600', 8, '2025-01-12 09:00:00', NULL);
INSERT INTO products (id, name, price, category, description, image, stock, created_at, user_id) VALUES(4, 'Botella de Agua Deportiva', 8999, 'Deportes', 'Botella térmica de acero inoxidable 750ml', 'https://picsum.photos/id/325/800/600', 25, '2025-01-15 16:45:00', NULL);
INSERT INTO products (id, name, price, category, description, image, stock, created_at, user_id) VALUES(5, 'Mouse Gaming Logitech', 45999, 'Electrónicos', 'Mouse gaming con sensor de alta precisión', 'https://picsum.photos/id/146/800/600', 12, '2025-01-18 11:20:00', NULL);
INSERT INTO products (id, name, price, category, description, image, stock, created_at, user_id) VALUES(6, 'Zapatillas Running Adidas', 79999, 'Deportes', 'Zapatillas para running con tecnología Boost', 'https://picsum.photos/id/300/800/600', 18, '2025-01-20 13:10:00', NULL);
INSERT INTO products (id, name, price, category, description, image, stock, created_at, user_id) VALUES(7, 'Crema Hidratante Facial', 12999, 'Belleza', 'Crema hidratante con ácido hialurónico', 'https://picsum.photos/id/450/800/600', 20, '2025-01-25 08:05:00', NULL);
INSERT INTO products (id, name, price, category, description, image, stock, created_at, user_id) VALUES(8, 'Mochila para Laptop', 35999, 'Accesorios', 'Mochila resistente al agua para laptop hasta 15.6"', 'https://picsum.photos/id/201/800/600', 10, '2025-01-28 17:55:00', NULL);
