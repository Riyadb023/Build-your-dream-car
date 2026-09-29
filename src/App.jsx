import { useCallback } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import ErrorBoundary from './components/layout/ErrorBoundary.jsx'
import BuilderPage from './pages/BuilderPage.jsx'
import GaragePage from './pages/GaragePage.jsx'
import ChallengesPage from './pages/ChallengesPage.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'

const GARAGE_KEY = 'dcb:garage:v1'

export default function App() {
  const [garage, setGarage] = useLocalStorage(GARAGE_KEY, [])

  const saveBuild = useCallback(
    (build) => {
      const entry = { ...build, id: `b${Date.now().toString(36)}`, savedAt: Date.now() }
      setGarage((prev) => [entry, ...prev])
      return entry
    },
    [setGarage],
  )

  const deleteBuild = useCallback(
    (id) => setGarage((prev) => prev.filter((b) => b.id !== id)),
    [setGarage],
  )

  const renameBuild = useCallback(
    (id, name) => setGarage((prev) => prev.map((b) => (b.id === id ? { ...b, name } : b))),
    [setGarage],
  )

  return (
    <>
      <div className="app-bg" aria-hidden="true" />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header garageCount={garage.length} />

      <main id="main" className="app-main">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<BuilderPage onSave={saveBuild} garage={garage} />} />
            <Route
              path="/garage"
              element={
                <GaragePage garage={garage} onDelete={deleteBuild} onRename={renameBuild} />
              }
            />
            <Route path="/challenges" element={<ChallengesPage garage={garage} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>

      <Footer />
    </>
  )
}
