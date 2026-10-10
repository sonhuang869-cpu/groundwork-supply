import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StoreLayout } from './components/StoreLayout'
import { ConsoleLayout } from './components/ConsoleLayout'
import { CartProvider } from './lib/cart'
import Store from './pages/Store'
import ProductPage from './pages/Product'
import Landing from './pages/Landing'
import Console from './pages/Console'
import Campaigns from './pages/Campaigns'
import Research from './pages/Research'
import NotFound from './pages/NotFound'

const store = (el: React.ReactNode) => <StoreLayout>{el}</StoreLayout>
const console_ = (el: React.ReactNode) => <ConsoleLayout>{el}</ConsoleLayout>

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={store(<Store />)} />
          <Route path="/p/:slug" element={store(<ProductPage />)} />
          <Route path="/lp/:slug" element={<Landing />} />
          <Route path="/console" element={console_(<Console />)} />
          <Route path="/console/campaigns" element={console_(<Campaigns />)} />
          <Route path="/console/products" element={console_(<Research />)} />
          <Route path="*" element={store(<NotFound />)} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
