import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Minus, Plus, Check } from 'lucide-react'
import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../types'
import ProductCard from '../components/ProductCard'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const { products, loading } = useProducts()
  const { addToCart, setIsCartOpen } = useCart()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = products.find(p => p.id === productId)
  const related = products
    .filter(p => p.category === product?.category && p.id !== productId)
    .slice(0, 4)

  if (loading) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="product-detail__skeleton" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="container product-detail__not-found">
          <h1>Product Not Found</h1>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/shop" className="product-detail__back-btn">Back to Shop</Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/checkout')
  }

  return (
    <div className="product-detail">
      <div className="container">
        <Link to="/shop" className="product-detail__back">
          <ArrowLeft size={18} /> Back to Shop
        </Link>

        <div className="product-detail__grid">
          <div className="product-detail__image-section">
            <div className="product-detail__image-wrap">
              <img src={product.image} alt={product.name} className="product-detail__image" />
              {product.badge && <span className="product-detail__badge">{product.badge}</span>}
            </div>
          </div>

          <div className="product-detail__info-section">
            <span className="product-detail__category">{product.category}</span>
            <h1 className="product-detail__name">{product.name}</h1>
            <div className="product-detail__price">{formatPrice(product.price)}</div>

            {product.stock > 0 ? (
              <div className="product-detail__stock product-detail__stock--in">
                <Check size={16} /> In Stock ({product.stock} available)
              </div>
            ) : (
              <div className="product-detail__stock product-detail__stock--out">
                Out of Stock
              </div>
            )}

            {product.description && (
              <p className="product-detail__desc">{product.description}</p>
            )}

            <div className="product-detail__actions">
              <div className="product-detail__quantity">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease">
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  aria-label="Increase"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                className={`product-detail__add-btn ${added ? 'product-detail__add-btn--added' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {added ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> Add to Bag</>}
              </button>

              <button
                className="product-detail__buy-btn"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>

            <button
              className="product-detail__view-cart"
              onClick={() => setIsCartOpen(true)}
            >
              View Shopping Bag
            </button>

            <div className="product-detail__meta">
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">Product ID:</span>
                <span>{product.id}</span>
              </div>
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">Category:</span>
                <Link to={`/category/${encodeURIComponent(product.category)}`}>{product.category}</Link>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="product-detail__related">
            <h2 className="product-detail__related-title">Related Products</h2>
            <div className="product-grid">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
