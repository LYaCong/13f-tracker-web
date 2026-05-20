import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LanguageProvider from './context/LanguageProvider'
import { useLanguage } from './context/useLanguage'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const InstitutionDetail = lazy(() => import('./pages/InstitutionDetail'))

function AppRoutes() {
  const { lang } = useLanguage()

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-8 text-center text-text-secondary font-semibold">{lang.loadingHistoricalFilings}</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="institution/:id" element={<InstitutionDetail />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  )
}

export default App
