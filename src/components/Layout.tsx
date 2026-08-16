import { useMemo } from 'react'
import { Info, Search } from 'lucide-react'
import { Link, Outlet, useSearchParams } from 'react-router-dom'
import { useQuarterArchive } from '@/lib/useQuarterArchive'
import { useLanguage } from '../context/useLanguage'

export default function Layout() {
  const { language, toggleLanguage, lang } = useLanguage()
  const {
    quarters,
    selectedQuarterId,
    setSelectedQuarter,
  } = useQuarterArchive()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') ?? ''

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(quarters.map((q) => q.id.split('-')[0]))).filter(Boolean)
    return years.sort((a, b) => b.localeCompare(a))
  }, [quarters])

  const currentParsed = useMemo(() => {
    const activeQuarter = quarters.find((q) => q.id === selectedQuarterId) || quarters[0]
    if (activeQuarter) {
      const [year, quarter] = activeQuarter.id.split('-')
      return { year: year || '', quarter: quarter || '' }
    }
    return { year: '', quarter: '' }
  }, [quarters, selectedQuarterId])

  const availableQuartersForYear = useMemo(() => {
    if (!currentParsed.year) return []
    return quarters
      .filter((q) => q.id.startsWith(`${currentParsed.year}-`))
      .map((q) => {
        const quarterPart = q.id.split('-')[1] || q.id
        return {
          ...q,
          quarterPart,
        }
      })
  }, [quarters, currentParsed.year])

  const handleYearChange = (newYear: string) => {
    const yearQuarters = quarters.filter((q) => q.id.startsWith(`${newYear}-`))
    if (yearQuarters.length === 0) return

    const sameQuarterMatch = yearQuarters.find((q) => q.id.split('-')[1] === currentParsed.quarter)
    const targetQuarter = sameQuarterMatch || yearQuarters[0]
    setSelectedQuarter(targetQuarter.id)
  }

  const handleQuarterChange = (newQuarterPart: string) => {
    const targetQuarter = quarters.find((q) => q.id === `${currentParsed.year}-${newQuarterPart}`)
    if (targetQuarter) {
      setSelectedQuarter(targetQuarter.id)
    }
  }

  const updateSearchQuery = (query: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (query.trim()) {
      nextParams.set('q', query)
    } else {
      nextParams.delete('q')
    }
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold shadow-soft">
                  13F
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-purple">
                  {lang.appTitle}
                </span>
              </Link>

              <div className="relative hidden md:block w-96 ml-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-text-secondary" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => updateSearchQuery(event.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-full bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all"
                  placeholder={lang.searchPlaceholder}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {quarters.length > 0 && (
                <div className="hidden lg:flex items-center gap-1.5 bg-background/60 p-1 border border-border rounded-full shadow-xs text-xs font-semibold text-text-secondary">
                  <div className="flex items-center gap-1.5 pl-2.5">
                    <span className="text-[11px] font-medium text-text-secondary">{lang.selectYear}</span>
                    <select
                      value={currentParsed.year}
                      onChange={(event) => handleYearChange(event.target.value)}
                      className="appearance-none rounded-full border border-border bg-white px-2.5 py-1 text-xs font-bold text-text-primary shadow-xs outline-none transition-colors hover:border-accent-blue focus:ring-2 focus:ring-accent-blue/30 cursor-pointer"
                      aria-label={lang.selectYear}
                    >
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}{language === 'zh' ? '年' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="h-4 w-px bg-border/80" />

                  <div className="flex items-center gap-1.5 pr-1">
                    <span className="text-[11px] font-medium text-text-secondary">{lang.selectQuarter}</span>
                    <select
                      value={currentParsed.quarter}
                      onChange={(event) => handleQuarterChange(event.target.value)}
                      className="appearance-none rounded-full border border-border bg-white px-2.5 py-1 text-xs font-bold text-text-primary shadow-xs outline-none transition-colors hover:border-accent-blue focus:ring-2 focus:ring-accent-blue/30 cursor-pointer"
                      aria-label={lang.selectQuarter}
                    >
                      {availableQuartersForYear.map((q) => (
                        <option key={q.id} value={q.quarterPart}>
                          {q.quarterPart}{q.isLatest ? ` (${lang.latestSnapshot})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                onClick={toggleLanguage}
                className="flex items-center bg-background/50 border border-border rounded-full p-1 cursor-pointer transition-colors hover:bg-white w-[72px] relative shadow-sm"
              >
                <div className="flex w-full justify-between px-1.5 text-[10px] font-bold z-10 text-text-secondary select-none">
                  <span className={language === 'en' ? 'text-accent-blue' : ''}>EN</span>
                  <span className={language === 'zh' ? 'text-accent-blue' : ''}>中文</span>
                </div>
                <div
                  className={`absolute top-1 bottom-1 w-8 bg-white rounded-full shadow-sm border border-border transition-transform duration-300 ${language === 'zh' ? 'translate-x-[34px]' : 'translate-x-0'}`}
                />
              </button>

              <div className="hidden sm:flex items-center px-3 py-1.5 bg-accent-blue/10 text-accent-blue rounded-full text-sm font-medium border border-accent-blue/20">
                <Info className="w-4 h-4 mr-2" />
                {lang.institutionsAvailable}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-white mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 py-6 text-center text-sm text-text-secondary">
          {lang.dataDisclaimer}
        </div>
      </footer>
    </div>
  )
}
