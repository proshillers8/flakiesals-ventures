import { Link } from 'react-router-dom'
import { ArrowRight, Truck, ShieldCheck, Headphones, CreditCard } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { CATEGORIES } from '../types'
import ProductCard from '../components/ProductCard'
import './HomePage.css'

export default function HomePage() {
  const { products, loading, error } = useProducts()

  const featured = products.filter(p => p.is_featured).slice(0, 8)
  const bestSellers = products.filter(p => p.is_best_seller).slice(0, 4)
  const newArrivals = products.filter(p => p.is_new_arrival).slice(0, 4)
  const specialOffers = products.filter(p => p.is_special_offer).slice(0, 4)

  const displayFeatured = featured.length > 0 ? featured : products.slice(0, 8)

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="hero__tag">Premium Household & Souvenir Store</span>
            <h1 className="hero__title">Quality Products for Your Home & Kitchen</h1>
            <p className="hero__desc">
              Discover a wide range of countertops, kitchenware, household items, and unique souvenirs. Quality you can trust, prices you'll love.
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="hero__cta">
                Shop All Products <ArrowRight size={18} />
              </Link>
              <Link to="/shop?filter=new" className="hero__cta-secondary">
                New Arrivals
              </Link>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__visual-bg" />
            <div className="hero__visual-content">
              <span className="hero__visual-label">FLAKIESALS</span>
              <span className="hero__visual-sub">Ventures</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="trust-badges">
        <div className="container trust-badges__inner">
          <div className="trust-badge">
            <Truck size={28} />
            <div>
              <h4>Quality Products</h4>
              <p>Carefully selected items</p>
            </div>
          </div>
          <div className="trust-badge">
            <ShieldCheck size={28} />
            <div>
              <h4>Trusted Store</h4>
              <p>Reliable service you can count on</p>
            </div>
          </div>
          <div className="trust-badge">
            <Headphones size={28} />
            <div>
              <h4>Customer Support</h4>
              <p>We're here to help</p>
            </div>
          </div>
          <div className="trust-badge">
            <CreditCard size={28} />
            <div>
              <h4>Easy Payment</h4>
              <p>Bank transfer available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home-section">
        <div className="container">
          <div className="home-section__header">
            <h2 className="home-section__title">Shop by Category</h2>
            <Link to="/shop" className="home-section__link">View All <ArrowRight size={16} /></Link>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat}
                to={`/category/${encodeURIComponent(cat)}`}
                className="category-card"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="category-card__icon">{cat.charAt(0)}</span>
                <span className="category-card__name">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="home-section home-section--surface">
        <div className="container">
          <div className="home-section__header">
            <h2 className="home-section__title">Featured Products</h2>
            <Link to="/shop" className="home-section__link">View All <ArrowRight size={16} /></Link>
          </div>
          {loading ? (
            <div className="product-grid-skeleton">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : error ? (
            <div className="home-section__error">
              <p>Unable to load products at this time. Please try again later.</p>
            </div>
          ) : (
            <div className="product-grid">
              {displayFeatured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="home-section__header">
              <h2 className="home-section__title">Best Sellers</h2>
              <Link to="/shop?filter=best" className="home-section__link">View All <ArrowRight size={16} /></Link>
            </div>
            <div className="product-grid">
              {bestSellers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="home-section home-section--surface">
          <div className="container">
            <div className="home-section__header">
              <h2 className="home-section__title">New Arrivals</h2>
              <Link to="/shop?filter=new" className="home-section__link">View All <ArrowRight size={16} /></Link>
            </div>
            <div className="product-grid">
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Special Offers CTA */}
      {specialOffers.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="home-section__header">
              <h2 className="home-section__title">Special Offers</h2>
              <Link to="/shop?filter=offers" className="home-section__link">View All <ArrowRight size={16} /></Link>
            </div>
            <div className="product-grid">
              {specialOffers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <h2>Ready to Shop?</h2>
          <p>Browse our full catalog of quality household and souvenir products.</p>
          <Link to="/shop" className="cta-banner__btn">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
