import { useState } from "react";
import { evaluate } from "mathjs";
import { validateNumericInput, validateCalculatorInput } from "../utils";
import { prefiksetPer, resolvePrefix } from "../utils/prefikset";

/**
 * Vlera e re e Nr. Faturës kur ndryshon prefiksi.
 * Kthen `null` nëse përdoruesi e ka shkruar vetë numrin — atëherë nuk e prekim.
 */
function swapPrefix(nrFatures, appliedPrefix, newPrefix) {
  if (appliedPrefix && nrFatures.startsWith(appliedPrefix)) {
    return newPrefix + nrFatures.slice(appliedPrefix.length);
  }
  if (!nrFatures.trim()) return newPrefix;
  return null;
}

function useInvoiceForm(state, dispatch, setInvoices, invoices, refs, editingInvoice, setEditingInvoice, prefiksetIndex) {
  const {
    furnitoriRef,
    datePickerRef,
    nrFaturesRef,
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

  /** Vendos kursorin në fund të Nr. Faturës, që përdoruesi të shkruajë pjesën që mbetet. */
  const caretToEnd = () => {
    setTimeout(() => {
      const input = nrFaturesRef.current;
      if (!input) return;
      const end = input.value.length;
      try {
        input.setSelectionRange(end, end);
      } catch {
        /* disa lloje input-esh nuk e mbështesin */
      }
    }, 0);
  };

  const selectFurnitori = (partneri) => {
    const prefikset = prefiksetPer(prefiksetIndex, partneri.value, partneri.label);
    const prefiksi = prefikset.length ? resolvePrefix(prefikset[0].prefiksi, state.data) : "";
    const nrFatures = swapPrefix(state.nrFatures, state.nrFaturesPrefix, prefiksi);

    dispatch({
      type: "SET_FURNITORI",
      value: partneri.value,
      selected: partneri,
      prefikset,
      // `null` = numri është shkruar me dorë, nuk e mbishkruajmë
      nrFatures: nrFatures === null ? state.nrFatures : nrFatures,
      nrFaturesPrefix: nrFatures === null ? state.nrFaturesPrefix : prefiksi,
    });
  };

  const handleFurnitoriChange = (partneri) => {
    selectFurnitori(partneri);
    datePickerRef.current?.focus();
  };

  /** Prefiksi përmban vitin ({YY}/{YYYY}), ndaj rifreskohet kur ndryshon data. */
  const handleDataChange = (value) => {
    const template = state.prefiksetOptions.find(
      (p) => resolvePrefix(p.prefiksi, state.data) === state.nrFaturesPrefix
    );
    const prefiksi = template ? resolvePrefix(template.prefiksi, value) : state.nrFaturesPrefix;
    const nrFatures = swapPrefix(state.nrFatures, state.nrFaturesPrefix, prefiksi);

    dispatch({
      type: "SET_DATA",
      value,
      nrFatures: nrFatures === null ? state.nrFatures : nrFatures,
      nrFaturesPrefix: nrFatures === null ? state.nrFaturesPrefix : prefiksi,
    });
  };

  const handleNrFaturesChange = (value) => {
    dispatch({
      type: "SET_NR_FATURES",
      value,
      // nëse përdoruesi e fshin prefiksin, ndalojmë ta ndjekim
      nrFaturesPrefix:
        state.nrFaturesPrefix && value.startsWith(state.nrFaturesPrefix)
          ? state.nrFaturesPrefix
          : "",
    });
  };

  /** Klik mbi një prefiks alternativ: ruhet pjesa e shkruar, ndërrohet vetëm prefiksi. */
  const applyPrefiks = (template) => {
    const prefiksi = resolvePrefix(template, state.data);
    const rest =
      state.nrFaturesPrefix && state.nrFatures.startsWith(state.nrFaturesPrefix)
        ? state.nrFatures.slice(state.nrFaturesPrefix.length)
        : "";
    dispatch({
      type: "SET_NR_FATURES",
      value: prefiksi + rest,
      nrFaturesPrefix: prefiksi,
    });
    nrFaturesRef.current?.focus();
    caretToEnd();
  };

  const handleNumericInput = (e, field) => {
    const value = e.target.value;
    const isValid = validateNumericInput(value);
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
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === editingInvoice.id ? newItem : invoice
        )
      );
      setEditingInvoice(null);
    } else {
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
        if (nextRef === nrFaturesRef) caretToEnd();
      } else {
        handleAdd();
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
            nextRef.current.focus();
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
    handleDataChange,
    handleNrFaturesChange,
    applyPrefiks,
    caretToEnd,
    handleNumericInput,
    handleAdd,
    handleKeyDown,
    openCalculator,
    applyCalculatorValue,
    closeCalculator,
    handleCalculatorInputChange,
    handleCalculatorKeyDown,
    calculatorState,
  };
}

export default useInvoiceForm;