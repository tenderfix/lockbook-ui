import { FunctionComponent, useEffect, useCallback, useRef } from 'react';
import { connect, FormikContextType, FormikProps } from 'formik';
import { debounce } from 'lodash';

// we could define which values the form has - but we don't need to know in this Component
type FormValues = { [key: string]: string };

// interface FormAutoSaveProps {
interface OuterProps {
  /** after how many ms of not typing / changing form, the form should get submitted? (default: 1000) */
  debounce?: number;
}

type FormikPartProps = {
  // we could define as generic which values the form has - but we don't need to know in this Component
  formik: FormikContextType<{ [key: string]: string }>;
};

/**
 * This React FunctionComponent can be placed inside a `<Formik>` node, to automatically trigger
 * the Formik onSubmit function when:
 * - form values changed and no changes are done for `{props.debounce}`ms (debounce treshold time)
 *
 * The debounce time is used, to collect changes and send them together instead of submitting changes on each Input.onChange
 */
const FormAutoSubmit: FunctionComponent<OuterProps & FormikPartProps> = (
  props: OuterProps & FormikPartProps
) => {
  const firstRenderRef = useRef(true);
  // whenever values of form change...
  useEffect(() => {
    // ... and it's not when the form gets loaded for first time ...
    if (!firstRenderRef.current) {
      // ... submit form (debounced)
      submitFormDebounced(props.formik);
    }
    firstRenderRef.current = false;
  }, [props.formik.values]);

  // submit form (debounced) (-> execute submitFn only when submitFormDebounced() wasn't called for a certain time)
  const submitFormDebounced = useCallback(
    // disable unused var rule, to show the possibility, in case we want to do sth. in future with the form values etc.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    debounce((data: FormikProps<FormValues>) => {
      props.formik
        .submitForm()
        .then((res) => {
          // TODO: should we pass a success handler from parent (form)
          // or should we actually ignore it here and handle success && error only in PageStore which can be displayed in Form Components?
          console.log('FormAutoSave: submitFn finished', res);
        })
        .catch((error) => {
          console.error('FormAutoSave: submitFn error', error);
        });
    }, props.debounce),
    []
  );

  return null;
};

FormAutoSubmit.defaultProps = {
  debounce: 1000,
};

export default connect<OuterProps, FormValues>(FormAutoSubmit);
