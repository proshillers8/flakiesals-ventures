import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { CATEGORIES } from '../types'
import './Header.css'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop All', path: '/shop' },
  { label: 'New Arrivals', path: '/shop?filter=new' },
  { label: 'Best Sellers', path: '/shop?filter=best' },
  { label: 'Special Offers', path: '/shop?filter=offers' },
]

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef<HTMLInputElement>(null)
  const categoryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMobileMenuOpen(false)
    setCategoriesOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMobileMenuOpen(false)
    }
  }

  const handleCategoryEnter = () => {
    if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current)
    setCategoriesOpen(true)
  }

  const handleCategoryLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => setCategoriesOpen(false), 200)
  }

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__top">
        <div className="container header__inner">
          <button
            className="header__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="header__logo">
            <div className="header__logo-icon">
              <span>F</span>
            </div>
            <div className="header__logo-text">
              <span className="header__logo-name">FLAKIESALS</span>
              <span className="header__logo-sub">Ventures</span>
            </div>
          </Link>

          <form className="header__search" onSubmit={handleSearch}>
            <Search size={18} className="header__search-icon" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header__search-input"
            />
          </form>

          <button
            className="header__cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping bag"
          >
            <ShoppingBag size={24} />
            {totalItems > 0 && <span className="header__cart-badge">{totalItems}</span>}
          </button>
        </div>
      </div>

      <nav className={`header__nav ${mobileMenuOpen ? 'header__nav--open' : ''}`}>
        <div className="container header__nav-inner">
          <div
            className="header__nav-item header__nav-item--has-dropdown"
            onMouseEnter={handleCategoryEnter}
            onMouseLeave={handleCategoryLeave}
          >
            <button className="header__nav-link header__nav-link--dropdown-trigger">
              Categories <ChevronDown size={16} />
            </button>
            <div className={`header__dropdown ${categoriesOpen ? 'header__dropdown--open' : ''}`}>
              {CATEGORIES.map(cat => (
                <Link
                  key={cat}
                  to={`/category/${encodeURIComponent(cat)}`}
                  className="header__dropdown-link"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {NAV_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `header__nav-link ${isActive && link.path === '/' ? 'header__nav-link--active' : ''}`
              }
              end={link.path === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="header__mobile-menu">
          <div className="container">
            <form className="header__mobile-search" onSubmit={handleSearch}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <div className="header__mobile-nav">
              {NAV_LINKS.map(link => (
                <Link key={link.path} to={link.path} className="header__mobile-nav-link">
                  {link.label}
                </Link>
              ))}
              <div className="header__mobile-nav-section">Categories</div>
              {CATEGORIES.map(cat => (
                <Link
                  key={cat}
                  to={`/category/${encodeURIComponent(cat)}`}
                  className="header__mobile-nav-link header__mobile-nav-link--sub"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
