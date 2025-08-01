'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Book = {
  id: number
  title: string
  author: string
  status: string
}

export default function HomePage() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndBooks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUserId(user.id)

      const { data: books, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: false })

      if (error) {
        console.error('Error fetching books:', error.message)
      } else {
        setBooks(books || [])
      }

      setLoading(false)
    }

    fetchUserAndBooks()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleDelete = async (bookId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?')
    if (!confirmDelete) return

    const { error } = await supabase.from('books').delete().eq('id', bookId)

    if (error) {
      console.error('Failed to delete book:', error.message)
    } else {
      setBooks((prev) => prev.filter((book) => book.id !== bookId))
    }
  }

  const goToAddBook = () => {
    router.push('/add-book')
  }

  return (
    <div style={{
      backgroundColor: '#f4f4f4',
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '30px',
        width: '100%',
        maxWidth: 800
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: 30 }}>📚 Your Books</h1>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <button
            onClick={goToAddBook}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ➕ Add New Book
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading your books...</p>
        ) : books.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No books yet. Add one!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '10px' }}>Title</th>
                  <th style={{ padding: '10px' }}>Author</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}></th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} style={{ borderTop: '1px solid #ddd' }}>
                    <td style={{ padding: '10px' }}>{book.title}</td>
                    <td style={{ padding: '10px' }}>{book.author}</td>
                    <td style={{ padding: '10px' }}>{book.status}</td>
                    <td style={{ padding: '10px' }}>
                      <button
                        onClick={() => handleDelete(book.id)}
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          padding: '6px 10px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#555',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔒 Logout
          </button>
        </div>
      </div>
    </div>
  )
}
