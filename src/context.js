import React from "react";

export const FormContext = React.createContext({});
FormContext.displayName = "FormContext";

export const FormProvider = FormContext.Provider;

export const FormConsumer = FormContext.Consumer;

export function useFormContext() {
  const formContext = React.useContext(FormContext);
  return formContext;
}
