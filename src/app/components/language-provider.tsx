import { createContext, useContext, useEffect, useState } from "react"
import { translations } from "../utils/translations"

export type Language = "fr" | "en"

type LanguageProviderProps = {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
}

type LanguageProviderState = {
  language: Language
  setLanguage: (language: Language) => void
}

const initialState: LanguageProviderState = {
  language: "fr",
  setLanguage: () => null,
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

export function LanguageProvider({
  children,
  defaultLanguage = "fr",
  storageKey = "datavibe-language",
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
  )

  useEffect(() => {
    localStorage.setItem(storageKey, language)
    document.documentElement.lang = language
  }, [language, storageKey])

  const value = {
    language,
    setLanguage: (language: Language) => {
      setLanguage(language)
    },
  }

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext)

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider")

  return context
}

export const useTranslation = () => {
  const { language } = useLanguage()
  
  const t = (key: string) => {
    return translations[language]?.[key] || translations['fr']?.[key] || key
  }

  return { t, language }
}