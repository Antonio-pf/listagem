-- Supabase Gifts Insert Data
-- Run this AFTER running supabase-setup.sql
-- This script inserts all initial gift items into the database

-- ============================================
-- INSERT INITIAL GIFTS DATA
-- ============================================

INSERT INTO gifts (id, name, description, image, category, price, is_open_value) VALUES
('1', 'Liquidificador', 'Liquidificador potente para preparar vitaminas e receitas', 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=600&fit=crop', 'Cozinha', 250.00, false),
('2', 'Kit Talher', 'Conjunto completo de talheres para 6 pessoas', 'https://images.unsplash.com/photo-1606787620819-8bdf0c44c293?w=800&h=600&fit=crop', 'Cozinha', 180.00, false),
('3', 'Kit Utensílios Cozinha', 'Conjunto de utensílios essenciais para cozinha', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', 'Cozinha', 150.00, false),
('4', 'Cesto de Roupa', 'Cesto organizador para roupas sujas', 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&h=600&fit=crop', 'Quarto', 80.00, false),
('5', 'Cesto de Lixo', 'Lixeira moderna com tampa e pedal', 'https://images.unsplash.com/photo-1625225233840-695456021cde?w=800&h=600&fit=crop', 'Cozinha', 120.00, false),
('6', 'Kit Toalhas', 'Conjunto de 6 toalhas de banho macias', 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&h=600&fit=crop', 'Banheiro', 200.00, false),
('7', 'Panela de Arroz Elétrica', 'Panela elétrica automática para arroz perfeito', 'https://images.unsplash.com/photo-1584990347449-39b9e5d87ddf?w=800&h=600&fit=crop', 'Cozinha', 280.00, false),
('8', 'Toalha de Mesa Redonda', 'Toalha de mesa elegante para ocasiões especiais', 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&h=600&fit=crop', 'Sala', 90.00, false),
('9', 'Jogo de Lençol Casal', 'Jogo de lençol 100% algodão para casal', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop', 'Quarto', 220.00, false),
('10', 'Forma Retangular', 'Forma retangular para assados e bolos', 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=600&fit=crop', 'Cozinha', 60.00, false),
('11', 'Almofadas', 'Kit com 4 almofadas decorativas', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=600&fit=crop', 'Sala', 120.00, false),
('12', 'Abridor de Lata', 'Abridor de lata manual de qualidade', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop', 'Cozinha', 25.00, false),
('13', 'Aspirador de Pó', 'Aspirador de pó potente e silencioso', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&h=600&fit=crop', 'Limpeza', 450.00, false),
('14', 'Jarra de Suco', 'Jarra de vidro com tampa para sucos', 'https://images.unsplash.com/photo-1544145945-35c4e5d68d8c?w=800&h=600&fit=crop', 'Cozinha', 45.00, false),
('15', 'Kit de Potes Vidro', 'Conjunto de potes de vidro para armazenamento', 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&h=600&fit=crop', 'Cozinha', 150.00, false),
('16', 'Luminária', 'Luminária moderna de mesa ou chão', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop', 'Sala', 180.00, false),
('17', 'Rodo Alumínio', 'Rodo de alumínio durável para limpeza', 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=600&fit=crop', 'Limpeza', 40.00, false),
('18', 'Mop', 'Mop giratório com balde para limpeza fácil', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&h=600&fit=crop', 'Limpeza', 130.00, false),
('19', 'Pipoqueira', 'Pipoqueira elétrica para pipoca caseira', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&h=600&fit=crop', 'Cozinha', 95.00, false),
('20', 'Kit Assadeira Pizza', 'Conjunto de assadeiras para pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop', 'Cozinha', 85.00, false),
('21', 'Kit Taças Sobremesa', 'Conjunto de taças elegantes para sobremesa', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=600&fit=crop', 'Cozinha', 110.00, false),
('22', 'Jogo de Piso para Banheiro', 'Conjunto de tapetes antiderrapantes para banheiro', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop', 'Banheiro', 75.00, false),
('23', 'Kit Faca', 'Conjunto completo de facas profissionais para cozinha', 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&h=600&fit=crop', 'Cozinha', 320.00, false),
('24', 'Kit Churrasco', 'Conjunto completo de utensílios para churrasco', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop', 'Cozinha', 280.00, false),
('25', 'Kit Passadeira Cozinha', 'Conjunto de utensílios para passar e organizar a cozinha', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop', 'Cozinha', 190.00, false),
('26', 'Umidificador de Ar', 'Umidificador de ar ultrassônico para ambientes', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop', 'Quarto', 220.00, false),
('27', 'Contribuição: Lar doce lar', 'Sua presença é essencial! Caso deseje nos presentear e não encontre algo na lista, sugerimos uma contribuição de R$ 50,00 via Pix para nos ajudar com os detalhes finais da nossa decoração.', '/gift-box-open-present.jpg', 'Outros', NULL, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFY INSERT
-- ============================================
SELECT 'Data inserted successfully!' as status;
SELECT COUNT(*) as total_gifts FROM gifts;
SELECT category, COUNT(*) as count FROM gifts GROUP BY category ORDER BY count DESC;
