import React from 'react';
import useField from './useField';
import { useFormContext } from './context';
import PropTypes from 'prop-types';

function Field(props) {
  const { name, validator, children, dependencies } = props;
  const { handleChange, handleBlur, initialValues } = useFormContext();
  const initialvalue = initialValues && initialValues[name];
  const fieldState = useField(name, validator, dependencies, initialvalue);

  const fieldProps = {
    onChange: e => {
      handleChange(name, e.target.value);
    },
    onBlur: e => handleBlur(name),
    value: fieldState.value || '',
    error: fieldState.error,
    validating: fieldState.validating > 0,
  };

  if (children instanceof Array) {
    return <>{children.map(child => React.cloneElement(child, fieldProps))}</>;
  } else if (children instanceof Function) {
    return children(fieldProps);
  } else {
    return React.cloneElement(children, fieldProps);
  }
}

Field.propTypes = {
  /**
   * field name
   */
  name: PropTypes.string,
  /**
   * validator
   */
  validator: PropTypes.func,
  /**
   * while dependant field value changed, validate this field
   */
  dependencies: PropTypes.array,
};

export default Field;
