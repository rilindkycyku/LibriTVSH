import { useState } from "react";
import { evaluate } from "mathjs";
import { validateNumericInput, validateCalculatorInput } from "../utils";

function useInvoiceForm(state, dispatch, setInvoices, invoices, refs, editingInvoice, setEditingInvoice) {
  const {
    furnitoriRef,
    datePickerRef,
    nrFaturesRef,
    vlPaTvshRef,
    tvsh18Ref,
    tvsh8Ref,
    addButtonRef,
    vlPaTvshCalcButtonRef,
    tvsh18CalcButtonRef,
    tvsh8CalcButtonRef,
  } = refs;

  const [calculatorState, setCalculatorState] = useState({
    showCalculator: false,
    calculatorValue: "",
    calculatorError: "",
    currentInput: null,
  });

  const handleFurnitoriChange = async (partneri) => {
    dispatch({
      type: "SET_FURNITORI",
      value: partneri.value,
      selected: partneri,
    });
    document.getElementById("dataEFatures").focus();
  };

  const handleNumericInput = (e, field) => {
    const value = e.target.value;
    const isValid = validateNumericInput(value, field);
    const num = parseFloat(value);
    const numericValue = isNaN(num) ? 0 : num;
    dispatch({
      type: "SET_NUMERIC",
      field,
      value: numericValue,
      input: value,
      error: isValid ? "" : "Lejohen vetëm numra, pika dhjetore dhe shenja negative.",
      total: calculateTotal(field, numericValue),
    });
  };

  const calculateTotal = (field, value) => {
    const fields = { ...state, [field]: value };
    return fields.vlPaTvsh + fields.tvsh18 + fields.tvsh8;
  };

  const handleAdd = () => {
    if (!state.furnitori || !state.data || !state.nrFatures.trim()) {
      dispatch({ type: "SET_SHOW_ALERT", payload: true });
      furnitoriRef.current.focus();
      return;
    }
    if (state.vlPaTvshError || state.tvsh18Error || state.tvsh8Error) {
      return;
    }
    dispatch({ type: "SET_SHOW_ALERT", payload: false });

    const newItem = {
      id: editingInvoice ? editingInvoice.id : Date.now(),
      furnitori: state.furnitori,
      data: state.data,
      nrFatures: state.nrFatures,
      vlPaTvsh: state.vlPaTvsh,
      tvsh18: state.tvsh18,
      tvsh8: state.tvsh8,
      total: state.total,
    };

    if (editingInvoice) {
      console.log("Perditesimi i Fatures:", newItem);
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === editingInvoice.id ? newItem : invoice
        )
      );
      setEditingInvoice(null);
    } else {
      console.log("Duke shtuar faturen e re:", newItem);
      setInvoices([newItem, ...invoices]);
    }
    dispatch({ type: "RESET_FORM" });
    furnitoriRef.current.focus();
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      } else {
        handleAdd();
      }
    }
  };

  const handleFurnitoriKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const selectInstance = furnitoriRef.current;
      if (
        selectInstance.state.menuIsOpen &&
        selectInstance.state.focusedOption
      ) {
        dispatch({
          type: "SET_FURNITORI",
          value: selectInstance.state.focusedOption.value,
          selected: selectInstance.state.focusedOption,
        });
        setTimeout(() => datePickerRef.current.focus(), 0);
      } else if (state.furnitori) {
        datePickerRef.current.focus();
      }
    }
  };

  const openCalculator = (inputField, currentValue) => {
    setCalculatorState({
      showCalculator: true,
      calculatorValue: currentValue || "",
      calculatorError: "",
      currentInput: inputField,
    });
  };

  const closeCalculator = () => {
    setCalculatorState((prev) => ({
      ...prev,
      showCalculator: false,
      calculatorValue: "",
      calculatorError: "",
      currentInput: null,
    }));
  };

  const applyCalculatorValue = () => {
    if (!validateCalculatorInput(calculatorState.calculatorValue)) {
      setCalculatorState((prev) => ({
        ...prev,
        calculatorError:
          "Nuk lejohen shkronjat. Përdorni vetëm numra dhe operatorë (+, -, *, /).",
      }));
      return;
    }
    try {
      const result = evaluate(calculatorState.calculatorValue);
      const num = parseFloat(result);
      if (!isNaN(num)) {
        const field = calculatorState.currentInput;
        const calcButtonRef =
          field === "vlPaTvsh"
            ? vlPaTvshCalcButtonRef
            : field === "tvsh18"
            ? tvsh18CalcButtonRef
            : tvsh8CalcButtonRef;
        if (calcButtonRef.current) {
          calcButtonRef.current.blur();
          console.log(`Blurred ${field} calculator button`);
        }
        dispatch({
          type: "SET_CALCULATOR",
          field,
          value: num,
          input: num.toString(),
          total: calculateTotal(field, num),
        });
        setCalculatorState((prev) => ({ ...prev, showCalculator: false }));
        setTimeout(() => {
          const nextRef =
            field === "vlPaTvsh"
              ? tvsh18Ref
              : field === "tvsh18"
              ? tvsh8Ref
              : addButtonRef;
          if (nextRef.current) {
            console.log(`Focusing ${field === "vlPaTvsh" ? "TVSH 18%" : field === "tvsh18" ? "TVSH 8%" : "Shtoni/Përditëso Faturen"}`);
            nextRef.current.focus();
          } else {
            console.error(`${field === "vlPaTvsh" ? "tvsh18Ref" : field === "tvsh18" ? "tvsh8Ref" : "addButtonRef"} is not available`);
          }
        }, 200);
      } else {
        setCalculatorState((prev) => ({
          ...prev,
          calculatorError: "Rezultat i pavlefshëm i llogaritjes.",
        }));
      }
    } catch (error) {
      setCalculatorState((prev) => ({
        ...prev,
        calculatorError: "Shprehje e pavlefshme. Ju lutem kontrolloni hyrjen tuaj.",
      }));
      console.error("Calculator error:", error);
    }
  };

  const handleCalculatorInputChange = (e) => {
    const value = e.target.value;
    setCalculatorState((prev) => ({
      ...prev,
      calculatorValue: value,
      calculatorError: validateCalculatorInput(value)
        ? ""
        : "Nuk lejohen shkronjat. Përdorni vetëm numra dhe operatorë (+, -, *, /).",
    }));
  };

  const handleCalculatorKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyCalculatorValue();
    }
  };

  return {
    handleFurnitoriChange,
    handleNumericInput,
    handleAdd,
    handleKeyDown,
    handleFurnitoriKeyDown,
    openCalculator,
    applyCalculatorValue,
    closeCalculator,
    handleCalculatorInputChange,
    handleCalculatorKeyDown,
    calculatorState,
  };
}

export default useInvoiceForm;