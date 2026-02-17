'use client';

import PasswordField from '@/components/form/password-field';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { API_URLS } from '@/constants/url';
import { api } from '@/lib/request';
import { changePasswordSchema } from '@/schema/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  async function onSubmit(data: z.infer<typeof changePasswordSchema>) {
    setIsLoading(true);

    const response = await api.post(API_URLS.ADMIN.CHANGE_PASSWORD, {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });

    setIsLoading(false);

    if (!response.success) {
      toast.error(response.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      return;
    }

    toast.success('เปลี่ยนรหัสผ่านสำเร็จ');
    form.reset();
    router.push('/admin/dashboard');
  }

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับหน้าแดชบอร์ด
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">เปลี่ยนรหัสผ่าน</h1>
        <p className="text-muted-foreground">
          เปลี่ยนรหัสผ่านสำหรับเข้าสู่ระบบ
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            ตั้งรหัสผ่านใหม่
          </CardTitle>
          <CardDescription>
            กรอกรหัสผ่านปัจจุบันและรหัสผ่านใหม่ที่ต้องการ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <PasswordField
                form={form}
                name="currentPassword"
                label="รหัสผ่านปัจจุบัน"
                placeholder="กรอกรหัสผ่านปัจจุบัน"
              />
            </FieldGroup>

            <FieldGroup>
              <PasswordField
                form={form}
                name="newPassword"
                label="รหัสผ่านใหม่"
                placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)"
              />
              <PasswordField
                form={form}
                name="confirmNewPassword"
                label="ยืนยันรหัสผ่านใหม่"
                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              />
            </FieldGroup>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                ยกเลิก
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
