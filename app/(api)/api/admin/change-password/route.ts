import { withAuth } from '@/lib/api-auth';
import { errorResponse, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { hashPassword, verifyPassword } from 'better-auth/crypto';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'กรุณากรอกรหัสผ่านปัจจุบัน'),
  newPassword: z
    .string()
    .min(8, 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร')
    .max(100, 'รหัสผ่านต้องไม่เกิน 100 ตัวอักษร'),
});

async function handler(request: NextRequest, context: {}, userId: string) {
  try {
    const body = await request.json();
    const validation = changePasswordSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { currentPassword, newPassword } = validation.data;

    // Get user's current account (better-auth stores password in account table)
    const account = await prisma.account.findFirst({
      where: {
        userId: userId,
        providerId: 'credential',
      },
    });

    if (!account || !account.password) {
      return errorResponse('ไม่พบข้อมูลบัญชี', 404);
    }

    // Verify current password
    const isValidPassword = await verifyPassword({
      hash: account.password,
      password: currentPassword,
    });

    if (!isValidPassword) {
      return errorResponse('รหัสผ่านปัจจุบันไม่ถูกต้อง', 400);
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashedNewPassword },
    });

    return successResponse(null, 'เปลี่ยนรหัสผ่านสำเร็จ');
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน', 500);
  }
}

export const POST = withAuth(handler);
