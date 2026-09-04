import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import { CATEGORIES } from '../types'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <span>F</span>
              </div>
              <div className="footer__logo-text">
                <span className="footer__logo-name">FLAKIESALS</span>
                <span className="footer__logo-sub">Ventures</span>
              </div>
            </div>
            <p className="footer__desc">
              Your trusted source for premium countertops, household items, and souvenirs in Nigeria. Quality products for your home and kitchen.
            </p>
            <div className="footer__socials">
              <a href="#" aria-label="Facebook" className="footer__social"><Facebook size={18} /></a>
              <a href="#" aria-label="Instagram" className="footer__social"><Instagram size={18} /></a>
              <a href="#" aria-label="Twitter" className="footer__social"><Twitter size={18} /></a>
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__title">Shop</h4>
            <ul className="footer__links">
              <li><Link to="/shop">All Products</Link></li>
              <li><Link to="/shop?filter=new">New Arrivals</Link></li>
              <li><Link to="/shop?filter=best">Best Sellers</Link></li>
              <li><Link to="/shop?filter=offers">Special Offers</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__title">Categories</h4>
            <ul className="footer__links">
              {CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat}>
                  <Link to={`/category/${encodeURIComponent(cat)}`}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__title">Contact Us</h4>
            <ul className="footer__contact">
              <li><Phone size={16} /> <span>To be provided</span></li>
              <li><Mail size={16} /> <span>To be provided</span></li>
              <li><MapPin size={16} /> <span>Nigeria</span></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} FLAKIESALS Ventures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
