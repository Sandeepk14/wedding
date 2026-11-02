// Verifies every /assets/... path referenced in src/ exists in public/.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p] })
const refs = new Set()
for (const f of walk('src').filter((f) => /\.(ts|tsx|css)$/.test(f))) {
  for (const m of readFileSync(f, 'utf8').matchAll(/['"`(](\/assets\/[^'"`)\s$]+\.(?:webp|png|jpg|jpeg|svg))/g)) refs.add(m[1])
}
let bad = 0
for (const r of [...refs].sort()) { const ok = existsSync(join('public', r)); if (!ok) bad++; console.log(ok ? 'OK     ' : 'MISSING', r) }
console.log(`\n${refs.size} referenced, ${bad} missing`); process.exit(bad ? 1 : 0)
