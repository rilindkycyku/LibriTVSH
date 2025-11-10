import { useState, useEffect } from "react";
import { Card, Table, Button, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faFileCsv, faFileExcel} from "@fortawesome/free-solid-svg-icons";
import exportFromJSON from "export-from-json";

function InvoiceTable({ invoices, setInvoices, furnitoriOptions, onEdit }) {
  const [highlightedId, setHighlightedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => setHighlightedId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  const handleDeleteAllClick = () => {
    setShowClearAllModal(true);
  };

  const handleDeleteAllConfirm = () => {
    setInvoices([]);
    console.log("Jane larguar te tera faturat!");
    setShowClearAllModal(false);
  };

  const handleDeleteAllCancel = () => {
    setShowClearAllModal(false);
  };

  const handleExport = (type) => {
    const formattedList = invoices.map((item) => ({
      Data: new Date(item.data).toLocaleDateString("en-GB"),
      Furnitori:
        furnitoriOptions.find((opt) => opt.value === item.furnitori)?.label ||
        item.furnitori,
      "Nr. Fatures": item.nrFatures,
      "VL. Pa TVSH": item.vlPaTvsh.toFixed(2),
      "TVSH 18%": item.tvsh18.toFixed(2),
      "TVSH 8%": item.tvsh8.toFixed(2),
      Totali: item.total.toFixed(2),
    }));
    exportFromJSON({
      data: formattedList,
      fileName: "BlerjetMeTVSH",
      exportType: type,
      withBOM: true,
    });
  };

  const handleDeleteClick = (id) => {
    setInvoiceToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (invoiceToDelete) {
      setInvoices(invoices.filter((invoice) => invoice.id !== invoiceToDelete));
      console.log("Eshte larguar fatura me ID:", invoiceToDelete);
    }
    setShowDeleteModal(false);
    setInvoiceToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setInvoiceToDelete(null);
  };

  const handleEditClick = (invoice) => {
    setHighlightedId(invoice.id);
    console.log("Perditesimi i fatures:", invoice);
    onEdit(invoice);
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>Tabela e Faturave</Card.Title>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Table striped bordered hover>
            <thead className="sticky-top bg-white">
              <tr>
                {[
                  "Data",
                  "Furnitori",
                  "Nr. Fatures",
                  "VL. Pa TVSH (€)",
                  "TVSH 18% (€)",
                  "TVSH 8% (€)",
                  "Totali (€)",
                  "Veprimet",
                ].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((item) => (
                <tr
                  key={item.id}
                  className={item.id === highlightedId ? "highlight-row" : ""}
                >
                  <td>{new Date(item.data).toLocaleDateString("en-GB")}</td>
                  <td>
                    {furnitoriOptions.find((opt) => opt.value === item.furnitori)
                      ?.label || item.furnitori}
                  </td>
                  <td>{item.nrFatures}</td>
                  <td>{item.vlPaTvsh.toFixed(2)}</td>
                  <td>{item.tvsh18.toFixed(2)}</td>
                  <td>{item.tvsh8.toFixed(2)}</td>
                  <td>{item.total.toFixed(2)}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Modifiko Faturen</Tooltip>}
                    >
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEditClick(item)}
                        className="me-2"
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Fshi Faturen</Tooltip>}
                    >
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="d-flex gap-2 mt-3">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Eksporto në CSV</Tooltip>}
          >
            <Button variant="success" onClick={() => handleExport("csv")}>
              <FontAwesomeIcon icon={faFileCsv} />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Eksporto në Excel</Tooltip>}
          >
            <Button variant="primary" onClick={() => handleExport("xls")}>
              <FontAwesomeIcon icon={faFileExcel} />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Pastro Tabelen</Tooltip>}
          >
            <Button variant="danger" onClick={handleDeleteAllClick}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </OverlayTrigger>
        </div>
      </Card.Body>
      <Modal
        show={showDeleteModal}
        onHide={handleDeleteCancel}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Konfirmo Fshirjen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Jeni të sigurt që doni të fshini këtë faturë?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Jo
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Po
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showClearAllModal}
        onHide={handleDeleteAllCancel}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Konfirmo Pastrimin e Tabelës</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Jeni të sigurt që doni të fshini të gjitha faturat?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteAllCancel}>
            Jo
          </Button>
          <Button variant="danger" onClick={handleDeleteAllConfirm}>
            Po
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default InvoiceTable;