/**
 * Client-side guest records storage & Excel export.
 * Persists all guest popup inputs and RSVPs in localStorage without requiring a backend.
 */

export interface GuestRecord {
  id: string
  englishName: string
  hindiName: string
  phone: string
  attending: string // 'Yes' | 'No' | 'Pending'
  guestCount: number
  message: string
  source: 'popup' | 'rsvp-form'
  submittedAt: string
}

const STORAGE_KEY = 'pradeep_archana_guest_records'
export const ADMIN_PASSWORD = '9140238240'

/** Read all recorded submissions from localStorage. Never throws. */
export function getGuestRecords(): GuestRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Save updated records list to localStorage. */
function saveRecords(records: GuestRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch {
    /* storage quota or blocked */
  }
}

/** Format current date & time nicely (e.g. "02 Nov 2026, 06:15 PM"). */
function formatTimestamp(d = new Date()): string {
  try {
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return d.toISOString()
  }
}

/** Record or update popup name submission. */
export function recordPopupSubmission(names: { englishName: string; hindiName: string }): GuestRecord {
  const records = getGuestRecords()
  const en = names.englishName.trim()
  const hi = names.hindiName.trim()

  const newRecord: GuestRecord = {
    id: `guest_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    englishName: en,
    hindiName: hi,
    phone: '',
    attending: 'Pending',
    guestCount: 1,
    message: '',
    source: 'popup',
    submittedAt: formatTimestamp(),
  }

  try {
    sessionStorage.setItem('current_active_guest_record_id', newRecord.id)
  } catch {
    /* ignore */
  }

  records.unshift(newRecord)
  saveRecords(records)
  return newRecord
}

/** Record or update an RSVP submission (from popup or RSVP section). */
export function recordRsvpSubmission(data: {
  name?: string
  nameHindi?: string
  phone: string
  attending: 'yes' | 'no'
  guests: number
  message?: string
}) {
  const records = getGuestRecords()
  const name = (data.name ?? '').trim()
  const nameHindi = (data.nameHindi ?? '').trim()
  const attendingLabel = data.attending === 'yes' ? 'Yes (Attending)' : 'No (Declined)'

  // Check if there is an active record ID from the current popup submission
  let activeId: string | null = null
  try {
    activeId = sessionStorage.getItem('current_active_guest_record_id')
  } catch {
    /* ignore */
  }

  let existingIdx = -1
  if (activeId) {
    existingIdx = records.findIndex((r) => r.id === activeId)
  }

  if (existingIdx < 0) {
    existingIdx = records.findIndex(
      (r) =>
        (data.phone && r.phone && r.phone.replace(/\D/g, '') === data.phone.replace(/\D/g, '')) ||
        (name && r.englishName.toLowerCase() === name.toLowerCase()) ||
        (nameHindi && r.hindiName === nameHindi)
    )
  }

  if (existingIdx >= 0) {
    records[existingIdx] = {
      ...records[existingIdx],
      englishName: records[existingIdx].englishName || name,
      hindiName: records[existingIdx].hindiName || nameHindi,
      phone: data.phone,
      attending: attendingLabel,
      guestCount: data.guests,
      message: data.message || records[existingIdx].message,
      submittedAt: formatTimestamp(),
    }
    saveRecords(records)
    return
  }

  const newRecord: GuestRecord = {
    id: `rsvp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    englishName: name,
    hindiName: nameHindi,
    phone: data.phone,
    attending: attendingLabel,
    guestCount: data.guests,
    message: data.message || '',
    source: 'rsvp-form',
    submittedAt: formatTimestamp(),
  }

  records.unshift(newRecord)
  saveRecords(records)
}

/** Helper to escape quotes and commas for Excel CSV format. */
function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return '""'
  const str = String(val).replace(/"/g, '""')
  return `"${str}"`
}

/**
 * Generates and triggers download of the guest records as an Excel-compatible CSV file.
 * Includes UTF-8 BOM (\uFEFF) so Microsoft Excel natively displays Devanagari Hindi text correctly.
 */
export function exportGuestsToExcel(): { success: boolean; count: number } {
  let records = getGuestRecords()

  // If localStorage is empty, check sessionStorage to include current active session guest
  if (records.length === 0) {
    try {
      const s = JSON.parse(sessionStorage.getItem('pradeep_archana_guest_invitation') ?? '{}')
      if (s.englishName || s.hindiName) {
        records = [
          {
            id: 'session_1',
            englishName: s.englishName ?? '',
            hindiName: s.hindiName ?? '',
            phone: '',
            attending: 'Pending',
            guestCount: 1,
            message: '',
            source: 'popup',
            submittedAt: formatTimestamp(),
          },
        ]
      }
    } catch {
      /* ignore */
    }
  }

  const headers = [
    'S.No',
    'Guest Name (English)',
    'Guest Name (Hindi / हिंदी)',
    'Phone Number',
    'Attendance Status',
    'Total Guests',
    'Blessings & Wishes',
    'Submission Type',
    'Date & Time',
  ]

  const rows: string[] = []
  rows.push(headers.map(escapeCsv).join(','))

  if (records.length === 0) {
    // Add a placeholder guidance row so the file opens cleanly with instructions
    rows.push(
      [
        '1',
        'No guest submissions yet',
        'अभी तक कोई प्रविष्टि नहीं',
        '-',
        '-',
        '0',
        'Guest data entered in the popup will appear here automatically',
        '-',
        formatTimestamp(),
      ]
        .map(escapeCsv)
        .join(',')
    )
  } else {
    records.forEach((r, idx) => {
      rows.push(
        [
          idx + 1,
          r.englishName || '-',
          r.hindiName || '-',
          r.phone || '-',
          r.attending || 'Pending',
          r.guestCount ?? 1,
          r.message || '-',
          r.source === 'popup' ? 'Popup Invitation' : 'RSVP Form',
          r.submittedAt,
        ]
          .map(escapeCsv)
          .join(',')
      )
    })
  }

  const csvContent = rows.join('\r\n')
  // UTF-8 BOM ensures Excel on Windows opens Hindi Devanagari characters accurately
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  const dateStr = new Date().toISOString().slice(0, 10)
  a.download = `Wedding-Guest-List-Pradeep-Archana-${dateStr}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  return { success: true, count: records.length }
}

