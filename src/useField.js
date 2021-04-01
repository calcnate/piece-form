import React from 'react';
import { useFormContext } from './context';

function useField(name, validator, dependencies, initialValue) {
  const { registerField } = useFormContext();

  const [state, setstate] = React.useState({
    value: initialValue,
  });

  React.useEffect(() => {
    registerField(name, validator, dependencies, newState => {
      setstate(newState);
    });
  }, [name, validator, dependencies, registerField]);

  return state;
}

export default useField;
