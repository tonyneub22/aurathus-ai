import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home'
import ConsultRequest from './pages/ConsultRequest'
import NotFound from './pages/NotFound'
import ScrollManager from './components/routing/ScrollManager'
import MatteGrain from './components/effects/MatteGrain'
import SmoothScroll from './components/routing/SmoothScroll'

// Service pages are their own chunk, so the home bundle doesn't carry them.
// vercel.json rewrites every path to index.html so deep links load in production.
const ServicePage = lazy(() => import('./pages/ServicePage'))

export function AppRoutes() {
  return (
    <>
      <SmoothScroll />
      <ScrollManager />
      {/* One matte layer for every page, between the body background and the content. */}
      <MatteGrain variant="page" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/consult" element={<ConsultRequest />} />
        <Route
          path="/services/:slug"
          element={
            <Suspense fallback={null}>
              <ServicePage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
