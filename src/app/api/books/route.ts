import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies as getCookies } from 'next/headers'

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies: getCookies })

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: books, error: bookError } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', user.id)

  if (bookError) {
    return NextResponse.json({ error: bookError.message }, { status: 500 })
  }

  return NextResponse.json(books)
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies: getCookies })
  const body = await req.json()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, author, status } = body

  if (!title || !author || !status) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { error: insertError } = await supabase.from('books').insert([
    {
      user_id: user.id,
      title,
      author,
      status,
    },
  ])

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Book added successfully' }, { status: 201 })
}
