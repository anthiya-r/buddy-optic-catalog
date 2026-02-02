'use client';

import CatalogFilters, { CatalogFiltersState } from '@/components/catalog-filters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { API_URLS } from '@/constants/url';
import { api } from '@/lib/request';
import { Heart, Search, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  color: string;
  images: string;
  status: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
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

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get<Category[]>(API_URLS.CATEGORIES.LIST);
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (selectedCategory) query.append('categoryId', selectedCategory);

      const response = await api.get<any>(`${API_URLS.PRODUCTS.LIST}?${query}`);
      if (response.success && response.data) {
        setProducts(response.data.products || response.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getFirstImage = (images: string) => {
    const imageList = images?.split(',').filter(Boolean);
    return imageList?.[0] || '/placeholder.png';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-amber-200 bg-ci-primary backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 h-16">
            <Link href="/" className="flex items-center gap-2 h-full">
              <div className="flex items-center gap-2 h-full">
                <span className="font-medium text-2xl leading-none">Buddy Optical</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - full-bleed image to fit viewport */}
      <section className="relative overflow-hidden">
        <div className="w-screen">
          <div className="relative h-[60vh] md:h-[80vh] w-full">
            <Image
              src="/buddy-hero.jpeg"
              alt="Buddy Optical Hero"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            {/* Search Bar + Filters (same row) */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2 md:mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white border-amber-200 focus:ring-orange-400"
                />
              </div>

              <div className="flex items-center h-9 flex-shrink-0">
                <CatalogFilters onFiltersChange={setFilters} />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap">
              {/* <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
                className="rounded-full"
              >
                ALL
              </Button> */}
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="rounded-full"
                >
                  {cat.name.toUpperCase()}
                </Button>
              ))}
            </div>

            {/* Frame Filters placed with search above */}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin">
                  <div className="h-8 w-8 border-4 border-amber-200 border-t-orange-400 rounded-full" />
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500">No products found</p>
              </div>
            ) : (
              products.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-amber-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                    <Image
                      src={getFirstImage(product.images)}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="h-4 w-4 text-orange-500" />
                    </button>
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.color}
                      </Badge>
                      <span className="text-xs text-slate-500">{product.category.name}</span>
                    </div>
                    <div className="pt-2 border-t border-amber-100">
                      <p className="text-sm font-semibold text-slate-900 mb-2">฿2,499 - ฿3,999</p>
                      <Button size="sm" className="w-full rounded-lg text-xs font-semibold">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        ADD TO CART
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-amber-200 bg-ci-primary text-ci-dark py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm">© 2026 Buddy Optical. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
