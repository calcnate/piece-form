import React from 'react';
import { FormProvider } from './context';
import createFormState from './state';
import PropTypes from 'prop-types';

function Form(props) {
  const { initialValues, children, onSubmit } = props;

  const formState = createFormState({ initialValues, onSubmit });
  const { submit } = formState;
  return (
    <FormProvider value={formState}>
      <form onSubmit={submit}>{children}</form>
    </FormProvider>
  );
}

Form.propTypes = {
  /**
   * initialValues for fields
   */
  initialValues: PropTypes.object,
  /**
   * submit callback
   */
  onSubmit: PropTypes.func,
};

export default Form;
