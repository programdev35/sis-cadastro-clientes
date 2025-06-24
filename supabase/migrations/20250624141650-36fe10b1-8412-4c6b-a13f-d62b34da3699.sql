
-- Promover o usuário Elissandro Oliveira para admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'resumovetorial@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Remover role de operator se existir para este usuário (para garantir que seja apenas admin)
DELETE FROM public.user_roles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'resumovetorial@gmail.com')
AND role = 'operator';
