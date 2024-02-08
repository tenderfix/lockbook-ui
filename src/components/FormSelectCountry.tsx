import { FormControl, SelectCountry, SelectCountryProps } from '@abs-safety/lock-book-web-ui';
import { useField } from 'formik';
import React, { FunctionComponent } from 'react';
import { sessionStore } from '../session/session.store';

interface FormSelectCountryProps {
  label: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  error?: boolean;
  errorMessage?: string;
  locale: SelectCountryProps['locale'];
  placeholder?: SelectCountryProps['placeholder'];
}

/**
 * A Wrapper Component around LBWEBUI's `SelectBox` to work with Formik
 *
 * - converts undefined & null to ""
 */
const FormSelectCountry: FunctionComponent<FormSelectCountryProps> = (
  props: FormSelectCountryProps
) => {
  const [field, meta, helpers] = useField(props);

  /**
   * normally `{...field}` would handle setting the value automatically,
   * but Formik can only do this, when onChange passes native event as param (I guess)
   * */
  const onChange = (value: string) => {
    helpers.setValue(value);
    // Bug workaround: validation runs on previous values after `helpers.setTouched(true)` is called
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
      <SelectCountry
        {...field}
        {...props}
        value={field.value ?? ''}
        error={meta.touched && meta.error !== undefined && meta.error !== ''}
        errorMessage={meta.error}
        onChange={onChange}
        onBlur={onBlur}
        locale={sessionStore.locale}
      />
    </FormControl>
  );
};

export default FormSelectCountry;
