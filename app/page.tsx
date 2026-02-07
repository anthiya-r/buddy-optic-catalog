'use client';

import CatalogFilters, { CatalogFiltersState } from '@/components/catalog-filters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { API_URLS } from '@/constants/url';
import { api } from '@/lib/request';
import { Product, ProductsResponse } from '@/types/product';
import { Heart, Search } from 'lucide-react';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [filters, setFilters] = useState<CatalogFiltersState>({
    frameStyles: [],
    materials: [],
    sizes: [],
    faceShape: false,
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* -------------------- fetch categories -------------------- */
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get<Category[]>(API_URLS.PUBLIC.CATEGORIES.LIST);
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
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
      if (selectedCategory) query.append('categoryId', selectedCategory);

      const response = await api.get<ProductsResponse>(
        `${API_URLS.PUBLIC.PRODUCTS.LIST}?${query.toString()}`,
      );

      if (response.success && response.data) {
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, page]);

  /* -------------------- effects -------------------- */
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // reset page เมื่อ filter เปลี่ยน
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory]);

  // debounce search / filter
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchProducts]);

  /* -------------------- helpers -------------------- */
  const getFirstImage = (images: string) => {
    const imageList = images?.split(',').filter(Boolean);
    const firstImage = imageList?.[0];

    if (!firstImage) {
      return '/placeholder.png';
    }

    // 👇 สำคัญมาก
    return API_URLS.IMAGES.GET(firstImage);
  };

  /* -------------------- render -------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-amber-200 bg-ci-primary backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 h-16">
            <Link href="/" className="flex items-center gap-2 h-full">
              <span className="font-medium text-2xl leading-none">Buddy Optical</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[60vh] md:h-[80vh] w-full">
          <Image
            src="/buddy-hero.jpeg"
            alt="Buddy Optical Hero"
            fill
            priority
            className="object-cover"
          />
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Search + Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white border-amber-200"
                />
              </div>

              <CatalogFilters onFiltersChange={setFilters} />
            </div>

            {/* Category */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="rounded-full"
                >
                  {cat.name.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-orange-400" />
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-500">
                No products found
              </div>
            ) : (
              products.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-amber-100 hover:shadow-lg transition"
                >
                  <div className="relative aspect-square bg-amber-50">
                    <Image
                      src={getFirstImage(product.images)}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                    <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 opacity-0 group-hover:opacity-100">
                      <Heart className="h-4 w-4 text-orange-500" />
                    </button>
                  </div>

                  <CardContent className="p-3 space-y-2">
                    <h3 className="text-sm font-semibold line-clamp-1">{product.name}</h3>
                    <div className="flex justify-between items-center text-xs">
                      <Badge variant="secondary">{product.color}</Badge>
                      <span className="text-slate-500">{product.category.name}</span>
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

      {/* Footer */}
      <footer className="border-t border-amber-200 py-8 text-center text-sm">
        © 2026 Buddy Optical. All rights reserved.
      </footer>
    </div>
  );
}
