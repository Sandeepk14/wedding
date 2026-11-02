import { wedding } from '../config/wedding'

export const inviteUrl = () =>
  (wedding.siteUrl && !wedding.siteUrl.includes('your-domain') ? wedding.siteUrl : window.location.origin) + '/'

export const shareText = () =>
  `You are cordially invited to the wedding celebration of ${wedding.title} – 20 November 2026. ${inviteUrl()}`

export const whatsappShareUrl = () => `https://wa.me/?text=${encodeURIComponent(shareText())}`

export async function copyInviteLink(): Promise<boolean> {
  const url = inviteUrl()
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = url
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

export async function nativeShare(): Promise<boolean> {
  if (!navigator.share) return false
  try {
    await navigator.share({ title: `${wedding.title} – Wedding Invitation`, text: wedding.invitationMessage, url: inviteUrl() })
    return true
  } catch {
    return false
  }
}
