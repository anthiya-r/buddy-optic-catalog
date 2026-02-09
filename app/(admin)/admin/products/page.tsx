'use client';

import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { ProductFormDialog } from '@/components/admin/product-form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { API_URLS } from '@/constants/url';
import { api } from '@/lib/request';
import { getFirstImage } from '@/lib/ui-helpers';
import { Category, Product, ProductsResponse } from '@/types/product';
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  ImageOff,
  Package,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dialogs
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Track failed images
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', pagination.page.toString());
    params.set('limit', pagination.limit.toString());

    if (search) params.set('search', search);
    if (categoryFilter !== 'all') params.set('categoryId', categoryFilter);
    if (statusFilter !== 'all') params.set('status', statusFilter);

    const response = await api.get<ProductsResponse>(
      `${API_URLS.ADMIN.PRODUCTS.LIST}?${params.toString()}`,
    );
    console.log('🚀 ~ ProductsPage ~ response:', response);

    if (response.success && response.data) {
      setProducts(response.data.products);
      setFailedImages(new Set()); // Reset failed images on refresh
      setPagination((prev) => ({
        ...prev,
        totalCount: response.data!.pagination.totalCount,
        totalPages: response.data!.pagination.totalPages,
      }));
    }
    setLoading(false);
  }, [pagination.page, pagination.limit, search, categoryFilter, statusFilter]);

  const fetchCategories = useCallback(async () => {
    // Fetch all categories for the filter dropdown (high limit to get all)
    const response = await api.get<{ categories: Category[]; pagination: unknown }>(
      `${API_URLS.ADMIN.CATEGORIES.LIST}?limit=100`,
    );
    if (response.success && response.data) {
      setCategories(response.data.categories);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;

    setIsDeleting(true);
    const response = await api.delete(API_URLS.ADMIN.PRODUCTS.DETAIL(selectedProduct.id));

    if (response.success) {
      toast.success('ลบสินค้าสำเร็จ');
      // Update state directly instead of re-fetching
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setPagination((prev) => ({
        ...prev,
        totalCount: prev.totalCount - 1,
      }));
    } else {
      toast.error(response.message || 'เกิดข้อผิดพลาด');
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleToggleStatus = async (product: Product) => {
    const response = await api.patch<Product>(API_URLS.ADMIN.PRODUCTS.STATUS(product.id));

    if (response.success && response.data) {
      toast.success(product.status === 'active' ? 'ซ่อนสินค้าแล้ว' : 'แสดงสินค้าแล้ว');
      // Update state directly instead of re-fetching
      setProducts((prev) => prev.map((p) => (p.id === product.id ? response.data! : p)));
    } else {
      toast.error(response.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleFormSuccess = ({ product, isEdit }: { product: Product; isEdit: boolean }) => {
    if (isEdit) {
      // Update state directly for edit
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    } else {
      // Re-fetch for create to get proper pagination
      fetchProducts();
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">จัดการสินค้า</h1>
          <p className="text-slate-500">เพิ่ม แก้ไข ลบ และจัดการสินค้าทั้งหมด</p>
        </div>
        <Button
          onClick={() => {
            setSelectedProduct(null);
            setFormDialogOpen(true);
          }}
          className="rounded-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มสินค้า
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-amber-100 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">ค้นหาและกรอง</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className=" col-span-1 lg:col-span-3 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="ค้นหาชื่อสินค้า..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 border-primary"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-primary">
                  <SelectValue placeholder="หมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-primary">
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="active">แสดง</SelectItem>
                  <SelectItem value="hidden">ซ่อน</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSearch} variant="secondary">
              <Search className="mr-2 h-4 w-4" />
              ค้นหา
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-amber-100 bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-amber-50">
                <TableRow className="border-amber-100 hover:bg-amber-50">
                  <TableHead className="w-20 text-slate-700">รูปภาพ</TableHead>
                  <TableHead className="text-slate-700">ชื่อสินค้า</TableHead>
                  <TableHead className="hidden sm:table-cell text-slate-700">สี</TableHead>
                  <TableHead className="hidden md:table-cell text-slate-700">หมวดหมู่</TableHead>
                  <TableHead className="text-slate-700">สถานะ</TableHead>
                  <TableHead className="text-right text-slate-700">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-amber-100 hover:bg-amber-50/50">
                      <TableCell>
                        <Skeleton className="h-12 w-12 rounded" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Package className="h-8 w-8" />
                        <p>ไม่พบสินค้า</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="relative h-12 w-12 rounded overflow-hidden bg-muted flex items-center justify-center">
                          {failedImages.has(product.id) || !product.images ? (
                            <ImageOff className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Image
                              src={getFirstImage(product.images)}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                              onError={() =>
                                setFailedImages((prev) => new Set(prev).add(product.id))
                              }
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-50 truncate">{product.name}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {product.color} • {product.category.name}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{product.color}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant="outline"
                          className="border-amber-200 bg-amber-50 text-slate-700"
                        >
                          {product.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.status === 'active' ? 'default' : 'secondary'}
                          className={`cursor-pointer ${product.status === 'active' ? 'bg-green-100 text-green-900 hover:bg-green-200' : 'bg-gray-100 text-gray-900'}`}
                          onClick={() => handleToggleStatus(product)}
                        >
                          {product.status === 'active' ? (
                            <>
                              <Eye className="mr-1 h-3 w-3" />
                              แสดง
                            </>
                          ) : (
                            <>
                              <EyeOff className="mr-1 h-3 w-3" />
                              ซ่อน
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-amber-100 hover:text-orange-600"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-red-100"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                แสดง {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.totalCount)} จาก{' '}
                {pagination.totalCount} รายการ
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <ProductFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        product={selectedProduct}
        categories={categories}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="ลบสินค้า"
        description={`คุณต้องการลบสินค้า "${selectedProduct?.name}" หรือไม่?`}
      />
    </div>
  );
}
