import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import './CategoryPage.css'

export default function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>()
  const { products, loading, error } = useProducts()

  const decodedName = decodeURIComponent(categoryName || '')
  const filtered = products.filter(p => p.category === decodedName)
  const related = products.filter(p => p.category !== decodedName).slice(0, 4)

  return (
    <div className="category-page">
      <div className="category-page__header">
        <div className="container">
          <Link to="/shop" className="category-page__back">
            <ArrowLeft size={18} /> Back to Shop
          </Link>
          <h1 className="category-page__title">{decodedName}</h1>
          <p className="category-page__count">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="container category-page__body">
        {loading ? (
          <div className="product-grid-skeleton">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : error ? (
          <div className="category-page__error">
            <p>Unable to load products at this time.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="category-page__empty">
            <p>No products in this category yet.</p>
            <Link to="/shop" className="category-page__shop-btn">Browse All Products</Link>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {related.length > 0 && !loading && (
          <div className="category-page__related">
            <h2 className="category-page__related-title">You May Also Like</h2>
            <div className="product-grid">
              {related.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
