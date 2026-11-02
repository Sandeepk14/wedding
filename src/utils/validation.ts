import { z } from 'zod'
import { wedding } from '../config/wedding'

/** Latin letters, spaces and common name punctuation (apostrophe, hyphen, period). */
export const ENGLISH_NAME = /^[A-Za-z][A-Za-z\s'’.-]*$/
/** Devanagari block (letters, matras, virama, danda) + spaces and common punctuation. */
export const HINDI_NAME = /^[ऀ-ॿ][ऀ-ॿ‌‍\s'’.-]*$/

export const englishNameSchema = z.string().trim()
  .min(1, 'Please enter your name in English')
  .min(2, 'Name is too short')
  .max(60, 'Name is too long (max 60 characters)')
  .regex(ENGLISH_NAME, 'Use English letters only (spaces, - and \' are fine)')

export const hindiNameSchema = z.string().trim()
  .min(1, 'कृपया अपना नाम हिंदी में दर्ज करें')
  .min(2, 'नाम बहुत छोटा है')
  .max(60, 'नाम बहुत लंबा है (अधिकतम 60 अक्षर)')
  .regex(HINDI_NAME, 'कृपया देवनागरी (हिंदी) अक्षरों में लिखें')

export type NameErrors = Partial<Record<'englishName' | 'hindiName', string>>

export function validateNames(v: { englishName: string; hindiName: string }): {
  ok: true
  clean: { englishName: string; hindiName: string }
} | {
  ok: false
  errors: NameErrors
} {
  let en = v.englishName.trim()
  let hi = v.hindiName.trim()

  // Auto-detect script if user typed Hindi in the English field or English in the Hindi field
  if (en && !hi && /[\u0900-\u097F]/.test(en)) {
    hi = en
    en = ''
  } else if (hi && !en && /[A-Za-z]/.test(hi) && !/[\u0900-\u097F]/.test(hi)) {
    en = hi
    hi = ''
  }

  // At least one must be provided
  if (!en && !hi) {
    return {
      ok: false,
      errors: {
        englishName: 'Please enter your name in English or Hindi',
        hindiName: 'कृपया अपना नाम अंग्रेजी या हिंदी में दर्ज करें',
      },
    }
  }

  const errors: NameErrors = {}

  if (en) {
    if (en.length < 2) errors.englishName = 'Name is too short (min 2 letters)'
    else if (en.length > 60) errors.englishName = 'Name is too long (max 60 characters)'
    else if (!ENGLISH_NAME.test(en)) errors.englishName = 'Use English letters only (spaces, - and \' are fine)'
  }

  if (hi) {
    if (hi.length < 2) errors.hindiName = 'नाम बहुत छोटा है (कम से कम 2 अक्षर)'
    else if (hi.length > 60) errors.hindiName = 'नाम बहुत लंबा है (अधिकतम 60 अक्षर)'
    else if (!HINDI_NAME.test(hi)) errors.hindiName = 'कृपया देवनागरी (हिंदी) अक्षरों में लिखें'
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  return { ok: true, clean: { englishName: en, hindiName: hi } }
}

export const rsvpSchema = z.object({
  phone: z.string().trim().refine((v) => /^\+?\d{10,13}$/.test(v.replace(/[\s-]/g, '')), 'Enter a valid phone number (10–13 digits)'),
  guestCount: z.number({ invalid_type_error: 'Select number of guests' }).int().min(0).max(wedding.rsvp.maxGuests),
  attendance: z.enum(['accept', 'decline'], { required_error: 'Please choose one', invalid_type_error: 'Please choose one' }),
  message: z.string().trim().max(300, 'Please keep it under 300 characters').optional(),
}).superRefine((v, ctx) => {
  if (v.attendance === 'accept' && v.guestCount < 1) ctx.addIssue({ code: 'custom', path: ['guestCount'], message: 'Select at least 1 guest' })
})
export type RsvpValues = z.infer<typeof rsvpSchema>
