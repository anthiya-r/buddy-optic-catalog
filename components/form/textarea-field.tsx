import { cn } from '@/lib/utils';
import { Controller, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Textarea } from '../ui/textarea';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  htmlFor?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  rows?: number;
};

const TextareaField = <T extends FieldValues>({
  form,
  name,
  label,
  htmlFor,
  placeholder,
  className,
  rows = 4,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn('w-full', className)}>
          {label && <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>}
          <Textarea
            {...field}
            id={htmlFor}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            rows={rows}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default TextareaField;
