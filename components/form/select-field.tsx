import { cn } from '@/lib/utils';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  htmlFor?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  description?: string;
  options?: { value: string; label: string }[];
};

const SelectField = <T extends FieldValues>({
  form,
  name,
  htmlFor,
  placeholder,
  label,
  className,
  description,
  options,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field orientation="responsive" data-invalid={fieldState.invalid}>
          <FieldContent>
            {label && <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>}
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
          <Select name={field.name} value={field.value.toString()} onValueChange={field.onChange}>
            <SelectTrigger
              id={htmlFor}
              aria-invalid={fieldState.invalid}
              className={cn('min-w-30', className)}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
};

export default SelectField;
