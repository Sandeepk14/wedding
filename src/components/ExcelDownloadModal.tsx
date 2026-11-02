import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { AlertCircle, Eye, EyeOff, FileSpreadsheet, Lock, X } from 'lucide-react'
import { ADMIN_PASSWORD, exportGuestsToExcel } from '../utils/guestStorage'
import { FloralCorner } from './Ornaments'

interface Props {
  isOpen: boolean
  onClose: () => void
  onNotify: (msg: string) => void
}

export function ExcelDownloadModal({ isOpen, onClose, onNotify }: Props) {
  const reduce = useReducedMotion()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setPassword('')
      setError('')
      setShowPassword(false)
      const t = setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', onKey)
      return () => {
        clearTimeout(t)
        document.body.style.overflow = ''
        document.removeEventListener('keydown', onKey)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Please enter the password.')
      return
    }

    if (password === ADMIN_PASSWORD) {
      setError('')
      const result = exportGuestsToExcel()
      onNotify(`Excel file downloaded (${result.count} guest records)!`)
      onClose()
    } else {
      setError('Incorrect password! Access denied.')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-title"
      className="fixed inset-0 z-[95] flex items-center justify-center bg-night/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md overflow-hidden rounded-[26px] border-2 border-gold p-6 text-center shadow-card sm:p-8"
        style={{
          background: 'radial-gradient(120% 100% at 50% 0%, #FFFBF1 0%, #FFF4E3 55%, #F4E1C6 100%)',
          boxShadow: 'inset 0 0 0 6px #FFF4E3, inset 0 0 0 7.5px rgba(212,175,55,.7), 0 30px 70px -20px rgba(0,0,0,.7)',
        }}
        initial={reduce ? false : { opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <FloralCorner className="pointer-events-none absolute -left-2 -top-2 w-20 sm:w-24" />
        <FloralCorner className="pointer-events-none absolute -right-2 -top-2 w-20 sm:w-24" flip />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full border border-burgundy/40 bg-ivory text-burgundy transition hover:bg-burgundy hover:text-gold"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/80 bg-burgundy/10 text-burgundy shadow-inner">
          <FileSpreadsheet className="h-7 w-7 text-burgundy" strokeWidth={1.8} />
        </div>

        <h3 id="admin-title" className="mt-3 font-script text-3xl font-bold italic text-burgundy sm:text-4xl">
          Download Guest Data
        </h3>

        <div className="mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full border border-gold/70 bg-white/70 px-3 py-1 font-body text-xs font-medium text-burgundy shadow-sm">
          <Lock className="h-3 w-3 text-gold" />
          <span>Password Protected (Admin)</span>
        </div>

        <p className="mx-auto mt-3 max-w-xs font-body text-xs leading-relaxed text-burgundy/80">
          Enter the security password to export and download all guest names, phones, and RSVPs in an Excel file.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-3.5 text-left">
          <div>
            <label htmlFor="admin-pass" className="mb-1 block font-body text-xs font-medium text-burgundy">
              Admin Password
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="admin-pass"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Enter password"
                autoComplete="off"
                className="w-full rounded-xl border border-gold/70 bg-white/90 py-2.5 pl-4 pr-11 font-body text-sm text-burgundy shadow-inner focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-gold/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-2.5 grid h-6 w-6 place-items-center text-burgundy/60 hover:text-burgundy"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <motion.div
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#C4122F]/40 bg-[#C4122F]/10 px-3 py-1.5 font-body text-xs text-[#9B0C25]"
              >
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 rounded-xl border border-burgundy/30 bg-white/70 py-2.5 font-body text-xs font-medium text-burgundy transition hover:bg-burgundy/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-maroon flex-1 !py-2.5 font-royal text-xs uppercase tracking-wider"
            >
              <FileSpreadsheet className="mr-1.5 h-4 w-4" />
              Download Excel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

