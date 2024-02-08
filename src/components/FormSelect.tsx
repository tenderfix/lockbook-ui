import { FormControl, SelectBox, SelectBoxProps } from '@abs-safety/lock-book-web-ui';
import { useField } from 'formik';
import React, { FunctionComponent } from 'react';

interface FormSelectProps {
  label: string;
  name: string;
  options: SelectBoxProps['options'];
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  error?: boolean;
  errorMessage?: string;
}

/**
 * A Wrapper Component around LBWEBUI's `SelectBox` to work with Formik
 *
 * - converts undefined & null to ""
 */
const FormSelect: FunctionComponent<FormSelectProps> = (props: FormSelectProps) => {
  const [field, meta, helpers] = useField(props);

  /**
   * normaly `{...field}` would handle setting the value automatically,
   * but Formik can only do this, when onChange passes native event as param (I guess)
   * */
  const onChange = (value: string) => {
    helpers.setValue(value);
    // Bug workaround: validation runs on previou values after `helpers.setTouched(true)` is called
    // so it would still show an error for the previous selected item after selecting a new one.
    // That's why we use `setTimeout()` to call `setTouched()` async after Formik has new value
    // see issue: https://github.com/formium/formik/issues/2083
    setTimeout(() => helpers.setTouched(true));
  };

  const onBlur = () => {
    helpers.setTouched(true);
  };

  return (
    <FormControl size={props.size}>
      <SelectBox
        {...field}
        {...props}
        value={field.value ?? ''}
        error={meta.touched && meta.error !== undefined && meta.error !== ''}
        errorMessage={meta.error}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FormControl>
  );
};

export default FormSelect;
