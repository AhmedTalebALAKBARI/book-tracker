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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const res = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        author,
        status
      })
    })

    if (!res.ok) {
      const { error } = await res.json()
      alert('Error adding book: ' + error)
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
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
      >
        <option value="reading">Reading</option>
        <option value="completed">Completed</option>
        <option value="wishlist">Wishlist</option>
      </select>
      <br /><br />
      <button type="submit">Add Book</button>
    </form>
  )
}
