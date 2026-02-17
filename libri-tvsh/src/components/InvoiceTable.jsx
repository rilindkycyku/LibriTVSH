import { useState, useEffect } from "react";
import { Card, Table, Button, OverlayTrigger, Tooltip, Modal, Form, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faFileCsv,
  faFileExcel,
  faSearch,
  faArrowUp,
  faArrowDown,
  faCalendarAlt,
  faBuilding,
  faHashtag,
  faEuroSign,
  faFilter
} from "@fortawesome/free-solid-svg-icons";
import exportFromJSON from "export-from-json";

function InvoiceTable({ invoices, setInvoices, furnitoriOptions, onEdit }) {
  const [highlightedId, setHighlightedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "data", direction: "desc" });

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => setHighlightedId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedInvoices = [...invoices]
    .filter((item) => {
      const furnitori = (furnitoriOptions.find((opt) => opt.value === item.furnitori)?.label || item.furnitori || "").toString();
      const nrFatures = (item.nrFatures || "").toString();
      const data = (item.data || "").toString();
      const term = (searchTerm || "").toLowerCase();

      return (
        furnitori.toLowerCase().includes(term) ||
        nrFatures.toLowerCase().includes(term) ||
        data.includes(term)
      );
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  const totals = filteredAndSortedInvoices.reduce(
    (acc, curr) => ({
      paTvsh: acc.paTvsh + curr.vlPaTvsh,
      tvsh18: acc.tvsh18 + curr.tvsh18,
      tvsh8: acc.tvsh8 + curr.tvsh8,
      total: acc.total + curr.total,
    }),
    { paTvsh: 0, tvsh18: 0, tvsh8: 0, total: 0 }
  );

  const handleDeleteAllClick = () => setShowClearAllModal(true);
  const handleDeleteAllConfirm = () => {
    setInvoices([]);
    setShowClearAllModal(false);
  };
  const handleDeleteAllCancel = () => setShowClearAllModal(false);

  const handleExport = (type) => {
    const dataToExport = filteredAndSortedInvoices.length > 0 ? filteredAndSortedInvoices : invoices;
    const formattedList = dataToExport.map((item) => ({
      Data: new Date(item.data).toLocaleDateString("en-GB"),
      Furnitori: furnitoriOptions.find((opt) => opt.value === item.furnitori)?.label || item.furnitori,
      "Nr. Fatures": item.nrFatures,
      "VL. Pa TVSH": item.vlPaTvsh.toFixed(2),
      "TVSH 18%": item.tvsh18.toFixed(2),
      "TVSH 8%": item.tvsh8.toFixed(2),
      Totali: item.total.toFixed(2),
    }));
    exportFromJSON({
      data: formattedList,
      fileName: `LibriTVSH_${new Date().toLocaleDateString("en-CA")}`,
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
    onEdit(invoice);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ?
      <FontAwesomeIcon icon={faArrowUp} className="ms-1 small text-primary" /> :
      <FontAwesomeIcon icon={faArrowDown} className="ms-1 small text-primary" />;
  };

  return (
    <div className="d-flex flex-column gap-4 h-100">
      {/* Quick Stats Dashboard */}
      <div className="row g-3">
        {[
          { label: "Baza (€)", val: totals.paTvsh, color: "stat-pill-primary" },
          { label: "TVSH 18%", val: totals.tvsh18, color: "stat-pill-primary" },
          { label: "TVSH 8%", val: totals.tvsh8, color: "stat-pill-primary" },
          { label: "Gjithsej", val: totals.total, color: "stat-pill-success", bold: true },
        ].map((stat, idx) => (
          <div key={idx} className="col-6 col-md-3">
            <div className="premium-card p-3 text-center h-100 animate-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="small text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>{stat.label}</div>
              <div className={`fs-5 fw-bold ${stat.bold ? 'gradient-text' : ''}`}>
                {stat.val.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card className="premium-card border-0 shadow-sm overflow-hidden flex-grow-1">
        <Card.Body className="p-0 d-flex flex-column">
          {/* Header & Controls */}
          <div className="p-4 bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 bg-primary bg-opacity-10 rounded-3 text-primary">
                  <FontAwesomeIcon icon={faFilter} size="sm" />
                </div>
                <Card.Title className="fw-bold fs-5 m-0 lh-1">Regjistri i Faturave</Card.Title>
                <Badge pill bg="light" text="muted" className="border ms-2">
                  Nr. Faturave: {filteredAndSortedInvoices.length}
                </Badge>
              </div>

              <div className="d-flex gap-2 align-items-center">
                <div className="input-group input-group-sm rounded-pill overflow-hidden border shadow-sm" style={{ width: '220px' }}>
                  <span className="input-group-text bg-white border-0 text-muted ps-3">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Kërko faturën..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 shadow-none py-2"
                  />
                </div>

                <div className="d-flex gap-2 ms-2">
                  <OverlayTrigger placement="top" overlay={<Tooltip>Ruaj si CSV</Tooltip>}>
                    <Button
                      variant="light"
                      className="premium-action-chip csv d-flex align-items-center gap-2"
                      onClick={() => handleExport("csv")}
                    >
                      <FontAwesomeIcon icon={faFileCsv} />
                      <span className="d-none d-xl-inline">CSV</span>
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger placement="top" overlay={<Tooltip>Ruaj si Excel</Tooltip>}>
                    <Button
                      variant="light"
                      className="premium-action-chip excel d-flex align-items-center gap-2"
                      onClick={() => handleExport("xls")}
                    >
                      <FontAwesomeIcon icon={faFileExcel} />
                      <span className="d-none d-xl-inline">Excel</span>
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger placement="top" overlay={<Tooltip>Pastro Regjistrin</Tooltip>}>
                    <Button
                      variant="light"
                      className="premium-action-chip delete d-flex align-items-center gap-2"
                      onClick={handleDeleteAllClick}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span className="d-none d-xl-inline">Pastro</span>
                    </Button>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive flex-grow-1" style={{ maxHeight: '420px' }}>
            <Table hover className="premium-table m-0 align-middle">
              <thead className="sticky-top z-2">
                <tr>
                  {[
                    { label: "Data", key: "data", icon: faCalendarAlt },
                    { label: "Furnitori", key: "furnitori", icon: faBuilding },
                    { label: "Nr. Fatures", key: "nrFatures", icon: faHashtag },
                    { label: "VL. Pa TVSH €", key: "vlPaTvsh", icon: faEuroSign, align: "end" },
                    { label: "TVSH 18% €", key: "tvsh18", icon: faEuroSign, align: "end" },
                    { label: "TVSH 8% €", key: "tvsh8", icon: faEuroSign, align: "end" },
                    { label: "Totali €", key: "total", icon: faEuroSign, align: "end" },
                    { label: "Veprime", key: null, align: "center" },
                  ].map((h, i) => (
                    <th
                      key={i}
                      className={`text-${h.align || 'start'} ${h.key ? 'cursor-pointer select-none' : ''}`}
                      onClick={() => h.key && handleSort(h.key)}
                    >
                      <div className={`d-flex align-items-center gap-2 ${h.align === 'end' ? 'justify-content-end' : h.align === 'center' ? 'justify-content-center' : ''}`}>
                        <FontAwesomeIcon icon={h.icon || faHashtag} style={{ fontSize: '0.7rem', opacity: 0.5 }} />
                        {h.label}
                        {getSortIcon(h.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div className="py-4 text-muted">
                        <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                          <FontAwesomeIcon icon={faSearch} size="2x" className="opacity-25" />
                        </div>
                        <h6 className="fw-bold">Nuk u gjet asgjë</h6>
                        <p className="small mb-0">Nuk ka rezultate për kërkimin tuaj.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedInvoices.map((item) => (
                    <tr key={item.id} className={`${item.id === highlightedId ? 'table-primary shadow-sm' : 'premium-row'}`}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-nowrap fw-medium">{new Date(item.data).toLocaleDateString("en-GB")}</span>
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold text-dark truncate" style={{ maxWidth: '140px' }}>
                          {furnitoriOptions.find((opt) => opt.value === item.furnitori)?.label || item.furnitori}
                        </div>
                      </td>
                      <td><code className="text-primary small fw-bold">{item.nrFatures}</code></td>
                      <td className="text-end font-monospace">{item.vlPaTvsh.toFixed(2)}</td>
                      <td className="text-end font-monospace text-primary">{item.tvsh18.toFixed(2)}</td>
                      <td className="text-end font-monospace text-info">{item.tvsh8.toFixed(2)}</td>
                      <td className="text-end fw-bold text-dark">
                        {item.total.toFixed(2)} €
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <button className="btn-icon-action edit" onClick={() => handleEditClick(item)}>
                            <FontAwesomeIcon icon={faPencilAlt} size="sm" />
                          </button>
                          <button className="btn-icon-action delete" onClick={() => handleDeleteClick(item.id)}>
                            <FontAwesomeIcon icon={faTrash} size="sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Subtle Mobile Hint */}
          <div className="px-4 py-2 bg-light text-center border-top">
            <span className="small text-muted" style={{ fontSize: '0.7rem' }}>
              Sugjerim: Klikoni mbi koka e tabelës për të renditur faturat.
            </span>
          </div>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modals */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered className="premium-modal">
        <Modal.Body className="p-4 text-center">
          <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-3 mb-3">
            <FontAwesomeIcon icon={faTrash} size="lg" />
          </div>
          <h5 className="fw-bold mb-2">Konfirmo Fshirjen</h5>
          <p className="text-muted small mb-4">Jeni të sigurt që doni të fshini këtë faturë? Ky veprim nuk mund të kthehet.</p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="light" onClick={handleDeleteCancel} className="premium-button">Mbyll</Button>
            <Button variant="danger" onClick={handleDeleteConfirm} className="premium-button">Fshi Tani</Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showClearAllModal} onHide={handleDeleteAllCancel} centered className="premium-modal">
        <Modal.Body className="p-4 text-center">
          <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-3 mb-3">
            <FontAwesomeIcon icon={faTrash} size="lg" />
          </div>
          <h5 className="fw-bold mb-2">Pastro gjithë Regjistrin</h5>
          <p className="text-muted small mb-4">Jeni të sigurt që doni të fshini të gjitha faturat? Ky veprim do të fshijë çdo gjë përgjithmonë.</p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="light" onClick={handleDeleteAllCancel} className="premium-button">Mbyll</Button>
            <Button variant="danger" onClick={handleDeleteAllConfirm} className="premium-button">Pastro Gjithçka</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default InvoiceTable;