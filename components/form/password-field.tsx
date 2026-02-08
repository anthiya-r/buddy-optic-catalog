'use client';

import { cn } from '@/lib/utils';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { Controller, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  htmlFor?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
};

const PasswordField = <T extends FieldValues>({
  form,
  name,
  label,
  htmlFor,
  placeholder,
  className,
  disabled = false,
}: Props<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn('w-full', className)}>
          {label && <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>}
          <div className="relative">
            <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
              <KeyRound className="h-4 w-4" />
            </div>
            <Input
              {...field}
              id={htmlFor}
              type={showPassword ? 'text' : 'password'}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              className="px-10"
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default PasswordField;
