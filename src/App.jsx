import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import TopBar from './components/TopBar.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import ServiceDetail from './pages/ServiceDetail.jsx'
import Gallery from './pages/Gallery.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Testimonials from './pages/Testimonials.jsx'
import Contact from './pages/Contact.jsx'
import LegalPage from './pages/LegalPage.jsx'
import { ContentProvider } from './lib/content.jsx'
import { useRevealFallback, useScrollToTop } from './lib/usePageEffects.js'

// The admin panel is only downloaded when someone opens /admin.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

function SiteRoutes() {
  const { pathname } = useLocation()
  useScrollToTop(pathname)
  useRevealFallback(pathname)

  return (
    <>
      <TopBar />
      <Navbar />
      <main key={pathname} className="page-transition">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/enquiry" element={<Navigate to="/contact" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<LegalPage contentKey="privacy" />} />
          <Route path="/terms-of-service" element={<LegalPage contentKey="terms" />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <ContentProvider>
              <SiteRoutes />
            </ContentProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
