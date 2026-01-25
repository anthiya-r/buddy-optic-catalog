import z from 'zod';

export const authSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(32, 'Username must be at most 32 characters.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(100, 'Password must be at most 100 characters.'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'กรุณากรอกรหัสผ่านปัจจุบัน'),
    newPassword: z
      .string()
      .min(8, 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร')
      .max(100, 'รหัสผ่านต้องไม่เกิน 100 ตัวอักษร'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'รหัสผ่านใหม่ไม่ตรงกัน',
    path: ['confirmNewPassword'],
  });
