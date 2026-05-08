import { Info, Search } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'

export default function Layout() {
  const { language, toggleLanguage, lang } = useLanguage()

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
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-full bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all"
                  placeholder={lang.searchPlaceholder}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
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
