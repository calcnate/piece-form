import React from 'react';
import { useFormContext } from './context';

function useField(name, validator, initialValue) {
  const { registerField } = useFormContext();

  const [state, setstate] = React.useState({
    value: initialValue,
  });

  React.useEffect(() => {
    registerField(name, validator, newState => {
      setstate(newState);
    });
  }, [name, validator, registerField]);

  return state;
}

export default useField;
