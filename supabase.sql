create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellidos text not null,
  direccion text not null,
  codigo_postal text not null,
  telefono text not null,
  email text not null unique,
  accepted_privacy boolean not null default false,
  verification_token text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
