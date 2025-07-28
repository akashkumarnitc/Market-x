import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Cards from './components/ProductCard.jsx'
import Loader from './components/Loading.jsx'
import Errors from './components/Errors.jsx'
import Home from './pages/Home.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />

  </StrictMode>,
)
