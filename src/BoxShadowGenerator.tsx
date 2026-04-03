import { useState, useCallback } from 'react'
import { Sun, Moon, Languages, Copy, Check, Plus, Trash2, Layers } from 'lucide-react'

const translations = {
  en: {
    title: 'Box Shadow Generator',
    subtitle: 'Visual CSS box-shadow generator with multiple shadows, live preview and copy CSS.',
    shadows: 'Shadows',
    addShadow: 'Add shadow',
    preview: 'Preview',
    css: 'CSS Output',
    copy: 'Copy',
    copied: 'Copied!',
    offsetX: 'Offset X',
    offsetY: 'Offset Y',
    blur: 'Blur radius',
    spread: 'Spread radius',
    color: 'Color',
    opacity: 'Opacity',
    inset: 'Inset',
    remove: 'Remove',
    previewBg: 'Background',
    previewCard: 'Element color',
    builtBy: 'Built by',
  },
  pt: {
    title: 'Gerador de Box Shadow',
    subtitle: 'Gerador visual de box-shadow CSS com multiplas sombras, previsualizar ao vivo e copiar CSS.',
    shadows: 'Sombras',
    addShadow: 'Adicionar sombra',
    preview: 'Previsualizar',
    css: 'CSS de saida',
    copy: 'Copiar',
    copied: 'Copiado!',
    offsetX: 'Deslocamento X',
    offsetY: 'Deslocamento Y',
    blur: 'Raio de desfoque',
    spread: 'Raio de expansao',
    color: 'Cor',
    opacity: 'Opacidade',
    inset: 'Interno',
    remove: 'Remover',
    previewBg: 'Fundo',
    previewCard: 'Cor do elemento',
    builtBy: 'Criado por',
  }
} as const

type Lang = keyof typeof translations

interface Shadow {
  id: number
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
  enabled: boolean
}

let nextId = 2

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`
}

function shadowToCSS(s: Shadow): string {
  const inset = s.inset ? 'inset ' : ''
  return `${inset}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${hexToRgba(s.color, s.opacity)}`
}

const DEFAULT_SHADOW: Omit<Shadow, 'id'> = {
  offsetX: 0, offsetY: 4, blur: 16, spread: 0, color: '#000000', opacity: 25, inset: false, enabled: true
}

export default function BoxShadowGenerator() {
  const [lang, setLang] = useState<Lang>(() => navigator.language.startsWith('pt') ? 'pt' : 'en')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [shadows, setShadows] = useState<Shadow[]>([{ id: 1, ...DEFAULT_SHADOW }])
  const [selected, setSelected] = useState(1)
  const [previewBg, setPreviewBg] = useState('#f4f4f5')
  const [cardColor, setCardColor] = useState('#ffffff')
  const [copied, setCopied] = useState(false)

  const t = translations[lang]

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', dark)
  }

  const activeShadows = shadows.filter(s => s.enabled)
  const cssValue = activeShadows.map(shadowToCSS).join(',\n  ')
  const cssOutput = `box-shadow: ${cssValue || 'none'};`

  const updateShadow = useCallback((id: number, field: keyof Shadow, value: unknown) => {
    setShadows(ss => ss.map(s => s.id === id ? { ...s, [field]: value } : s))
  }, [])

  const addShadow = () => {
    const id = nextId++
    setShadows(ss => [...ss, { id, ...DEFAULT_SHADOW }])
    setSelected(id)
  }

  const removeShadow = (id: number) => {
    setShadows(ss => {
      const remaining = ss.filter(s => s.id !== id)
      if (selected === id && remaining.length) setSelected(remaining[0].id)
      return remaining
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(cssOutput).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const sel = shadows.find(s => s.id === selected) ?? shadows[0]

  const sliders: { label: string; field: keyof Shadow; min: number; max: number; step?: number }[] = [
    { label: t.offsetX, field: 'offsetX', min: -100, max: 100 },
    { label: t.offsetY, field: 'offsetY', min: -100, max: 100 },
    { label: t.blur, field: 'blur', min: 0, max: 100 },
    { label: t.spread, field: 'spread', min: -50, max: 50 },
    { label: t.opacity, field: 'opacity', min: 0, max: 100 },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Layers size={18} className="text-white" />
            </div>
            <span className="font-semibold">Box Shadow Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/box-shadow-generator" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Left: preview + css */}
            <div className="space-y-4">
              {/* Preview */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="font-semibold text-sm">{t.preview}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs text-zinc-500">{t.previewBg}</label>
                      <input type="color" value={previewBg} onChange={e => setPreviewBg(e.target.value)} className="w-7 h-7 rounded cursor-pointer border border-zinc-200 dark:border-zinc-700" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs text-zinc-500">{t.previewCard}</label>
                      <input type="color" value={cardColor} onChange={e => setCardColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border border-zinc-200 dark:border-zinc-700" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-12" style={{ backgroundColor: previewBg, minHeight: 200 }}>
                  <div className="w-40 h-28 rounded-xl transition-all duration-300" style={{ backgroundColor: cardColor, boxShadow: activeShadows.map(shadowToCSS).join(', ') || 'none' }} />
                </div>
              </div>

              {/* CSS */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{t.css}</span>
                  <button onClick={handleCopy} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    {copied ? t.copied : t.copy}
                  </button>
                </div>
                <pre className="font-mono text-xs bg-zinc-50 dark:bg-zinc-800/50 rounded-lg px-3 py-2 text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap break-all">{cssOutput}</pre>
              </div>
            </div>

            {/* Right: controls */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
              {/* Shadow list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{t.shadows}</span>
                  <button onClick={addShadow} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
                    <Plus size={12} />{t.addShadow}
                  </button>
                </div>
                {shadows.map(s => (
                  <div key={s.id} onClick={() => setSelected(s.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${selected === s.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}>
                    <input type="checkbox" checked={s.enabled} onChange={e => { e.stopPropagation(); updateShadow(s.id, 'enabled', e.target.checked) }}
                      className="accent-indigo-500" onClick={e => e.stopPropagation()} />
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: hexToRgba(s.color, s.opacity) }}></div>
                    <span className="text-xs flex-1 font-mono text-zinc-500 truncate">{shadowToCSS(s)}</span>
                    {shadows.length > 1 && (
                      <button onClick={e => { e.stopPropagation(); removeShadow(s.id) }}
                        className="p-0.5 text-zinc-400 hover:text-red-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Sliders */}
              {sel && (
                <div className="space-y-3 border-t border-zinc-200 dark:border-zinc-700 pt-4">
                  {sliders.map(({ label, field, min, max }) => (
                    <div key={field} className="space-y-1">
                      <div className="flex justify-between">
                        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</label>
                        <span className="text-xs tabular-nums text-zinc-400">{sel[field] as number}{field === 'opacity' ? '%' : 'px'}</span>
                      </div>
                      <input type="range" min={min} max={max} value={sel[field] as number}
                        onChange={e => updateShadow(sel.id, field, Number(e.target.value))}
                        className="w-full accent-indigo-500" />
                    </div>
                  ))}

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{t.color}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={sel.color} onChange={e => updateShadow(sel.id, 'color', e.target.value)}
                        className="w-10 h-9 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer" />
                      <input type="text" value={sel.color} onChange={e => updateShadow(sel.id, 'color', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={sel.inset} onChange={e => updateShadow(sel.id, 'inset', e.target.checked)} className="accent-indigo-500 h-4 w-4" />
                    <span className="text-sm">{t.inset}</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-indigo-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
