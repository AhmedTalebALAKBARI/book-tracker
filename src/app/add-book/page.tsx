'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AddBookPage() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState('reading')
  const router = useRouter()

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      alert('You must be logged in to add a book.')
      router.push('/login')
      return
    }

    const { error: insertError } = await supabase.from('books').insert([
      {
        title,
        author,
        status,
        user_id: user.id
      }
    ])

    if (insertError) {
      alert('Failed to add book: ' + insertError.message)
      return
    }

    router.push('/')
  }

  return (
    <form onSubmit={handleAddBook} style={{ padding: '2rem' }}>
      <h2>Add a New Book</h2>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <br /><br />
      <input
        value={author}
        onChange={e => setAuthor(e.target.value)}
        placeholder="Author"
        required
      />
      <br /><br />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="reading">Reading</option>
        <option value="completed">Completed</option>
        <option value="wishlist">Wishlist</option>
      </select>
      <br /><br />
      <button type="submit">Add Book</button>
    </form>
  )
}
