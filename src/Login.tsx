"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"

interface LoginProps {
  onLogin: (email: string, password: string) => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      onLogin(email, password)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-8 py-16 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[24rem] bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl -z-10"></div>

      <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/25 max-w-4xl min-w-[400px] p-10 relative flex items-center gap-16">
        {/* Izquierda: Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-6 min-w-[280px]">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600 text-base mb-6">Sign in to your account to continue</p>
          </div>

          <div className="space-y-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500/30 focus:ring-2 focus:border-emerald-500 bg-white transition"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-14 py-3 border border-slate-300 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500/30 focus:ring-2 focus:border-emerald-500 bg-white transition"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-2xl font-semibold hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              <>
                Start Session
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Derecha: Links de ayuda */}
        <aside className="w-72 flex flex-col items-center text-center space-y-6 text-slate-600">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative inline-block px-4 bg-white text-slate-500 select-none">
              Need help?
            </div>
          </div>

          <nav className="flex flex-col space-y-4 text-sm w-full">
            <a
              href="#"
              className="block text-emerald-600 hover:text-emerald-700 font-semibold transition-colors hover:underline decoration-2 underline-offset-2"
            >
              Forgot your password?
            </a>
            <div className="text-slate-600">
              {"Don't have an account? "}
              <a
                href="#"
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors hover:underline decoration-2 underline-offset-2"
              >
                Sign up here
              </a>
            </div>
          </nav>
        </aside>
      </section>
    </main>
  )
}

export default Login
