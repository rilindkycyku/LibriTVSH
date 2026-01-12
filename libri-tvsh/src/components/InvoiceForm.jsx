import { useReducer, useRef, useEffect } from "react";
import { Form, Card, Button, InputGroup, Alert } from "react-bootstrap";
import Select from "react-select";
import CalculatorModal from "./CalculatorModal";
import useInvoiceForm from "../hooks/useInvoiceForm";

const initialState = {
  furnitori: "",
  data: "2026-01-20",
  nrFatures: "",
  vlPaTvsh: 0,
  vlPaTvshInput: "",
  vlPaTvshError: "",
  tvsh18: 0,
  tvsh18Input: "",
  tvsh18Error: "",
  tvsh8: 0,
  tvsh8Input: "",
  tvsh8Error: "",
  total: 0,
  showAlert: false,
  optionsSelected: null,
};

function InvoiceForm({ invoices, setInvoices, furnitoriOptions, editingInvoice, setEditingInvoice }) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const {
    furnitori,
    data,
    nrFatures,
    vlPaTvsh,
    vlPaTvshInput,
    vlPaTvshError,
    tvsh18,
    tvsh18Input,
    tvsh18Error,
    tvsh8,
    tvsh8Input,
    tvsh8Error,
    total,
    showAlert,
    optionsSelected,
  } = state;

  const furnitoriRef = useRef();
  const datePickerRef = useRef();
  const nrFaturesRef = useRef();
  const vlPaTvshRef = useRef();
  const tvsh18Ref = useRef();
  const tvsh8Ref = useRef();
  const addButtonRef = useRef();
  const vlPaTvshCalcButtonRef = useRef();
  const tvsh18CalcButtonRef = useRef();
  const tvsh8CalcButtonRef = useRef();

  const {
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
  } = useInvoiceForm(
    state,
    dispatch,
    setInvoices,
    invoices,
    {
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
    },
    editingInvoice,
    setEditingInvoice
  );

  useEffect(() => {
    if (editingInvoice) {
      console.log("Populating form with invoice:", editingInvoice);
      dispatch({
        type: "SET_EDIT_INVOICE",
        payload: editingInvoice,
      });
      furnitoriRef.current.focus();
    }
  }, [editingInvoice]);

  const handleCancelEdit = () => {
    dispatch({ type: "RESET_FORM" });
    setEditingInvoice(null);
    furnitoriRef.current.focus();
  };

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 1050,
    }),
  };

  return (
    <>
      <Card className="h-100">
        <Card.Body>
          <Card.Title>{editingInvoice ? "Modifiko Faturen" : "Shtoni Faturen"}</Card.Title>
          {showAlert && (
            <Alert
              variant="danger"
              onClose={() => dispatch({ type: "SET_SHOW_ALERT", payload: false })}
              dismissible
            >
              Furnitori, Data, dhe Nr. Fatures jane te detyrueshme!
            </Alert>
          )}
          <Form>
            <Form.Group controlId="idDheEmri" className="mb-3">
              <Form.Label>
                Furnitori <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Select
                value={optionsSelected}
                onChange={handleFurnitoriChange}
                options={furnitoriOptions}
                id="furnitoriSelect"
                inputId="furnitoriSelect-input"
                styles={customStyles}
                ref={furnitoriRef}
              />
            </Form.Group>
            <Form.Group controlId="dataEFatures" className="mb-3">
              <Form.Label>
                Data <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="date"
                value={data}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "data",
                    value: e.target.value,
                  })
                }
                onKeyDown={(e) => handleKeyDown(e, nrFaturesRef)}
                ref={datePickerRef}
              />
            </Form.Group>
            <Form.Group controlId="nrFatures" className="mb-3">
              <Form.Label>
                Nr. Fatures <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={nrFatures}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "nrFatures",
                    value: e.target.value,
                  })
                }
                onKeyDown={(e) => handleKeyDown(e, vlPaTvshRef)}
                ref={nrFaturesRef}
              />
            </Form.Group>
            <Form.Group controlId="vlPaTvsh" className="mb-3">
              <Form.Label>VL. Pa TVSH (€)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  pattern="-?[0-9]*\.?[0-9]*"
                  value={vlPaTvshInput}
                  onChange={(e) => handleNumericInput(e, "vlPaTvsh")}
                  onKeyDown={(e) => handleKeyDown(e, tvsh18Ref)}
                  ref={vlPaTvshRef}
                  isInvalid={!!vlPaTvshError}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => openCalculator("vlPaTvsh", vlPaTvshInput)}
                  ref={vlPaTvshCalcButtonRef}
                  tabIndex={-1}
                >
                  🧮
                </Button>
                <InputGroup.Text>€</InputGroup.Text>
              </InputGroup>
              {vlPaTvshError && (
                <div className="error-message">{vlPaTvshError}</div>
              )}
            </Form.Group>
            <Form.Group controlId="tvsh18" className="mb-3">
              <Form.Label>TVSH 18% (€)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  pattern="-?[0-9]*\.?[0-9]*"
                  value={tvsh18Input}
                  onChange={(e) => handleNumericInput(e, "tvsh18")}
                  onKeyDown={(e) => handleKeyDown(e, tvsh8Ref)}
                  ref={tvsh18Ref}
                  isInvalid={!!tvsh18Error}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => openCalculator("tvsh18", tvsh18Input)}
                  ref={tvsh18CalcButtonRef}
                  tabIndex={-1}
                >
                  🧮
                </Button>
                <InputGroup.Text>€</InputGroup.Text>
              </InputGroup>
              {tvsh18Error && <div className="error-message">{tvsh18Error}</div>}
            </Form.Group>
            <Form.Group controlId="tvsh8" className="mb-3">
              <Form.Label>TVSH 8% (€)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  pattern="-?[0-9]*\.?[0-9]*"
                  value={tvsh8Input}
                  onChange={(e) => handleNumericInput(e, "tvsh8")}
                  onKeyDown={(e) => handleKeyDown(e, addButtonRef)}
                  ref={tvsh8Ref}
                  isInvalid={!!tvsh8Error}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => openCalculator("tvsh8", tvsh8Input)}
                  ref={tvsh8CalcButtonRef}
                  tabIndex={-1}
                >
                  🧮
                </Button>
                <InputGroup.Text>€</InputGroup.Text>
              </InputGroup>
              {tvsh8Error && <div className="error-message">{tvsh8Error}</div>}
            </Form.Group>
            <Form.Group controlId="total" className="mb-3">
              <Form.Label>Totali (€)</Form.Label>
              <InputGroup>
                <Form.Control disabled value={total.toFixed(2)} className="bg-light" />
                <InputGroup.Text>€</InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={handleAdd}
                className="w-100"
                disabled={!!vlPaTvshError || !!tvsh18Error || !!tvsh8Error}
                ref={addButtonRef}
              >
                {editingInvoice ? "Përditëso Faturen" : "Shtoni Faturen"}
              </Button>
              {editingInvoice && (
                <Button
                  variant="secondary"
                  onClick={handleCancelEdit}
                  className="w-100"
                >
                  Anulo
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
      <CalculatorModal
        show={calculatorState.showCalculator}
        calculatorValue={calculatorState.calculatorValue}
        calculatorError={calculatorState.calculatorError}
        onApply={applyCalculatorValue}
        onClose={closeCalculator}
        onInputChange={handleCalculatorInputChange}
        onKeyDown={handleCalculatorKeyDown}
      />
    </>
  );
}

function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_FURNITORI":
      return {
        ...state,
        furnitori: action.value,
        optionsSelected: action.selected,
      };
    case "SET_NUMERIC":
      return {
        ...state,
        [action.field]: action.value,
        [`${action.field}Input`]: action.input,
        [`${action.field}Error`]: action.error,
        total: action.total,
      };
    case "SET_CALCULATOR":
      return {
        ...state,
        [action.field]: action.value,
        [`${action.field}Input`]: action.input,
        [`${action.field}Error`]: "",
        total: action.total,
      };
    case "SET_SHOW_ALERT":
      return { ...state, showAlert: action.payload };
    case "SET_EDIT_INVOICE":
      return {
        ...state,
        ...action.payload,
      };
    case "RESET_FORM":
      return {
        ...initialState,
        total: 0,
      };
    default:
      return state;
  }
}

export default InvoiceForm;
