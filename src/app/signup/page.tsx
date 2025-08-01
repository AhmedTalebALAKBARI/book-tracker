'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      if (error.message.toLowerCase().includes('user already registered')) {
        alert('Account already exists. Redirecting to login...')
        router.push('/login')
      } else {
        setError(error.message)
      }
    } else {
      setError('')
      alert('Signup successful! Check your email for confirmation.')
      router.push('/login')
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Sign Up</h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-gray-800 dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-gray-800 dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
          >
            Signup
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in →
          </Link>
        </p>
      </div>
    </div>
  )
}
