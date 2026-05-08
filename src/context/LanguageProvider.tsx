import type { ReactNode } from 'react'
import { useState } from 'react'
import {
  LanguageContext,
  enDict,
  getInitialLanguage,
  type Language,
  zhDict,
} from './language-context'

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)

  const toggleLanguage = () => {
    const nextLanguage: Language = language === 'en' ? 'zh' : 'en'
    setLanguage(nextLanguage)
    window.localStorage.setItem('app-language', nextLanguage)
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        lang: language === 'en' ? enDict : zhDict,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
