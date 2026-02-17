import { useReducer, useRef, useEffect } from "react";
import { Form, Card, Button, InputGroup, Alert } from "react-bootstrap";
import Select from "react-select";
import CalculatorModal from "./CalculatorModal";
import useInvoiceForm from "../hooks/useInvoiceForm";

const initialState = {
  furnitori: "",
  data: new Date().toLocaleDateString("en-CA"),
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
      <Card className="premium-card">
        <Card.Body className="p-4">
          <Card.Title className="fw-bold mb-4 fs-4">{editingInvoice ? "Modifiko Faturën" : "Shto Faturë të Re"}</Card.Title>
          {showAlert && (
            <Alert
              variant="danger"
              className="rounded-4"
              onClose={() => dispatch({ type: "SET_SHOW_ALERT", payload: false })}
              dismissible
            >
              Furnitori, Data, dhe Nr. Faturës janë të detyrueshme!
            </Alert>
          )}
          <Form>
            <Form.Group controlId="idDheEmri" className="mb-4">
              <Form.Label className="fw-semibold text-muted mb-2">
                Furnitori <span className="text-danger">*</span>
              </Form.Label>
              <Select
                value={optionsSelected}
                onChange={handleFurnitoriChange}
                options={furnitoriOptions}
                id="furnitoriSelect"
                inputId="furnitoriSelect-input"
                styles={customStyles}
                ref={furnitoriRef}
                placeholder="Zgjidh furnitorin..."
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6 mb-4">
                <Form.Group controlId="dataEFatures">
                  <Form.Label className="fw-semibold text-muted mb-2">
                    Data <span className="text-danger">*</span>
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
                    className="form-control-premium"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-4">
                <Form.Group controlId="nrFatures">
                  <Form.Label className="fw-semibold text-muted mb-2">
                    Nr. Faturës <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Psh. 123/2026"
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
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-4">
                <Form.Group controlId="vlPaTvsh">
                  <Form.Label className="fw-semibold text-muted mb-2">VL. Pa TVSH (€)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="0.00"
                      pattern="-?[0-9]*\.?[0-9]*"
                      value={vlPaTvshInput}
                      onChange={(e) => handleNumericInput(e, "vlPaTvsh")}
                      onKeyDown={(e) => handleKeyDown(e, tvsh18Ref)}
                      ref={vlPaTvshRef}
                      isInvalid={!!vlPaTvshError}
                    />
                    <Button
                      variant="light"
                      className="border"
                      onClick={() => openCalculator("vlPaTvsh", vlPaTvshInput)}
                      ref={vlPaTvshCalcButtonRef}
                      tabIndex={-1}
                    >
                      🧮
                    </Button>
                    <InputGroup.Text className="bg-light text-muted border-start-0">€</InputGroup.Text>
                  </InputGroup>
                  {vlPaTvshError && (
                    <div className="error-message text-danger mt-1">{vlPaTvshError}</div>
                  )}
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <Form.Group controlId="tvsh18">
                  <Form.Label className="fw-semibold text-muted mb-2">TVSH 18% (€)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="0.00"
                      pattern="-?[0-9]*\.?[0-9]*"
                      value={tvsh18Input}
                      onChange={(e) => handleNumericInput(e, "tvsh18")}
                      onKeyDown={(e) => handleKeyDown(e, tvsh8Ref)}
                      ref={tvsh18Ref}
                      isInvalid={!!tvsh18Error}
                    />
                    <Button
                      variant="light"
                      className="border"
                      onClick={() => openCalculator("tvsh18", tvsh18Input)}
                      ref={tvsh18CalcButtonRef}
                      tabIndex={-1}
                    >
                      🧮
                    </Button>
                    <InputGroup.Text className="bg-light text-muted">€</InputGroup.Text>
                  </InputGroup>
                  {tvsh18Error && <div className="error-message text-danger mt-1">{tvsh18Error}</div>}
                </Form.Group>
              </div>
              <div className="col-md-6 mb-4">
                <Form.Group controlId="tvsh8">
                  <Form.Label className="fw-semibold text-muted mb-2">TVSH 8% (€)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="0.00"
                      pattern="-?[0-9]*\.?[0-9]*"
                      value={tvsh8Input}
                      onChange={(e) => handleNumericInput(e, "tvsh8")}
                      onKeyDown={(e) => handleKeyDown(e, addButtonRef)}
                      ref={tvsh8Ref}
                      isInvalid={!!tvsh8Error}
                    />
                    <Button
                      variant="light"
                      className="border"
                      onClick={() => openCalculator("tvsh8", tvsh8Input)}
                      ref={tvsh8CalcButtonRef}
                      tabIndex={-1}
                    >
                      🧮
                    </Button>
                    <InputGroup.Text className="bg-light text-muted">€</InputGroup.Text>
                  </InputGroup>
                  {tvsh8Error && <div className="error-message text-danger mt-1">{tvsh8Error}</div>}
                </Form.Group>
              </div>
            </div>

            <Form.Group controlId="total" className="mb-5">
              <Form.Label className="fw-bold text-dark fs-5 mb-2">Totali i Faturës</Form.Label>
              <div className="p-3 bg-light rounded-4 border text-center">
                <span className="fs-3 fw-bold gradient-text">{total.toFixed(2)} €</span>
              </div>
            </Form.Group>

            <div className="d-flex flex-column gap-3">
              <Button
                variant="primary"
                onClick={handleAdd}
                className="premium-button premium-button-primary w-100 py-3 fs-5 shadow-sm"
                disabled={!!vlPaTvshError || !!tvsh18Error || !!tvsh8Error}
                ref={addButtonRef}
              >
                {editingInvoice ? "Përditëso Faturën" : "Shto në Tabelë"}
              </Button>
              {editingInvoice && (
                <Button
                  variant="link"
                  onClick={handleCancelEdit}
                  className="text-muted text-decoration-none"
                >
                  Anulo ndryshimet
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
