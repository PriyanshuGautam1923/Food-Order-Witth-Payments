import { useState } from "react";
const useInput = function (validation) {
  const [enteredValue, setEnteredValue] = useState("");
  const [enteredValueIsTouched, setEnteredValueIsTouched] = useState(false);
  const enteredValueIsValid = validation(enteredValue);
  const valueHasError = enteredValueIsTouched && !enteredValueIsValid;

  const valueChangeHandler = function (event) {
    setEnteredValueIsTouched(true);
    setEnteredValue(event.target.value);
  };
  const valueBlurHandler = function (event) {
    setEnteredValueIsTouched(true);
  };
  //   const valueClasses = !valueHasError ? "form-control" : "form-control invalid";
  const reset = function () {
    setEnteredValue("");
    setEnteredValueIsTouched(false);
  };
  return {
    enteredValue,
    valueChangeHandler,
    valueBlurHandler,
    valueHasError,
    reset,
  };
};

export default useInput;
