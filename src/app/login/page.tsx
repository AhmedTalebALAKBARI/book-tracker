'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else {
      setError(null)
      router.push('/')
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md text-gray-800 dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md text-gray-800 dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
          >
            Login
          </button>
          {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up →
          </Link>
        </p>
      </div>
    </div>
  )
}
