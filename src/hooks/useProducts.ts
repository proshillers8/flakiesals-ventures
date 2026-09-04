import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'

const FALLBACK_PRODUCTS: Product[] = []

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchProducts() {
      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true })

        if (fetchError) throw fetchError
        if (!cancelled && data) {
          setProducts(data as Product[])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProducts()

    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts()
      })
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [])

  return { products, loading, error }
}

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products
  const q = query.toLowerCase().trim()
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.id.toLowerCase().includes(q) ||
    p.name.toLowerCase().replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))
  )
}

export function filterByCategory(products: Product[], category: string): Product[] {
  return products.filter(p => p.category === category)
}
