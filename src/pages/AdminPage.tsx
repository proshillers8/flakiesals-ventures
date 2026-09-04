import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { CATEGORIES, formatPrice, type Product, type Order } from '../types'
import { Package, ShoppingCart, TrendingUp, Plus, Edit2, X, Trash2 } from 'lucide-react'
import './AdminPage.css'

const ADMIN_PASSWORD = 'flakiesals2024'
const SESSION_KEY = 'flakiesals_admin_session'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState<'products' | 'orders' | 'overview'>('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY)
    if (session === 'true') setAuthed(true)
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, orderRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ])
      if (prodRes.data) setProducts(prodRes.data as Product[])
      if (orderRes.data) setOrders(orderRes.data as Order[])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authed) fetchData()
  }, [authed, fetchData])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      sessionStorage.setItem(SESSION_KEY, 'true')
      setAuthError('')
    } else {
      setAuthError('Incorrect password')
    }
  }

  const handleLogout = () => {
    setAuthed(false)
    sessionStorage.removeItem(SESSION_KEY)
  }

  const handleProductSave = async (product: Product) => {
    const { id, ...data } = product
    if (editingProduct && id) {
      await supabase.from('products').update(data).eq('id', id)
    } else {
      await supabase.from('products').insert({ ...data, id: id || crypto.randomUUID() })
    }
    setEditingProduct(null)
    setShowAddForm(false)
    fetchData()
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchData()
  }

  const handleUpdateOrderStatus = async (orderId: string, field: 'payment_status' | 'order_status', value: string) => {
    await supabase.from('orders').update({ [field]: value }).eq('id', orderId)
    fetchData()
  }

  if (!authed) {
    return (
      <div className="admin-login">
        <form className="admin-login__form" onSubmit={handleLogin}>
          <h1 className="admin-login__title">Admin Login</h1>
          <p className="admin-login__subtitle">FLAKIESALS Ventures Management</p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-login__input"
            autoFocus
          />
          {authError && <div className="admin-login__error">{authError}</div>}
          <button type="submit" className="admin-login__btn">Login</button>
        </form>
      </div>
    )
  }

  const totalRevenue = orders
    .filter(o => o.payment_status === 'confirmed')
    .reduce((sum, o) => sum + o.total, 0)

  const pendingOrders = orders.filter(o => o.order_status === 'new').length

  return (
    <div className="admin">
      <div className="admin__header">
        <div className="container admin__header-inner">
          <h1 className="admin__title">Admin Dashboard</h1>
          <button onClick={handleLogout} className="admin__logout">Logout</button>
        </div>
      </div>

      <div className="container admin__body">
        <div className="admin__tabs">
          <button
            className={`admin__tab ${tab === 'overview' ? 'admin__tab--active' : ''}`}
            onClick={() => setTab('overview')}
          >
            Overview
          </button>
          <button
            className={`admin__tab ${tab === 'products' ? 'admin__tab--active' : ''}`}
            onClick={() => setTab('products')}
          >
            Products ({products.length})
          </button>
          <button
            className={`admin__tab ${tab === 'orders' ? 'admin__tab--active' : ''}`}
            onClick={() => setTab('orders')}
          >
            Orders ({orders.length})
          </button>
        </div>

        {tab === 'overview' && (
          <div className="admin-overview">
            <div className="admin-stats">
              <div className="admin-stat-card">
                <Package size={24} />
                <div>
                  <span className="admin-stat-card__value">{products.length}</span>
                  <span className="admin-stat-card__label">Products</span>
                </div>
              </div>
              <div className="admin-stat-card">
                <ShoppingCart size={24} />
                <div>
                  <span className="admin-stat-card__value">{orders.length}</span>
                  <span className="admin-stat-card__label">Total Orders</span>
                </div>
              </div>
              <div className="admin-stat-card">
                <TrendingUp size={24} />
                <div>
                  <span className="admin-stat-card__value">{pendingOrders}</span>
                  <span className="admin-stat-card__label">Pending Orders</span>
                </div>
              </div>
              <div className="admin-stat-card">
                <TrendingUp size={24} />
                <div>
                  <span className="admin-stat-card__value">{formatPrice(totalRevenue)}</span>
                  <span className="admin-stat-card__label">Confirmed Revenue</span>
                </div>
              </div>
            </div>

            <div className="admin-recent">
              <h2 className="admin-recent__title">Recent Orders</h2>
              {orders.length === 0 ? (
                <p className="admin-recent__empty">No orders yet.</p>
              ) : (
                <div className="admin-recent__list">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="admin-recent__item">
                      <span className="admin-recent__id">{order.id.slice(0, 8)}</span>
                      <span className="admin-recent__name">{order.customer_name}</span>
                      <span className="admin-recent__total">{formatPrice(order.total)}</span>
                      <span className={`admin-recent__status admin-recent__status--${order.payment_status}`}>
                        {order.payment_status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div className="admin-products">
            <div className="admin-products__header">
              <h2 className="admin-products__title">Manage Products</h2>
              <button className="admin-products__add" onClick={() => { setEditingProduct(null); setShowAddForm(true) }}>
                <Plus size={18} /> Add Product
              </button>
            </div>

            {(showAddForm || editingProduct) && (
              <ProductForm
                product={editingProduct}
                onSave={handleProductSave}
                onCancel={() => { setEditingProduct(null); setShowAddForm(false) }}
              />
            )}

            {loading ? (
              <p>Loading products...</p>
            ) : (
              <div className="admin-products__table-wrap">
                <table className="admin-products__table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <img src={p.image} alt={p.name} className="admin-products__thumb" />
                        </td>
                        <td className="admin-products__name">{p.name}</td>
                        <td>{p.category}</td>
                        <td className="admin-products__price">{formatPrice(p.price)}</td>
                        <td>{p.stock}</td>
                        <td>{p.is_active ? 'Yes' : 'No'}</td>
                        <td>
                          <div className="admin-products__actions">
                            <button onClick={() => { setEditingProduct(p); setShowAddForm(false) }} aria-label="Edit">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} aria-label="Delete" className="admin-products__delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="admin-orders">
            <h2 className="admin-orders__title">Manage Orders</h2>
            {orders.length === 0 ? (
              <p className="admin-orders__empty">No orders yet.</p>
            ) : (
              <div className="admin-orders__list">
                {orders.map(order => (
                  <div key={order.id} className="admin-order-card">
                    <div className="admin-order-card__header">
                      <div>
                        <span className="admin-order-card__id">#{order.id.slice(0, 8)}</span>
                        <span className="admin-order-card__date">
                          {new Date(order.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <span className="admin-order-card__total">{formatPrice(order.total)}</span>
                    </div>
                    <div className="admin-order-card__customer">
                      <div><strong>{order.customer_name}</strong></div>
                      <div>{order.customer_phone}</div>
                      {order.customer_email && <div>{order.customer_email}</div>}
                      {order.customer_address && <div>{order.customer_address}</div>}
                    </div>
                    <div className="admin-order-card__items">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="admin-order-card__item">
                          <span>{item.product_name} x{item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="admin-order-card__controls">
                      <div className="admin-order-card__control">
                        <label>Payment Status</label>
                        <select
                          value={order.payment_status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, 'payment_status', e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                      <div className="admin-order-card__control">
                        <label>Order Status</label>
                        <select
                          value={order.order_status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, 'order_status', e.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="processing">Processing</option>
                          <option value="fulfilled">Fulfilled</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductForm({ product, onSave, onCancel }: {
  product: Product | null
  onSave: (p: Product) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Product>(product || {
    id: '',
    name: '',
    category: CATEGORIES[0] as string,
    price: 0,
    image: '/images/products/photo_1_2026-09-04_00-41-40.jpg',
    description: '',
    badge: '',
    stock: 0,
    is_featured: false,
    is_best_seller: false,
    is_new_arrival: false,
    is_special_offer: false,
    is_active: true,
    created_at: new Date().toISOString(),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="product-form__header">
        <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
        <button type="button" onClick={onCancel} aria-label="Close"><X size={20} /></button>
      </div>
      <div className="product-form__grid">
        <div className="product-form__field">
          <label>Product Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="product-form__field">
          <label>Category *</label>
          <select name="category" value={form.category} onChange={handleChange} required>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="product-form__field">
          <label>Price (₦) *</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} required min={0} />
        </div>
        <div className="product-form__field">
          <label>Stock Quantity</label>
          <input type="number" name="stock" value={form.stock} onChange={handleChange} min={0} />
        </div>
        <div className="product-form__field product-form__field--full">
          <label>Image Path</label>
          <input name="image" value={form.image} onChange={handleChange} placeholder="/images/products/photo_1.jpg" />
        </div>
        <div className="product-form__field product-form__field--full">
          <label>Description</label>
          <textarea name="description" value={form.description || ''} onChange={handleChange} rows={3} />
        </div>
        <div className="product-form__field">
          <label>Badge (e.g. "New", "Sale")</label>
          <input name="badge" value={form.badge || ''} onChange={handleChange} />
        </div>
        <div className="product-form__field product-form__field--checks">
          <label className="product-form__check">
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} /> Featured
          </label>
          <label className="product-form__check">
            <input type="checkbox" name="is_best_seller" checked={form.is_best_seller} onChange={handleChange} /> Best Seller
          </label>
          <label className="product-form__check">
            <input type="checkbox" name="is_new_arrival" checked={form.is_new_arrival} onChange={handleChange} /> New Arrival
          </label>
          <label className="product-form__check">
            <input type="checkbox" name="is_special_offer" checked={form.is_special_offer} onChange={handleChange} /> Special Offer
          </label>
          <label className="product-form__check">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} /> Active
          </label>
        </div>
      </div>
      <button type="submit" className="product-form__save">Save Product</button>
    </form>
  )
}
