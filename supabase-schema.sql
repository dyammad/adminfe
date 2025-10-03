-- ========================================
-- SCHEMA DO BANCO DE DADOS - SUPABASE
-- Sistema de Gestão Eclesiástica Multi-Filiais
-- ========================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. TABELA DE FILIAIS
-- ========================================

CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_branches_city ON branches(city);
CREATE INDEX idx_branches_state ON branches(state);

-- ========================================
-- 2. TABELA DE USUÁRIOS
-- ========================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  birthdate DATE,
  branch_id UUID REFERENCES branches(id),
  role TEXT NOT NULL DEFAULT 'member', -- 'super_admin', 'branch_admin', 'member'
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_branch ON users(branch_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- ========================================
-- 3. TABELA DE MEMBROS
-- ========================================

CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES branches(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birthdate DATE,
  address TEXT,
  cell TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'inactive'
  joined_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_members_branch ON members(branch_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_cell ON members(cell);

-- ========================================
-- 4. TABELA DE MINISTÉRIOS
-- ========================================

CREATE TABLE ministries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  leader TEXT NOT NULL,
  leader_phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ministries_branch ON ministries(branch_id);

-- ========================================
-- 5. TABELA DE CÉLULAS
-- ========================================

CREATE TABLE cells (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  name TEXT NOT NULL,
  leader TEXT NOT NULL,
  address TEXT,
  day_of_week TEXT,
  time TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cells_branch ON cells(branch_id);

-- ========================================
-- 6. TABELA DE EVENTOS
-- ========================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_branch ON events(branch_id);
CREATE INDEX idx_events_date ON events(date);

-- ========================================
-- 7. TABELA DE DOAÇÕES
-- ========================================

CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  donor TEXT NOT NULL,
  type TEXT NOT NULL, -- 'tithe', 'offering', 'special'
  amount DECIMAL(10,2) NOT NULL,
  method TEXT,
  date DATE NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_donations_branch ON donations(branch_id);
CREATE INDEX idx_donations_date ON donations(date);
CREATE INDEX idx_donations_type ON donations(type);

-- ========================================
-- 8. TABELA DE BATISMOS
-- ========================================

CREATE TABLE baptisms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  baptism_date DATE,
  pastor TEXT,
  location TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'scheduled', 'completed'
  request_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_baptisms_branch ON baptisms(branch_id);
CREATE INDEX idx_baptisms_status ON baptisms(status);

-- ========================================
-- 9. TABELA DE PEDIDOS DE ORAÇÃO
-- ========================================

CREATE TABLE prayer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  requester TEXT NOT NULL,
  request TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'answered'
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_prayer_branch ON prayer_requests(branch_id);
CREATE INDEX idx_prayer_status ON prayer_requests(status);

-- ========================================
-- 10. TABELA DE AGENDA DO PASTOR
-- ========================================

CREATE TABLE agenda (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agenda_branch ON agenda(branch_id);
CREATE INDEX idx_agenda_date ON agenda(date);

-- ========================================
-- 11. TABELA DE LÍDERES
-- ========================================

CREATE TABLE leaders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leaders_branch ON leaders(branch_id);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cells ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE baptisms ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaders ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLÍTICAS DE SEGURANÇA - MEMBERS
-- ========================================

-- Super admins veem tudo
CREATE POLICY "Super admins see all members"
ON members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- Usuários veem apenas sua filial
CREATE POLICY "Users see only their branch members"
ON members FOR SELECT
USING (
  branch_id = (
    SELECT branch_id FROM users WHERE id = auth.uid()
  )
);

-- Admins podem inserir
CREATE POLICY "Admins can insert members"
ON members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'branch_admin')
  )
);

-- Admins podem atualizar
CREATE POLICY "Admins can update members"
ON members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'branch_admin')
  )
);

-- ========================================
-- POLÍTICAS DE SEGURANÇA - DONATIONS
-- ========================================

-- Admins veem doações
CREATE POLICY "Admins see donations"
ON donations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'branch_admin')
  )
);

-- Todos podem inserir doações
CREATE POLICY "Anyone can insert donations"
ON donations FOR INSERT
WITH CHECK (
  branch_id = (
    SELECT branch_id FROM users WHERE id = auth.uid()
  )
);

-- ========================================
-- POLÍTICAS DE SEGURANÇA - EVENTS
-- ========================================

-- Todos veem eventos da sua filial
CREATE POLICY "Users see branch events"
ON events FOR SELECT
USING (
  branch_id = (
    SELECT branch_id FROM users WHERE id = auth.uid()
  )
);

-- Admins podem criar eventos
CREATE POLICY "Admins can create events"
ON events FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'branch_admin')
  )
);

-- Admins podem atualizar eventos
CREATE POLICY "Admins can update events"
ON events FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'branch_admin')
  )
);

-- ========================================
-- POLÍTICAS DE SEGURANÇA - PRAYER REQUESTS
-- ========================================

-- Todos veem pedidos da sua filial
CREATE POLICY "Users see branch prayers"
ON prayer_requests FOR SELECT
USING (
  branch_id = (
    SELECT branch_id FROM users WHERE id = auth.uid()
  )
);

-- Todos podem criar pedidos
CREATE POLICY "Anyone can create prayers"
ON prayer_requests FOR INSERT
WITH CHECK (
  branch_id = (
    SELECT branch_id FROM users WHERE id = auth.uid()
  )
);

-- Admins podem atualizar pedidos
CREATE POLICY "Admins can update prayers"
ON prayer_requests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'branch_admin')
  )
);

-- ========================================
-- FUNÇÕES AUXILIARES
-- ========================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ministries_updated_at BEFORE UPDATE ON ministries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cells_updated_at BEFORE UPDATE ON cells
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_baptisms_updated_at BEFORE UPDATE ON baptisms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON prayer_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agenda_updated_at BEFORE UPDATE ON agenda
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VIEWS ÚTEIS
-- ========================================

-- View de estatísticas por filial
CREATE OR REPLACE VIEW branch_stats AS
SELECT 
    b.id as branch_id,
    b.name as branch_name,
    COUNT(DISTINCT m.id) as total_members,
    COUNT(DISTINCT e.id) as total_events,
    COALESCE(SUM(d.amount), 0) as total_donations
FROM branches b
LEFT JOIN members m ON b.id = m.branch_id AND m.status = 'active'
LEFT JOIN events e ON b.id = e.branch_id
LEFT JOIN donations d ON b.id = d.branch_id
GROUP BY b.id, b.name;

-- ========================================
-- DADOS INICIAIS (OPCIONAL)
-- ========================================

-- Inserir filial de exemplo
INSERT INTO branches (name, city, state, address, phone, email) VALUES
('Filial Principal', 'São Paulo', 'SP', 'Rua Principal, 123', '(11) 1234-5678', 'contato@igreja.com');

-- ========================================
-- FIM DO SCHEMA
-- ========================================
