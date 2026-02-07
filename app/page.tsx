'use client';

import FloatingContact from '@/components/floating-contact';
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
import { Product, ProductsResponse } from '@/types/product';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* -------------------- fetch categories -------------------- */
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

  /* -------------------- fetch products -------------------- */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append('page', page.toString());
      query.append('limit', '8');

      if (search) query.append('search', search);
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
  }, [search, selectedCategoryId, page]);

  /* -------------------- effects -------------------- */
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // reset page เมื่อ search / category เปลี่ยน
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategoryId]);

  // debounce
  useEffect(() => {
    const t = setTimeout(fetchProducts, 400);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  /* -------------------- helpers -------------------- */
  const getFirstImage = (images: string) => {
    const img = images?.split(',').filter(Boolean)?.[0];
    return img ? API_URLS.IMAGES.GET(img) : '/placeholder.png';
  };

  /* -------------------- render -------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-amber-200 bg-ci-primary">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="text-2xl font-medium">
            Buddy Optical
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[60vh] md:h-[80vh]">
        <Image src="/buddy-hero.jpeg" alt="Hero" fill priority className="object-cover" />
      </section>

      {/* Catalog */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Category filter */}
          {/* MOBILE */}
          <div className="mb-6 block md:hidden w-full">
            <Select
              value={selectedCategoryId || 'all'}
              onValueChange={(value) => setSelectedCategoryId(value === 'all' ? '' : value)}
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

          {/* DESKTOP */}
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
            {loading ? (
              <div className="col-span-full text-center py-12">Loading...</div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-500">
                No products found
              </div>
            ) : (
              products.map((p) => (
                <Card key={p.id} className="group overflow-hidden">
                  <div className="relative aspect-square bg-amber-50">
                    <Image
                      src={getFirstImage(p.images)}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-110 transition"
                    />
                    <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100">
                      <Heart className="h-4 w-4 text-orange-500" />
                    </button>
                  </div>

                  <CardContent className="p-3 space-y-1">
                    <h3 className="text-sm font-semibold line-clamp-1">{p.name}</h3>
                    <div className="flex justify-between text-xs">
                      <Badge variant="secondary">{p.color}</Badge>
                      <span className="text-slate-500">{p.category.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
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
            </div>
          )}
        </div>
      </section>
      <FloatingContact />
    </div>
  );
}
