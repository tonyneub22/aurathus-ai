import Home from './pages/Home'
import ConsultRequest from './pages/ConsultRequest'

// Plain links and a full page load between pages: no router library needed
// for two routes. Add one here if the site grows. vercel.json rewrites
// /consult to index.html so deep links work in production.
export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '')
  return path === '/consult' ? <ConsultRequest /> : <Home />
}
