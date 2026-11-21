-- THE WEARS ON — notify page/mark for T=0 cards.
-- SQL Editor, once. No BEGIN / COMMIT. No DROP. Re-run safe.
-- Lets the public worker mail everyone already on drop_notify_emails.

CREATE OR REPLACE FUNCTION public.wears_drop_notify_page(
  p_pack text,
  p_after text DEFAULT '',
  p_limit integer DEFAULT 40,
  p_key text DEFAULT ''
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pack text := lower(trim(p_pack));
  after_email text := lower(trim(coalesce(p_after, '')));
  n_lim int := greatest(1, least(coalesce(p_limit, 40), 40));
  emails text[] := '{}';
  n int := 0;
  sent text[] := '{}';
  wave jsonb;
BEGIN
  IF coalesce(p_key, '') IS DISTINCT FROM 'wears-on-drop-fire-2026' THEN
    RAISE EXCEPTION 'bad key';
  END IF;
  IF pack !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RAISE EXCEPTION 'bad pack';
  END IF;
  SELECT count(*) INTO n FROM public.drop_notify_emails WHERE pack_id = pack;
  SELECT coalesce(array_agg(x.email ORDER BY x.email), '{}')
  INTO emails
  FROM (
    SELECT e.email
    FROM public.drop_notify_emails e
    WHERE e.pack_id = pack
      AND (after_email = '' OR e.email > after_email)
    ORDER BY e.email
    LIMIT n_lim
  ) x;
  SELECT coalesce(s.sent_store_ids, '{}'), s.wave
  INTO sent, wave
  FROM public.drop_notify_state s
  WHERE s.pack_id = pack;
  RETURN jsonb_build_object(
    'ok', true,
    'emails', to_jsonb(emails),
    'n', n,
    'sent_store_ids', to_jsonb(coalesce(sent, '{}'::text[])),
    'wave', wave
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.wears_drop_notify_touch(
  p_pack text,
  p_key text,
  p_add_store text DEFAULT NULL,
  p_wave jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pack text := lower(trim(p_pack));
  store text := lower(trim(coalesce(p_add_store, '')));
  sent text[] := '{}';
  cur_wave jsonb;
  next_wave jsonb;
BEGIN
  IF coalesce(p_key, '') IS DISTINCT FROM 'wears-on-drop-fire-2026' THEN
    RAISE EXCEPTION 'bad key';
  END IF;
  IF pack !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RAISE EXCEPTION 'bad pack';
  END IF;
  INSERT INTO public.drop_notify_state (pack_id, sent_store_ids, lock_done, wave, updated_at)
  VALUES (pack, '{}', false, NULL, now())
  ON CONFLICT (pack_id) DO NOTHING;
  SELECT coalesce(s.sent_store_ids, '{}'), s.wave
  INTO sent, cur_wave
  FROM public.drop_notify_state s
  WHERE s.pack_id = pack;
  next_wave := cur_wave;
  IF store ~ '^[a-z0-9]{1,24}$' AND NOT (store = ANY (sent)) THEN
    sent := array_append(sent, store);
    next_wave := NULL;
  ELSIF p_wave IS NOT NULL THEN
    next_wave := p_wave;
  END IF;
  UPDATE public.drop_notify_state AS s
  SET
    sent_store_ids = sent,
    lock_done = coalesce(s.lock_done, false),
    wave = next_wave,
    updated_at = now()
  WHERE s.pack_id = pack;
  RETURN jsonb_build_object('ok', true, 'sent_store_ids', to_jsonb(sent));
END;
$$;

REVOKE ALL ON FUNCTION public.wears_drop_notify_page(text, text, integer, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.wears_drop_notify_touch(text, text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.wears_drop_notify_page(text, text, integer, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.wears_drop_notify_touch(text, text, text, jsonb) TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';
