
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, password, nome, role } = await req.json()

    console.log('Creating user:', { email, nome, role })

    // Create user using admin client (this won't affect current session)
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { nome },
      email_confirm: true // Auto-confirm email to avoid confirmation flow
    })

    if (createError) {
      console.error('Error creating user:', createError)
      
      // Handle specific error messages
      let errorMessage = 'Erro ao criar usuário'
      if (createError.message.includes('already registered')) {
        errorMessage = 'Este email já está cadastrado'
      } else if (createError.message.includes('Password')) {
        errorMessage = 'Senha deve ter pelo menos 6 caracteres'
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!userData.user) {
      return new Response(
        JSON.stringify({ error: 'Falha ao criar usuário' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('User created successfully:', userData.user.id)

    // Insert into profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userData.user.id,
        email: email,
        nome: nome
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Continue even if profile creation fails - user still created
    }

    // Set user role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: role
      })

    if (roleError) {
      console.error('Error setting user role:', roleError)
      return new Response(
        JSON.stringify({ error: 'Usuário criado mas erro ao definir permissões' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('User role set successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: {
          id: userData.user.id,
          email: userData.user.email,
          nome: nome,
          role: role
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
