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
