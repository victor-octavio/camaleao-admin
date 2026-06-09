-- ─────────────────────────────────────────
-- AUTH EXTENSION
-- ─────────────────────────────────────────

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('admin', 'volunteer', 'cashier')),
  active bool default true,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- LOOKUP TABLES
-- ─────────────────────────────────────────

create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null,
  bg_color text not null,
  created_at timestamptz default now()
);

create table payment_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  label text not null,
  active bool default true
);

create table banks (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null check (type in ('pix', 'card', 'cash')),
  active bool default true
);

create table item_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null check (type in ('sale', 'donation', 'both')),
  active bool default true
);

create table cash_origins (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active bool default true
);

-- ─────────────────────────────────────────
-- SUPPORTERS
-- ─────────────────────────────────────────

create table supporters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  cpf text unique,
  birthday text,
  created_at timestamptz default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  supporter_id uuid references supporters(id) on delete set null,
  member_since int,
  purchase_count int default 0,
  total_spent numeric default 0,
  last_purchase_at timestamptz,
  created_at timestamptz default now()
);

create table customer_tags (
  customer_id uuid references customers(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (customer_id, tag_id)
);

-- ─────────────────────────────────────────
-- SALES
-- ─────────────────────────────────────────

create table sales (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null default 'Cliente avulso',
  payment_method_id uuid references payment_methods(id),
  bank_id uuid references banks(id),
  installments int check (installments > 0),
  confirmed bool default false,
  registered_by uuid references users(id) on delete set null,
  sold_at timestamptz default now(),
  created_at timestamptz default now()
);

create table sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid references sales(id) on delete cascade,
  category_id uuid references item_categories(id) on delete set null,
  category_name text,
  amount numeric not null check (amount > 0),
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- DONATIONS
-- ─────────────────────────────────────────

create table donations_cash (
  id uuid primary key default gen_random_uuid(),
  supporter_id uuid references supporters(id) on delete set null,
  donor_name text not null,
  donor_phone text,
  amount numeric not null check (amount > 0),
  origin_id uuid references cash_origins(id) on delete set null,
  frequency text not null check (frequency in ('one_time', 'monthly')),
  donated_at timestamptz not null,
  notes text,
  registered_by uuid references users(id) on delete set null,
  created_at timestamptz default now()
);

create table donations_items (
  id uuid primary key default gen_random_uuid(),
  supporter_id uuid references supporters(id) on delete set null,
  donor_name text not null,
  donor_phone text,
  category_id uuid references item_categories(id) on delete set null,
  category_name text,
  quantity int check (quantity > 0),
  condition text check (condition in ('good', 'needs_review')),
  destination text check (destination in ('stock', 'direct')),
  notes text,
  registered_by uuid references users(id) on delete set null,
  donated_at timestamptz not null,
  created_at timestamptz default now()
);

create table donations_caps (
  id uuid primary key default gen_random_uuid(),
  supporter_id uuid references supporters(id) on delete set null,
  donor_name text not null,
  donor_phone text,
  quantity int check (quantity > 0),
  weight_kg numeric check (weight_kg > 0),
  notes text,
  registered_by uuid references users(id) on delete set null,
  donated_at timestamptz not null,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- SEED LOOKUP DATA
-- ─────────────────────────────────────────

insert into tags (name, color, bg_color) values
  ('paciente',   '#D87560', '#F8DCD2'),
  ('familiar',   '#4B3A9B', '#E2DCF3'),
  ('voluntária', '#5C8A6E', '#DCEBE0'),
  ('brechó',     '#C97D3E', '#FBE3CA'),
  ('tampinha',   '#E25A8F', '#FDE7E7');

insert into payment_methods (name, label) values
  ('pix',     'PIX'),
  ('credit',  'Crédito'),
  ('debit',   'Débito'),
  ('cash',    'Dinheiro');

insert into banks (name, type) values
  ('PIX TON',    'pix'),
  ('PIX SICREDI','pix'),
  ('SICREDI',    'card'),
  ('PagSeguro',  'card'),
  ('Stone',      'card');

insert into item_categories (name, type) values
  ('blusa',     'both'),
  ('vestido',   'both'),
  ('calça',     'both'),
  ('saia',      'both'),
  ('jaqueta',   'both'),
  ('sapato',    'both'),
  ('acessório', 'both'),
  ('lenço',     'donation'),
  ('boné',      'donation'),
  ('chapéu',    'donation');

insert into cash_origins (name) values
  ('PIX'),
  ('Dinheiro'),
  ('Transferência'),
  ('Site'),
  ('Outro');
