-- Create a function that returns current user and role information
CREATE OR REPLACE FUNCTION public.whoami()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN jsonb_build_object(
    'user_id', auth.uid(),
    'user_email', current_setting('request.jwt.claims', true)::jsonb->>'email',
    'role', current_setting('request.jwt.claims', true)::jsonb->>'role',
    'is_authenticated', (auth.uid() IS NOT NULL)
  );
END;
$$;

-- Grant execute permission to everyone
ALTER FUNCTION public.whoami() SECURITY DEFINER;
REVOKE ALL ON FUNCTION public.whoami() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.whoami() TO PUBLIC;

COMMENT ON FUNCTION public.whoami IS 'Returns information about the current user, including ID, email, role, and authentication status';
