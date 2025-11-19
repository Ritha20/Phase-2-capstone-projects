create extension if not exists "uuid-ossp";

create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  password text not null,
  name text,
  username text unique,
  bio text,
  avatar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  excerpt text,
  slug text not null unique,
  published boolean not null default false,
  image text,
  tags text[] not null default '{}'::text[],
  author_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists posts_tags_idx on public.posts using gin(tags);
create index if not exists posts_author_idx on public.posts(author_id);

create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  content text not null,
  author_id uuid not null references public.users(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.likes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);

create table if not exists public.follows (
  id uuid primary key default uuid_generate_v4(),
  follower_id uuid not null references public.users(id) on delete cascade,
  following_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_id, following_id)
);

