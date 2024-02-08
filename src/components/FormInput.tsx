import { FormControl, Input } from '@abs-safety/lock-book-web-ui';
import { useField } from 'formik';
import React, { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface FormInputProps {
  label: string;
  name: string;
  type: 'text' | 'password' | 'email' | 'number' | 'file';
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  id?: string;
  isHeading?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

/**
 * A Wrapper Component around LBWEBUI's `Input` to work with Formik
 *
 * - converts undefined & null to ""
 * - shows error only when input is touched
 * - when no placeholder: create placeholder out of props.label
 */
const FormInput: FunctionComponent<FormInputProps> = (props: FormInputProps) => {
  const [field, meta] = useField(props);
  const { t } = useTranslation();
  const isRequired = props.required ?? true;

  const placeholder = useMemo(() => {
    if (props.placeholder !== undefined) {
      return props.placeholder;
    }

    const prefix = t('form.placeholder_before');
    const suffix = t('form.placeholder_after');

    return [prefix, props.label, suffix].join(' ');
  }, [t, props.label, props.placeholder]);

  return (
    <FormControl size={props.size}>
      <Input
        {...field}
        label={props.label}
        labelSuffix={!isRequired ? t('form.optional') : undefined}
        type={props.type}
        value={field.value ?? ''}
        isHeading={props.isHeading ?? false}
        error={meta.touched && meta.error !== undefined && meta.error !== ''}
        errorMessage={meta.error}
        placeholder={placeholder}
        readOnly={props.readOnly ?? false}
        required={isRequired}
      />
    </FormControl>
  );
};

export default FormInput;
