'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { API_URLS } from '@/constants/url';
import { api } from '@/lib/request';
import { Category, Product } from '@/types/product';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  categories: Category[];
  onSuccess: (data: { product: Product; isEdit: boolean }) => void;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSuccess,
}: ProductFormDialogProps) {
  const isEditing = !!product;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    images: [] as string[],
    size: '',
    categoryId: '',
    status: 'active' as 'active' | 'hidden',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        color: product.color,
        images: product.images ? product.images.split(',').filter(Boolean) : [],
        size: product.size,
        categoryId: product.categoryId,
        status: product.status,
      });
    } else {
      setFormData({
        name: '',
        color: '',
        images: [],
        size: '',
        categoryId: categories[0]?.id || '',
        status: 'active',
      });
    }
  }, [product, categories, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('กรุณากรอกชื่อสินค้า');
      return;
    }

    if (!formData.color.trim()) {
      toast.error('กรุณากรอกสี');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป');
      return;
    }

    if (!formData.categoryId) {
      toast.error('กรุณาเลือกหมวดหมู่');
      return;
    }

    setIsLoading(true);

    const payload = {
      name: formData.name.trim(),
      color: formData.color.trim(),
      images: formData.images.join(','),
      categoryId: formData.categoryId,
      size: formData.size,
      status: formData.status,
    };

    let response;
    if (isEditing) {
      response = await api.put<Product>(API_URLS.ADMIN.PRODUCTS.DETAIL(product.id), payload);
    } else {
      response = await api.post<Product>(API_URLS.ADMIN.PRODUCTS.LIST, payload);
    }

    setIsLoading(false);

    if (response.success && response.data) {
      toast.success(isEditing ? 'แก้ไขสินค้าสำเร็จ' : 'เพิ่มสินค้าสำเร็จ');
      onOpenChange(false);
      onSuccess({ product: response.data, isEdit: isEditing });
    } else {
      toast.error(response.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'แก้ไขข้อมูลสินค้าตามต้องการ' : 'กรอกข้อมูลสินค้าใหม่ที่ต้องการเพิ่ม'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">ชื่อสินค้า *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="กรอกชื่อสินค้า"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="color">สี *</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="เช่น ดำ, น้ำตาล, ทอง"
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">หมวดหมู่ *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="size">ขนาด *</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="54-18-143"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">สถานะ</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'hidden') =>
                    setFormData({ ...formData, status: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">แสดง</SelectItem>
                    <SelectItem value="hidden">ซ่อน</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>รูปภาพสินค้า *</Label>
              <ImageUpload
                value={formData.images}
                onChange={(urls) => setFormData({ ...formData, images: urls })}
                maxImages={5}
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'บันทึก' : 'เพิ่มสินค้า'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
