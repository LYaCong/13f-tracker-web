import { useMemo } from 'react'
import { Flame, Info, LayoutGrid, Search, Sparkles } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useQuarterArchive } from '@/lib/useQuarterArchive'
import { useLanguage } from '../context/useLanguage'

export default function Layout() {
  const { language, toggleLanguage, lang } = useLanguage()
  const location = useLocation()
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
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold shadow-soft">
                  13F
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-purple hidden sm:inline">
                  {lang.appTitle}
                </span>
              </Link>

              {/* Navigation Links */}
              <nav className="flex items-center gap-1 bg-background/60 p-1 border border-border rounded-xl text-xs font-bold">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      isActive && location.pathname === '/'
                        ? 'bg-white text-accent-blue shadow-2xs font-black'
                        : 'text-text-secondary hover:text-text-primary'
                    }`
                  }
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  {lang.dashboardNav}
                </NavLink>

                <NavLink
                  to="/consensus"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-accent-orange to-accent-red text-white shadow-2xs font-black'
                        : 'text-text-secondary hover:text-text-primary'
                    }`
                  }
                >
                  <Flame className="w-3.5 h-3.5" />
                  {lang.consensusNav}
                </NavLink>

                <NavLink
                  to="/all-star"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-accent-purple to-accent-blue text-white shadow-2xs font-black'
                        : 'text-text-secondary hover:text-text-primary'
                    }`
                  }
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {lang.allStarNav}
                </NavLink>
              </nav>

              {/* Search Bar */}
              <div className="relative hidden xl:block w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-text-secondary" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => updateSearchQuery(event.target.value)}
                  className="block w-full pl-9 pr-3 py-1.5 border border-border rounded-full bg-background/50 text-xs focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all"
                  placeholder={lang.searchPlaceholder}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {quarters.length > 0 && (
                <div className="flex items-center gap-1.5 bg-background/60 p-1 border border-border rounded-full shadow-xs text-xs font-semibold text-text-secondary">
                  <div className="flex items-center gap-1.5 pl-2">
                    <span className="text-[11px] font-medium text-text-secondary hidden sm:inline">{lang.selectYear}</span>
                    <select
                      value={currentParsed.year}
                      onChange={(event) => handleYearChange(event.target.value)}
                      className="appearance-none rounded-full border border-border bg-white px-2 py-1 text-xs font-bold text-text-primary shadow-xs outline-none transition-colors hover:border-accent-blue focus:ring-2 focus:ring-accent-blue/30 cursor-pointer"
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
                    <span className="text-[11px] font-medium text-text-secondary hidden sm:inline">{lang.selectQuarter}</span>
                    <select
                      value={currentParsed.quarter}
                      onChange={(event) => handleQuarterChange(event.target.value)}
                      className="appearance-none rounded-full border border-border bg-white px-2 py-1 text-xs font-bold text-text-primary shadow-xs outline-none transition-colors hover:border-accent-blue focus:ring-2 focus:ring-accent-blue/30 cursor-pointer"
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
                className="flex items-center bg-background/50 border border-border rounded-full p-1 cursor-pointer transition-colors hover:bg-white w-[68px] relative shadow-xs"
              >
                <div className="flex w-full justify-between px-1.5 text-[10px] font-bold z-10 text-text-secondary select-none">
                  <span className={language === 'en' ? 'text-accent-blue font-black' : ''}>EN</span>
                  <span className={language === 'zh' ? 'text-accent-blue font-black' : ''}>中文</span>
                </div>
                <div
                  className={`absolute top-1 bottom-1 w-7 bg-white rounded-full shadow-sm border border-border transition-transform duration-300 ${language === 'zh' ? 'translate-x-[32px]' : 'translate-x-0'}`}
                />
              </button>

              <div className="hidden 2xl:flex items-center px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-bold border border-accent-blue/20">
                <Info className="w-3.5 h-3.5 mr-1.5" />
                {lang.institutionsAvailable}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-border mt-auto py-6 text-center text-xs text-text-secondary">
        <p>{lang.dataDisclaimer}</p>
      </footer>
    </div>
  )
}
