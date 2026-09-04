import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__code">404</h1>
        <h2 className="not-found__title">Page Not Found</h2>
        <p className="not-found__desc">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="not-found__btn">
          <Home size={18} /> Back to Home
        </Link>
      </div>
    </div>
  )
}
