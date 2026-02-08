'use client';

import { CategoryFormDialog } from '@/components/admin/category-form-dialog';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { CategoriesResponse, CategoryWithCount } from '@/types/category';
import { ChevronLeft, ChevronRight, Edit, Eye, EyeOff, FolderOpen, GripVertical, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  });

  // Dialogs
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithCount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drag and drop
  const [draggedItem, setDraggedItem] = useState<CategoryWithCount | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', pagination.page.toString());
    params.set('limit', pagination.limit.toString());
    if (search) params.set('search', search);

    const response = await api.get<CategoriesResponse>(
      `${API_URLS.ADMIN.CATEGORIES.LIST}?${params.toString()}`
    );

    if (response.success && response.data) {
      setCategories(response.data.categories);
      setPagination((prev) => ({
        ...prev,
        totalCount: response.data!.pagination.totalCount,
        totalPages: response.data!.pagination.totalPages,
      }));
    }
    setLoading(false);
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleEdit = (category: CategoryWithCount) => {
    setSelectedCategory(category);
    setFormDialogOpen(true);
  };

  const handleDelete = (category: CategoryWithCount) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    setIsDeleting(true);
    const response = await api.delete(API_URLS.ADMIN.CATEGORIES.DETAIL(selectedCategory.id));

    if (response.success) {
      toast.success('ลบหมวดหมู่สำเร็จ');
      // Update state directly instead of re-fetching
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      setPagination((prev) => ({
        ...prev,
        totalCount: prev.totalCount - 1,
      }));
    } else {
      toast.error(response.message || 'เกิดข้อผิดพลาด');
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleToggleStatus = async (category: CategoryWithCount) => {
    const response = await api.put<CategoryWithCount>(API_URLS.ADMIN.CATEGORIES.DETAIL(category.id), {
      isActive: !category.isActive,
    });

    if (response.success && response.data) {
      toast.success(category.isActive ? 'ซ่อนหมวดหมู่แล้ว' : 'แสดงหมวดหมู่แล้ว');
      // Update state directly instead of re-fetching
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? response.data! : c))
      );
    } else {
      toast.error(response.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleFormSuccess = ({ category, isEdit }: { category: CategoryWithCount; isEdit: boolean }) => {
    if (isEdit) {
      // Update state directly for edit
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? category : c))
      );
    } else {
      // Re-fetch for create to get proper pagination
      fetchCategories();
    }
  };

  const handleDragStart = (category: CategoryWithCount) => {
    setDraggedItem(category);
  };

  const handleDragOver = (e: React.DragEvent, category: CategoryWithCount) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === category.id) return;
  };

  const handleDrop = async (targetCategory: CategoryWithCount) => {
    if (!draggedItem || draggedItem.id === targetCategory.id) return;

    const newCategories = [...categories];
    const draggedIndex = newCategories.findIndex((c) => c.id === draggedItem.id);
    const targetIndex = newCategories.findIndex((c) => c.id === targetCategory.id);

    // Remove dragged item
    const [removed] = newCategories.splice(draggedIndex, 1);
    // Insert at target position
    newCategories.splice(targetIndex, 0, removed);

    // Update local state immediately
    setCategories(newCategories);
    setDraggedItem(null);

    // Build reorder payload
    const orders = newCategories.map((cat, index) => ({
      id: cat.id,
      sortOrder: index,
    }));

    const response = await api.put(API_URLS.ADMIN.CATEGORIES.REORDER, { orders });

    if (response.success) {
      toast.success('เรียงลำดับหมวดหมู่สำเร็จ');
    } else {
      toast.error(response.message || 'เกิดข้อผิดพลาด');
      fetchCategories(); // Revert on error
    }
  };

  // Check if drag is allowed (not searching and on first page)
  const isDragAllowed = !search && pagination.page === 1;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">จัดการหมวดหมู่</h1>
          <p className="text-slate-500">เพิ่ม แก้ไข ลบ และจัดเรียงหมวดหมู่สินค้า</p>
        </div>
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setFormDialogOpen(true);
          }}
          className="rounded-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มหมวดหมู่
        </Button>
      </div>

      {/* Search */}
      <Card className="border-amber-100 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">ค้นหา</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="ค้นหาชื่อหมวดหมู่หรือ slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 border-amber-200 bg-white focus:ring-orange-400"
              />
            </div>
            <Button onClick={handleSearch} variant="secondary">
              <Search className="mr-2 h-4 w-4" />
              ค้นหา
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card className="border-amber-100 bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-amber-50">
                <TableRow className="border-amber-100 hover:bg-amber-50">
                  <TableHead className="w-12 text-slate-700"></TableHead>
                  <TableHead className="text-slate-700">ชื่อหมวดหมู่</TableHead>
                  <TableHead className="hidden sm:table-cell text-slate-700">Slug</TableHead>
                  <TableHead className="text-center text-slate-700">จำนวนสินค้า</TableHead>
                  <TableHead className="text-slate-700">สถานะ</TableHead>
                  <TableHead className="text-right text-slate-700">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-amber-100 hover:bg-amber-50/50">
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-500">
                        <FolderOpen className="h-8 w-8" />
                        <p>ไม่พบหมวดหมู่</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow
                      key={category.id}
                      draggable={isDragAllowed}
                      onDragStart={() => handleDragStart(category)}
                      onDragOver={(e) => handleDragOver(e, category)}
                      onDrop={() => handleDrop(category)}
                      className={draggedItem?.id === category.id ? 'opacity-50' : ''}
                    >
                      <TableCell>
                        {isDragAllowed && (
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{category.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-slate-500">
                        {category.slug}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-amber-100 text-orange-900">
                          {category.productCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.isActive ? 'default' : 'secondary'}
                          className={`cursor-pointer ${category.isActive ? 'bg-green-100 text-green-900 hover:bg-green-200' : 'bg-gray-100 text-gray-900'}`}
                          onClick={() => handleToggleStatus(category)}
                        >
                          {category.isActive ? (
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
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-red-100"
                            onClick={() => handleDelete(category)}
                            disabled={category.productCount > 0}
                            title={
                              category.productCount > 0
                                ? 'ไม่สามารถลบได้ เนื่องจากมีสินค้าในหมวดหมู่'
                                : undefined
                            }
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

      {/* Hint */}
      {!loading && categories.length > 0 && isDragAllowed && (
        <p className="text-sm text-muted-foreground text-center">
          ลากแถวเพื่อจัดเรียงลำดับหมวดหมู่
        </p>
      )}

      {/* Form Dialog */}
      <CategoryFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        category={selectedCategory}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="ลบหมวดหมู่"
        description={`คุณต้องการลบหมวดหมู่ "${selectedCategory?.name}" หรือไม่?`}
      />
    </div>
  );
}
