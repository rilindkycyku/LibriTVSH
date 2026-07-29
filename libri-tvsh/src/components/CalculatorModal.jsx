import { useRef, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

function CalculatorModal({
  show,
  calculatorValue,
  calculatorError,
  onApply,
  onClose,
  onInputChange,
  onKeyDown,
}) {
  const calculatorInputRef = useRef();

  useEffect(() => {
    if (show && calculatorInputRef.current) {
      calculatorInputRef.current.focus();
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      restoreFocus={false}
      autoFocus={false}
      centered
      className="premium-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-4">Llogaritësi</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-4">
        {calculatorError && (
          <Alert variant="danger" className="rounded-4 mb-4">
            {calculatorError}
          </Alert>
        )}
        <Form.Group>
          <Form.Label className="mb-2">Shprehja matematike</Form.Label>
          <Form.Control
            type="text"
            value={calculatorValue}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            className="form-control-lg font-monospace"
            ref={calculatorInputRef}
            placeholder="Psh. 12.5 + 3 * 2"
          />
          <div className="form-text mt-2">Përdorni +, -, *, / për llogaritje të shpejta.</div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 pb-4">
        <Button variant="light" onClick={onClose} className="premium-button me-2">
          Mbyll
        </Button>
        <Button variant="primary" onClick={onApply} className="premium-button premium-button-primary px-4">
          Apliko
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CalculatorModal;