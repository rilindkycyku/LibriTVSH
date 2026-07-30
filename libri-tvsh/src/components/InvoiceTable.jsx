import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, Table, Button, OverlayTrigger, Tooltip, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faFileExcel,
  faSearch,
  faArrowUp,
  faArrowDown,
  faCalendarAlt,
  faBuilding,
  faHashtag,
  faFilter,
  faUndo,
  faRotateLeft
} from "@fortawesome/free-solid-svg-icons";
import { exportInvoicesExcel } from "../utils/exportExcel";

/** Gjerësitë e kolonave — `table-layout: fixed` i mban të pandryshuara sado të
    gjata të jenë emrat, kështu që Furnitori merr gjithë hapësirën që tepron.
    Shumat janë matur me vlerën më të gjatë reale („-12375.96 €"), që as në
    laptop 1366px të mos duhet rrëshqitje anash. */
const COLUMN_WIDTHS = ["88px", "auto", "132px", "88px", "82px", "72px", "104px", "80px"];

function InvoiceTable({ invoices, setInvoices, furnitoriOptions, onEdit, footer }) {
  const [highlightedId, setHighlightedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // FIXED: Defaulting to ID descending so new items stay at the top
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => setHighlightedId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        // Reset to ID sorting if clicked a third time
        setSortConfig({ key: "id", direction: "desc" });
        return;
      }
    }
    setSortConfig({ key, direction });
  };

  // Një Map në vend të një `find()` për çdo rresht: kërkimi shkruhet shkronjë
  // pas shkronje, ndaj lista rifiltrohet shpesh.
  const furnitoriLabels = useMemo(
    () => new Map(furnitoriOptions.map((opt) => [opt.value, opt.label])),
    [furnitoriOptions]
  );

  const emriFurnitorit = useCallback(
    (item) => furnitoriLabels.get(item.furnitori) || item.furnitori || "",
    [furnitoriLabels]
  );

  // Logic for filtering and sorting
  const filteredAndSortedInvoices = useMemo(() => {
    return [...invoices]
      .filter((item) => {
        const furnitori = (furnitoriLabels.get(item.furnitori) || item.furnitori || "").toString();
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
        const key = sortConfig.key || "id";
        if (a[key] < b[key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
  }, [invoices, furnitoriLabels, searchTerm, sortConfig]);

  const totals = useMemo(
    () =>
      filteredAndSortedInvoices.reduce(
        (acc, curr) => ({
          paTvsh: acc.paTvsh + (curr.vlPaTvsh || 0),
          tvsh18: acc.tvsh18 + (curr.tvsh18 || 0),
          tvsh8: acc.tvsh8 + (curr.tvsh8 || 0),
          total: acc.total + (curr.total || 0),
        }),
        { paTvsh: 0, tvsh18: 0, tvsh8: 0, total: 0 }
      ),
    [filteredAndSortedInvoices]
  );

  const handleDeleteAllClick = () => setShowClearAllModal(true);
  const handleDeleteAllConfirm = () => {
    setInvoices([]);
    setShowClearAllModal(false);
  };
  const handleDeleteAllCancel = () => setShowClearAllModal(false);

  const [isExporting, setIsExporting] = useState(false);
  const handleExportExcel = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportInvoicesExcel(filteredAndSortedInvoices, furnitoriOptions, totals);
    } finally {
      setIsExporting(false);
    }
  }, [filteredAndSortedInvoices, furnitoriOptions, totals]);

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
          { label: "Baza", val: totals.paTvsh },
          { label: "TVSH 18%", val: totals.tvsh18 },
          { label: "TVSH 8%", val: totals.tvsh8 },
          { label: "Gjithsej", val: totals.total, total: true },
        ].map((stat, idx) => (
          <div key={idx} className="col-6 col-md-3">
            <div
              className={`stat-card animate-in${stat.total ? " stat-card--total" : ""}`}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <span className="stat-card__label">{stat.label}</span>
              <span className={`stat-card__value${stat.val < 0 ? " is-negative" : ""}`}>
                {stat.val.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
              </span>
            </div>
          </div>
        ))}
      </div>

      <Card className="premium-card border-0 overflow-hidden flex-grow-1">
        <Card.Body className="p-0 d-flex flex-column">
          {/* Header & Controls */}
          <div className="panel-head">
            <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap w-100">
              <div className="d-flex align-items-center gap-2">
                <span className="panel-head__icon">
                  <FontAwesomeIcon icon={faFilter} size="sm" />
                </span>
                <h2 className="panel-head__title">Regjistri i Faturave</h2>
                <span className="panel-count">
                  {filteredAndSortedInvoices.length} fatura
                </span>
              </div>

              <div className="d-flex gap-2 align-items-center">
                {/* Reset Sort Button UI */}
                {sortConfig.key !== "id" && (
                  <OverlayTrigger placement="top" overlay={<Tooltip>Kthehu te renditja origjinale</Tooltip>}>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-decoration-none text-muted me-2"
                      onClick={() => setSortConfig({ key: "id", direction: "desc" })}
                    >
                      <FontAwesomeIcon icon={faUndo} className="me-1" />
                      Pastro
                    </Button>
                  </OverlayTrigger>
                )}

                <div className="input-group input-group-sm search-input-group">
                  <span className="input-group-text ps-3">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Kërko faturën..."
                    aria-label="Kërko faturën"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-2 ms-2">
                  <OverlayTrigger placement="top" overlay={<Tooltip>Ruaj si Excel</Tooltip>}>
                    <Button
                      variant="light"
                      className="premium-action-chip excel d-flex align-items-center gap-2"
                      onClick={handleExportExcel}
                      disabled={isExporting}
                      aria-label="Ruaj regjistrin si Excel"
                    >
                      {isExporting ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      ) : (
                        <FontAwesomeIcon icon={faFileExcel} />
                      )}
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

          <div className="table-responsive table-scroll">
            <Table hover className="premium-table m-0 align-middle">
              <colgroup>
                {COLUMN_WIDTHS.map((w, i) => (
                  <col key={i} style={w === "auto" ? undefined : { width: w }} />
                ))}
              </colgroup>
              <thead className="sticky-top z-2">
                <tr>
                  {/* Kolonat e vlerave nuk mbajnë ikonë e as „€": të tetë kolonat
                      duhet të hyjnë pa rrëshqitje anash, dhe vetë shifrat e
                      thonë se janë euro. */}
                  {[
                    { label: "Data", key: "data", icon: faCalendarAlt },
                    { label: "Furnitori", key: "furnitori", icon: faBuilding },
                    { label: "Nr. Faturës", key: "nrFatures", icon: faHashtag },
                    { label: "Pa TVSH", key: "vlPaTvsh", align: "end" },
                    { label: "TVSH 18%", key: "tvsh18", align: "end" },
                    { label: "TVSH 8%", key: "tvsh8", align: "end" },
                    { label: "Totali", key: "total", align: "end" },
                    { label: "Veprime", key: null, align: "center" },
                  ].map((h, i) => (
                    <th
                      key={i}
                      className={`text-${h.align || 'start'} ${h.key ? 'cursor-pointer select-none' : ''}`}
                      onClick={() => h.key && handleSort(h.key)}
                      onKeyDown={(e) => {
                        if (h.key && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          handleSort(h.key);
                        }
                      }}
                      tabIndex={h.key ? 0 : undefined}
                      role={h.key ? "button" : undefined}
                      aria-sort={
                        h.key && sortConfig.key === h.key
                          ? sortConfig.direction === "asc" ? "ascending" : "descending"
                          : undefined
                      }
                    >
                      <div className={`d-flex align-items-center gap-2 ${h.align === 'end' ? 'justify-content-end' : h.align === 'center' ? 'justify-content-center' : ''}`}>
                        {h.icon && (
                          <FontAwesomeIcon icon={h.icon} style={{ fontSize: '0.7rem', opacity: 0.5 }} />
                        )}
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
                    <td colSpan="8">
                      <div className="table-empty">
                        <div className="table-empty__icon">
                          <FontAwesomeIcon icon={faSearch} size="2x" />
                        </div>
                        <h6 className="fw-bold">Nuk u gjet asgjë</h6>
                        <p className="small mb-0">Nuk ka rezultate për kërkimin tuaj.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedInvoices.map((item) => {
                    // Faturat kreditore (kthimet) shënohen me kuq që të mos
                    // ngatërrohen me blerjet e zakonshme kur skanohet tabela.
                    const isNegative = item.total < 0;
                    const furnitori = emriFurnitorit(item);
                    const rowClass = [
                      item.id === highlightedId ? "is-highlighted" : "",
                      isNegative ? "is-negative" : "",
                    ].filter(Boolean).join(" ");

                    return (
                      <tr key={item.id} className={rowClass || undefined}>
                        <td>
                          <span className="cell-date">{new Date(item.data).toLocaleDateString("en-GB")}</span>
                        </td>
                        {/* Emri dhe numri shkruhen të plotë — mbështillen në disa
                            rreshta e nuk priten me tri pika. */}
                        <td>
                          <div className="cell-supplier">{furnitori}</div>
                        </td>
                        <td>
                          <div className="cell-invoice-wrap">
                            <span className="cell-invoice">{item.nrFatures}</span>
                            {isNegative && (
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Vlerë negative — kthim ose korrigjim</Tooltip>}
                              >
                                <span className="neg-tag" tabIndex={0}>
                                  <FontAwesomeIcon icon={faRotateLeft} />
                                  Kthim
                                </span>
                              </OverlayTrigger>
                            )}
                          </div>
                        </td>
                        <td className={`cell-num${item.vlPaTvsh < 0 ? " cell-num--neg" : ""}`}>{item.vlPaTvsh.toFixed(2)}</td>
                        <td className={`cell-num cell-num--tvsh18${item.tvsh18 < 0 ? " cell-num--neg" : ""}`}>{item.tvsh18.toFixed(2)}</td>
                        <td className={`cell-num cell-num--tvsh8${item.tvsh8 < 0 ? " cell-num--neg" : ""}`}>{item.tvsh8.toFixed(2)}</td>
                        <td className={`cell-num cell-num--total${isNegative ? " cell-num--neg" : ""}`}>
                          {item.total.toFixed(2)} €
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-1">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Edito</Tooltip>}>
                              <button className="btn-icon-action edit" onClick={() => handleEditClick(item)}>
                                  <FontAwesomeIcon icon={faPencilAlt} size="sm" />
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Fshi</Tooltip>}>
                              <button className="btn-icon-action delete" onClick={() => handleDeleteClick(item.id)}>
                                  <FontAwesomeIcon icon={faTrash} size="sm" />
                              </button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                      );
                  })
                )}
              </tbody>
            </Table>
          </div>

          <div className="panel-foot">
            <span className="panel-foot__hint">
              Sugjerim: Klikoni mbi kokën e tabelës për të renditur faturat.
            </span>
            {footer}
          </div>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modals */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered className="premium-modal">
        <Modal.Body className="p-4 text-center">
          <div className="modal-icon">
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
          <div className="modal-icon">
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
