import { shallowEqual } from './utils';

function createFormState({ initialValues, onSubmit }) {
  const formState = {
    fieldSubscribers: {},
    formSubscribers: {
      index: 1,
      entries: {},
    },
    fields: {},
    errors: {},
    initialValues: initialValues && { ...initialValues },
    values: {},
  };

  const asyncValidationPromises = {};
  let asyncValidationkey = 0;

  function registerField(name, validator, dependencies, subscriber) {
    formState.fields[name] = {
      inValidating: 0, //number of running validator
      touched: false,
      validator,
      modifield: false,
    };
    const { fieldSubscribers } = formState;
    if (!fieldSubscribers[name]) {
      fieldSubscribers[name] = { index: 1, entries: {} };
    }
    const index = fieldSubscribers[name].index++;
    fieldSubscribers[name].entries[index] = subscriber;

    if (dependencies) {
      dependencies.forEach(dependency => {
        let dependantFieldSubscribers = formState.fieldSubscribers[dependency];
        if (!dependantFieldSubscribers) {
          dependantFieldSubscribers = { index: 1, entries: {} };
        }
        const index = dependantFieldSubscribers.index++;
        dependantFieldSubscribers.entries[index] = function () {
          runValidation(name);
        };
      });
    }

    formState.values[name] = initialValues && initialValues[name];
  }

  function unregisterField(name) {
    delete formState.fields[name];
    delete formState.fieldSubscribers[name];
  }

  function runValidation(name) {
    formState.errors[name] = undefined;
    const fieldValidator = formState.fields[name].validator;
    if (fieldValidator) {
      const validatePromise = fieldValidator(formState.values);
      if (validatePromise instanceof Promise) {
        setFieldValidating(name, true);
        const nextAsyncValidationkey = asyncValidationkey++;
        asyncValidationPromises[nextAsyncValidationkey] = validatePromise;
        return validatePromise
          .then(error => {
            //if reset form， error should be set to empty
            if (!asyncValidationPromises[nextAsyncValidationkey]) {
              return '';
            }
            formState.errors[name] = error;
            console.log(
              'current validating',
              formState.fields[name].inValidating,
              'current error:',
              error
            );
            return error;
          })
          .finally(() => {
            setFieldValidating(name, false);

            delete asyncValidationPromises[nextAsyncValidationkey];
          });
      } else {
        formState.errors[name] = validatePromise;
        return Promise.resolve(validatePromise);
      }
    } else {
      return Promise.resolve();
    }
  }

  function setFieldValue(name, value) {
    formState.values[name] = value;
    formState.fields[name].modifield = true;
  }

  function setFieldValidating(name, isValidating) {
    if (isValidating) {
      formState.fields[name].inValidating++;
    } else {
      formState.fields[name].inValidating--;
    }
    notifyFieldListeners(name);
  }

  function handleBlur(name, value) {
    formState.fields[name].touched = true;
    const modified = formState.fields[name].modified;
    if (modified) {
      runValidation(name).then(() => {
        notifyFieldListeners(name);
      });
    }
  }

  function handleChange(name, value) {
    const oldValue = formState.values[name];
    if (!shallowEqual(oldValue, value)) {
      setFieldValue(name, value);
      runValidation(name).then(() => {
        notifyFieldListeners(name);
      });
    }
  }

  function getFieldState(name) {
    const { errors, values, fields, initialValues } = formState;
    const field = fields[name];

    return {
      ...field,
      name,
      error: errors[name],
      value: values[name],
      initialValue: initialValues && initialValues[name],
      validating: field.inValidating.toString(),
    };
  }

  function subscribeFormState(subscription, callback) {
    //TODO
  }

  function notify(subscribers, fieldState) {
    Object.keys(subscribers).forEach(key => {
      const subscriber = subscribers[key];
      subscriber(fieldState);
    });
  }

  function notifyFieldListeners(name) {
    notify(formState.fieldSubscribers[name].entries, getFieldState(name));
  }

  function submit(event) {
    event.preventDefault();
    const fields = formState.fields;
    const fieldNames = Object.keys(fields);
    Promise.all(fieldNames.map(fieldnName => runValidation(fieldnName))).then(
      res => {
        let errors = [];
        res.forEach((item, index) => {
          if (item) {
            errors.push(item);
            notifyFieldListeners(fieldNames[index]);
          }
        });
        if (errors.length === 0) {
          onSubmit(formState.values);
        }
      }
    );
  }

  function reset() {
    const { fields, initialValues } = formState;

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      field.inValidating = 0;
      field.touched = false;
    });
    asyncValidationkey = 0;
    for (const key in asyncValidationPromises) {
      delete asyncValidationPromises[key];
    }

    formState.errors = {};
    formState.values = initialValues;
  }

  return {
    ...formState,
    registerField,
    unregisterField,
    handleChange,
    handleBlur,
    submit,
    reset,
    getFieldState,
  };
}

export default createFormState;
