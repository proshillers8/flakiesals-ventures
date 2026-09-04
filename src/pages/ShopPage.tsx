import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { useProducts, searchProducts } from '../hooks/useProducts'
import { CATEGORIES } from '../types'
import ProductCard from '../components/ProductCard'
import './ShopPage.css'

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

export default function ShopPage() {
  const { products, loading, error } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const filter = searchParams.get('filter') || ''
  const [searchInput, setSearchInput] = useState(query)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setSearchInput(query)
  }, [query])

  const filtered = useMemo(() => {
    let result = [...products]

    if (query) {
      result = searchProducts(result, query)
    }

    if (filter === 'new') {
      result = result.filter(p => p.is_new_arrival)
    } else if (filter === 'best') {
      result = result.filter(p => p.is_best_seller)
    } else if (filter === 'offers') {
      result = result.filter(p => p.is_special_offer)
    }

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory)
    }

    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
    }

    return result
  }, [products, query, filter, selectedCategory, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchInput.trim()) {
      params.set('q', searchInput.trim())
    } else {
      params.delete('q')
    }
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSearchInput('')
    setSearchParams({})
  }

  const hasActiveFilters = query || filter || selectedCategory

  return (
    <div className="shop-page">
      <div className="shop-page__header">
        <div className="container">
          <h1 className="shop-page__title">
            {filter === 'new' ? 'New Arrivals' :
             filter === 'best' ? 'Best Sellers' :
             filter === 'offers' ? 'Special Offers' :
             query ? `Search: "${query}"` :
             'Shop All Products'}
          </h1>
          <p className="shop-page__count">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <div className="container shop-page__body">
        <button
          className="shop-page__filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={18} /> Filters
        </button>

        <aside className={`shop-page__sidebar ${showFilters ? 'shop-page__sidebar--open' : ''}`}>
          <div className="filter-section">
            <h3 className="filter-section__title">Search</h3>
            <form onSubmit={handleSearch} className="filter-section__search">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>

          <div className="filter-section">
            <h3 className="filter-section__title">Categories</h3>
            <div className="filter-section__categories">
              <button
                className={`filter-chip ${!selectedCategory ? 'filter-chip--active' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`filter-chip ${selectedCategory === cat ? 'filter-chip--active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-section__title">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="filter-section__select"
            >
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="filter-section__clear">
              <X size={14} /> Clear All Filters
            </button>
          )}
        </aside>

        <div className="shop-page__main">
          {loading ? (
            <div className="product-grid-skeleton">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : error ? (
            <div className="shop-page__error">
              <p>Unable to load products at this time. Please try again later.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="shop-page__empty">
              <p>No products found matching your criteria.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="shop-page__clear-btn">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
