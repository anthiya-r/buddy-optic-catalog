'use client';

import FloatingContact from '@/components/floating-contact';
import ProductView from '@/components/images/product-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { API_URLS } from '@/constants/url';
import { api } from '@/lib/request';
import { Category } from '@/types/product';
import { Product, ProductsResponse } from '@/types/product';
import { useCallback, useEffect, useState } from 'react';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get<Category[]>(API_URLS.PUBLIC.CATEGORIES.LIST);
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Fetch categories failed:', err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append('page', page.toString());
      query.append('limit', '8');
      if (selectedCategoryId) query.append('categoryId', selectedCategoryId);

      const res = await api.get<ProductsResponse>(
        `${API_URLS.PUBLIC.PRODUCTS.LIST}?${query.toString()}`,
      );

      if (res.success && res.data) {
        setProducts(res.data.products);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Fetch products failed:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId, page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 400);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  return (
    <>
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Mobile category filter */}
          <div className="mb-6 block md:hidden w-full">
            <Select
              value={selectedCategoryId || 'all'}
              onValueChange={(v) => setSelectedCategoryId(v === 'all' ? '' : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">รวมกรอบแว่นทุกแบบ</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop category filter */}
          <div className="mb-8 hidden flex-wrap gap-2 md:flex">
            <Button
              size="sm"
              variant={selectedCategoryId === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategoryId('')}
            >
              รวมกรอบแว่นทุกแบบ
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={selectedCategoryId === cat.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategoryId(cat.id)}
                className="rounded-full"
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : products.length === 0
                ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                      No products found
                    </div>
                  )
                : products.map((p) => (
                    <Card key={p.id} className="group overflow-hidden">
                      <div className="relative aspect-square bg-amber-50">
                        <ProductView
                          photo={p.images}
                          name={p.name}
                          color={p.color}
                          category={p.category.name}
                        />
                      </div>
                      <CardContent className="p-3 space-y-1">
                        <h3 className="text-sm font-semibold line-clamp-1">{p.name}</h3>
                        <div className="flex justify-between text-xs">
                          <Badge variant="secondary">{p.color}</Badge>
                          <span className="text-slate-500">{p.category.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="flex justify-center items-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                .map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={p === page ? 'default' : 'outline'}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </nav>
          )}
        </div>
      </section>

      <FloatingContact />
    </>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="aspect-square bg-amber-100 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 bg-amber-100 animate-pulse rounded" />
        <div className="flex justify-between">
          <div className="h-5 w-16 bg-amber-100 animate-pulse rounded-full" />
          <div className="h-4 w-12 bg-amber-100 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
