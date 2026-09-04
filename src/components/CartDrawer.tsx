import { Link } from 'react-router-dom'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../types'
import './CartDrawer.css'

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, totalItems } = useCart()

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? 'cart-overlay--open' : ''}`}
        onClick={() => setIsCartOpen(false)}
      />
      <aside className={`cart-drawer ${isCartOpen ? 'cart-drawer--open' : ''}`}>
        <div className="cart-drawer__header">
          <h3 className="cart-drawer__title">
            Shopping Bag ({totalItems})
          </h3>
          <button onClick={() => setIsCartOpen(false)} className="cart-drawer__close" aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <ShoppingBag size={48} className="cart-drawer__empty-icon" />
            <p>Your shopping bag is empty</p>
            <Link to="/shop" onClick={() => setIsCartOpen(false)} className="cart-drawer__shop-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map(item => (
                <div key={item.product.id} className="cart-drawer__item">
                  <Link
                    to={`/product/${item.product.id}`}
                    onClick={() => setIsCartOpen(false)}
                    className="cart-drawer__item-image"
                  >
                    <img src={item.product.image} alt={item.product.name} />
                  </Link>
                  <div className="cart-drawer__item-info">
                    <Link
                      to={`/product/${item.product.id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="cart-drawer__item-name"
                    >
                      {item.product.name}
                    </Link>
                    <span className="cart-drawer__item-price">{formatPrice(item.product.price)}</span>
                    <div className="cart-drawer__item-controls">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} aria-label="Decrease">
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} aria-label="Increase">
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="cart-drawer__item-remove"
                        aria-label="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__subtotal">
                <span>Subtotal</span>
                <span className="cart-drawer__subtotal-amount">{formatPrice(subtotal)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="cart-drawer__checkout-btn"
              >
                Proceed to Checkout
              </Link>
              <button onClick={() => setIsCartOpen(false)} className="cart-drawer__continue">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
