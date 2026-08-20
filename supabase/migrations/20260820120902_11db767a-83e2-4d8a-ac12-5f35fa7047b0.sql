CREATE TABLE public.app_lock (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  salt text NOT NULL,
  pin_hash text,
  password_hash text,
  pin_enabled boolean NOT NULL DEFAULT true,
  password_enabled boolean NOT NULL DEFAULT true,
  title text NOT NULL DEFAULT 'Science Nexus',
  subtitle text,
  logo_url text,
  lock_enabled boolean NOT NULL DEFAULT true,
  session_epoch timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.app_lock TO service_role;

ALTER TABLE public.app_lock ENABLE ROW LEVEL SECURITY;

INSERT INTO public.app_lock (id, salt, pin_hash, password_hash)
VALUES (
  true,
  'nexus-lock-v1',
  '6950842c1171267c2535c5434e2cfdead33c1eb384f5d291977c5b0c04fe5173',
  '85017c60ab290a6468a35f9879255fe77c4be1754c84424941fa54ea7c37d0dc'
);