import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Check, Landmark } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../types'
import { supabase } from '../lib/supabase'
import './CheckoutPage.css'

const BANK_DETAILS = {
  bankName: 'To be provided',
  accountName: 'FLAKIESALS Ventures',
  accountNumber: 'To be provided',
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const total = subtotal

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (items.length === 0) return

    setSubmitting(true)
    try {
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }))

      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_email: formData.customer_email,
          customer_address: formData.customer_address,
          items: orderItems,
          total,
          payment_status: 'pending',
          order_status: 'new',
        })
        .select()
        .single()

      if (error) throw error

      setOrderId(data.id)
      setOrderPlaced(true)
      clearCart()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-success">
            <div className="checkout-success__icon">
              <Check size={48} />
            </div>
            <h1>Order Placed Successfully!</h1>
            <p>Your order ID is <strong>{orderId}</strong></p>
            <p className="checkout-success__msg">
              Please complete your payment via bank transfer using the details below. Your order will be processed once payment is confirmed.
            </p>

            <div className="checkout-payment">
              <h3 className="checkout-payment__title">
                <Landmark size={20} /> Bank Transfer Details
              </h3>
              <div className="checkout-payment__details">
                <div className="checkout-payment__row" onClick={() => copyToClipboard(BANK_DETAILS.bankName, 'bank')}>
                  <span className="checkout-payment__label">Bank Name</span>
                  <span className="checkout-payment__value">{BANK_DETAILS.bankName}</span>
                  {copied === 'bank' ? <Check size={16} /> : <Copy size={16} />}
                </div>
                <div className="checkout-payment__row" onClick={() => copyToClipboard(BANK_DETAILS.accountName, 'name')}>
                  <span className="checkout-payment__label">Account Name</span>
                  <span className="checkout-payment__value">{BANK_DETAILS.accountName}</span>
                  {copied === 'name' ? <Check size={16} /> : <Copy size={16} />}
                </div>
                <div className="checkout-payment__row" onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'number')}>
                  <span className="checkout-payment__label">Account Number</span>
                  <span className="checkout-payment__value">{BANK_DETAILS.accountNumber}</span>
                  {copied === 'number' ? <Check size={16} /> : <Copy size={16} />}
                </div>
              </div>
              <div className="checkout-payment__amount">
                <span>Amount to Transfer:</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>

            <Link to="/shop" className="checkout-success__btn">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container checkout-empty">
          <h1>Your Shopping Bag is Empty</h1>
          <p>Add some products before checking out.</p>
          <Link to="/shop" className="checkout-empty__btn">Start Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <Link to="/shop" className="checkout-page__back">
          <ArrowLeft size={18} /> Continue Shopping
        </Link>

        <h1 className="checkout-page__title">Checkout</h1>

        <div className="checkout-page__grid">
          <div className="checkout-form">
            <h2 className="checkout-form__title">Customer Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="checkout-form__field">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="checkout-form__field">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 08012345678"
                />
              </div>
              <div className="checkout-form__field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>
              <div className="checkout-form__field">
                <label>Delivery Address / Notes</label>
                <textarea
                  name="customer_address"
                  value={formData.customer_address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter your address or any additional notes"
                />
              </div>

              {submitError && <div className="checkout-form__error">{submitError}</div>}

              <button type="submit" className="checkout-form__submit" disabled={submitting}>
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <h2 className="checkout-summary__title">Order Summary</h2>
            <div className="checkout-summary__items">
              {items.map(item => (
                <div key={item.product.id} className="checkout-summary__item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="checkout-summary__item-info">
                    <span className="checkout-summary__item-name">{item.product.name}</span>
                    <span className="checkout-summary__item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="checkout-summary__item-price">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="checkout-summary__total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            <div className="checkout-summary__payment-info">
              <Landmark size={20} />
              <div>
                <h4>Payment Method</h4>
                <p>Bank Transfer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
