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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { API_URLS } from '@/constants/url';
import { api } from '@/lib/request';
import { CategoryWithCount } from '@/types/category';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CategoryWithCount | null;
  onSuccess: (data: { category: CategoryWithCount; isEdit: boolean }) => void;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryFormDialogProps) {
  const isEditing = !!category;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        isActive: category.isActive ?? true,
      });
    } else {
      setFormData({
        name: '',
        isActive: true,
      });
    }
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('กรุณากรอกชื่อหมวดหมู่');
      return;
    }

    setIsLoading(true);

    const payload = {
      name: formData.name.trim(),
      isActive: formData.isActive,
    };

    let response;
    if (isEditing) {
      response = await api.put<CategoryWithCount>(API_URLS.ADMIN.CATEGORIES.DETAIL(category.id), payload);
    } else {
      response = await api.post<CategoryWithCount>(API_URLS.ADMIN.CATEGORIES.LIST, payload);
    }

    setIsLoading(false);

    if (response.success && response.data) {
      toast.success(isEditing ? 'แก้ไขหมวดหมู่สำเร็จ' : 'เพิ่มหมวดหมู่สำเร็จ');
      onOpenChange(false);
      onSuccess({ category: response.data, isEdit: isEditing });
    } else {
      toast.error(response.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'แก้ไขข้อมูลหมวดหมู่ตามต้องการ'
              : 'กรอกข้อมูลหมวดหมู่ใหม่ที่ต้องการเพิ่ม'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">ชื่อหมวดหมู่ *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="เช่น แว่นตา, กรอบแว่น"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">สถานะการแสดงผล</Label>
                <p className="text-sm text-muted-foreground">
                  เปิดใช้งานเพื่อแสดงหมวดหมู่บนหน้าเว็บ
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
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
              {isEditing ? 'บันทึก' : 'เพิ่มหมวดหมู่'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
