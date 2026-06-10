'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email:    (formData.get('email')    as string).trim(),
    password: (formData.get('password') as string),
  })

  if (error) {
    return { error: 'E-mail ou senha incorretos.' }
  }

  redirect('/brecho')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
