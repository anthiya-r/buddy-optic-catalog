'use client';

import PasswordField from '@/components/form/password-field';
import TextField from '@/components/form/text-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { authSchema as formSchema } from '@/schema/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const LoginSection = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (isLoading) return;

    setIsLoading(true);

    const { error } = await authClient.signIn.username({
      username: data.username,
      password: data.password,
    });

    if (error) {
      toast.error('Username หรือ Password ไม่ถูกต้อง');
      setIsLoading(false);
      return;
    }

    toast.success('เข้าสู่ระบบสำเร็จ');
    setIsRedirecting(true);

    setTimeout(() => {
      router.replace('/admin/dashboard');
    }, 600);
  }

  return (
    <Card className="w-full max-w-lg rounded-2xl shadow-lg mx-auto border-amber-200 bg-white">
      <CardHeader className="pb-2 text-center bg-linear-to-b from-amber-50 to-transparent">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Buddy Optical</h1>
      </CardHeader>

      <CardContent className="space-y-6 w-full pt-8">
        <h2 className="text-center text-2xl font-semibold text-slate-900">LOG IN</h2>

        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <TextField
              form={form}
              name="username"
              label="Username"
              placeholder="Username"
              icon={<User className="h-4 w-4" />}
              disabled={isLoading || isRedirecting}
            />

            <PasswordField
              form={form}
              name="password"
              label="Password"
              placeholder="Password"
              disabled={isLoading || isRedirecting}
            />
          </FieldGroup>
        </form>

        <Button
          type="submit"
          form="login-form"
          size="lg"
          disabled={isLoading || isRedirecting}
          className="w-full rounded-full text-base font-semibold flex items-center justify-center gap-2"
        >
          {isLoading && <Spinner className="h-4 w-4" />}
          {isRedirecting
            ? 'กำลังพาไปหน้า Dashboard...'
            : isLoading
              ? 'กำลังเข้าสู่ระบบ...'
              : 'LOG IN'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoginSection;
