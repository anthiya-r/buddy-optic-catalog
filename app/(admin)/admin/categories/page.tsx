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
import { CategoryWithCount } from '@/types/category';
import {
  Edit,
  Eye,
  EyeOff,
  FolderOpen,
  GripVertical,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Dialogs
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithCount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drag and drop
  const [draggedItem, setDraggedItem] = useState<CategoryWithCount | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const response = await api.get<CategoryWithCount[]>(API_URLS.ADMIN.CATEGORIES.LIST);

    if (response.success && response.data) {
      setCategories(response.data);
      setFilteredCategories(response.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (search.trim()) {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [search, categories]);

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
    const response = await api.delete(
      API_URLS.ADMIN.CATEGORIES.DETAIL(selectedCategory.id)
    );

    if (response.success) {
      toast.success('ลบหมวดหมู่สำเร็จ');
      fetchCategories();
    } else {
      toast.error(response.message || 'เกิดข้อผิดพลาด');
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleToggleStatus = async (category: CategoryWithCount) => {
    const response = await api.put(API_URLS.ADMIN.CATEGORIES.DETAIL(category.id), {
      isActive: !category.isActive,
    });

    if (response.success) {
      toast.success(category.isActive ? 'ซ่อนหมวดหมู่แล้ว' : 'แสดงหมวดหมู่แล้ว');
      fetchCategories();
    } else {
      toast.error(response.message || 'เกิดข้อผิดพลาด');
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
    setFilteredCategories(newCategories);
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

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">จัดการหมวดหมู่</h1>
          <p className="text-muted-foreground">
            เพิ่ม แก้ไข ลบ และจัดเรียงหมวดหมู่สินค้า
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setFormDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มหมวดหมู่
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ค้นหา</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาหมวดหมู่..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>ชื่อหมวดหมู่</TableHead>
                  <TableHead className="hidden sm:table-cell">Slug</TableHead>
                  <TableHead className="text-center">จำนวนสินค้า</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
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
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FolderOpen className="h-8 w-8" />
                        <p>ไม่พบหมวดหมู่</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      draggable={!search}
                      onDragStart={() => handleDragStart(category)}
                      onDragOver={(e) => handleDragOver(e, category)}
                      onDrop={() => handleDrop(category)}
                      className={draggedItem?.id === category.id ? 'opacity-50' : ''}
                    >
                      <TableCell>
                        {!search && (
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {category.slug}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{category.productCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.isActive ? 'default' : 'secondary'}
                          className="cursor-pointer"
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
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category)}
                            disabled={category.productCount > 0}
                            title={
                              category.productCount > 0
                                ? 'ไม่สามารถลบได้ เนื่องจากมีสินค้าในหมวดหมู่'
                                : undefined
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Hint */}
      {!loading && filteredCategories.length > 0 && !search && (
        <p className="text-sm text-muted-foreground text-center">
          ลากแถวเพื่อจัดเรียงลำดับหมวดหมู่
        </p>
      )}

      {/* Form Dialog */}
      <CategoryFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        category={selectedCategory}
        onSuccess={fetchCategories}
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
