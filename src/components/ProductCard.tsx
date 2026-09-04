import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '../types'
import { formatPrice } from '../types'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img src={product.image} alt={product.name} className="product-card__image" loading="lazy" />
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
        {product.stock === 0 && <span className="product-card__badge product-card__badge--out">Out of Stock</span>}
      </div>
      <div className="product-card__info">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__bottom">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          <button
            className="product-card__add"
            onClick={handleAdd}
            disabled={product.stock === 0}
            aria-label={`Add ${product.name} to bag`}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </Link>
  )
}
