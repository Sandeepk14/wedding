import { useEffect, useState } from 'react'

export interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

function compute(target: number): CountdownState {
  const diff = target - Date.now() // absolute instants → timezone safe
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  const s = Math.floor(diff / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: false,
  }
}

/** Live countdown to an ISO timestamp that carries an explicit offset (e.g. +05:30 for IST). */
export function useCountdown(targetIso: string): CountdownState {
  const target = new Date(targetIso).getTime()
  const [state, setState] = useState(() => compute(target))

  useEffect(() => {
    setState(compute(target))
    const id = window.setInterval(() => {
      const next = compute(target)
      setState(next)
      if (next.done) window.clearInterval(id) // stop at zero, never negative
    }, 1000)
    return () => window.clearInterval(id)
  }, [target])

  return state
}
