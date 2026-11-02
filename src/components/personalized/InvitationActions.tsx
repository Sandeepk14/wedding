import { useState, type RefObject } from 'react'
import { Download, Loader2, PencilLine, Share2 } from 'lucide-react'
import { WhatsAppIcon } from '../icons'
import { nativeShare, whatsappShareUrl } from '../../utils/share'
import { downloadFileName, type GuestData } from '../../utils/invitation'

interface Props {
  guest: GuestData
  captureRef: RefObject<HTMLElement>
  onEditNames: () => void
  onNotify: (msg: string) => void
}

const pill = 'inline-flex items-center gap-2 rounded-full border border-gold/80 bg-night/50 px-4 py-2.5 font-body text-xs font-semibold text-ivory backdrop-blur transition hover:-translate-y-0.5 hover:bg-gold/20 disabled:opacity-60'

/** Share (native → WhatsApp fallback), download PNG, change names. */
export function InvitationActions({ guest, captureRef, onEditNames, onNotify }: Props) {
  const [busy, setBusy] = useState(false)
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator

  const download = async () => {
    const node = captureRef.current
    if (!node || busy) return
    setBusy(true)
    try {
      await document.fonts?.ready
      const { toPng } = await import('html-to-image')
      const url = await toPng(node, {
        pixelRatio: 2, cacheBust: true, backgroundColor: '#FFF4E3',
        filter: (n) => !(n instanceof HTMLElement && n.dataset.noExport === 'true'),
      })
      const a = document.createElement('a')
      a.href = url
      a.download = downloadFileName(guest)
      document.body.appendChild(a); a.click(); a.remove()
      onNotify('Invitation downloaded!')
    } catch {
      onNotify('Sorry, the download could not be created. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5" role="group" aria-label="Invitation actions">
      {canShare && <button type="button" className={pill} onClick={() => void nativeShare()}><Share2 className="h-4 w-4 text-gold" aria-hidden /> Share</button>}
      <a className={pill} href={whatsappShareUrl()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> WhatsApp</a>
      <button type="button" className={pill} onClick={() => void download()} disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin text-gold" aria-hidden /> : <Download className="h-4 w-4 text-gold" aria-hidden />} Download
      </button>
      <button type="button" className={pill} onClick={onEditNames}><PencilLine className="h-4 w-4 text-gold" aria-hidden /> Change name</button>
    </div>
  )
}
