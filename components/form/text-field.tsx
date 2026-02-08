import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
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
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
};

const TextField = <T extends FieldValues>({
  form,
  name,
  label,
  htmlFor,
  placeholder,
  className,
  icon,
  iconPosition = 'left',
  disabled = false,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn('w-full', className)}>
          {label && <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>}
          {icon ? (
            <div className="relative">
              {iconPosition === 'left' && (
                <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                  {icon}
                </div>
              )}
              <Input
                {...field}
                id={htmlFor}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  iconPosition === 'left' && 'pl-10',
                  iconPosition === 'right' && 'pr-10',
                )}
              />
              {iconPosition === 'right' && (
                <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">
                  {icon}
                </div>
              )}
            </div>
          ) : (
            <Input
              {...field}
              id={htmlFor}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              disabled={disabled}
            />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default TextField;
