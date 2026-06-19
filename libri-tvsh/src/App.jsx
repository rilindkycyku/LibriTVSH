import { useState, useEffect, lazy, Suspense } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceTable from "./components/InvoiceTable";
import ErrorBoundary from "./components/ErrorBoundary";
import { fetchFurnitori } from "./utils";

const Footer = lazy(() => import("./components/Footer"));

function App() {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });
  const [furnitoriOptions, setFurnitoriOptions] = useState([]);
  const [furnitoriLoading, setFurnitoriLoading] = useState(true);
  const [furnitoriError, setFurnitoriError] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    fetchFurnitori()
      .then((options) => setFurnitoriOptions(options))
      .catch((error) => {
        console.error("Error fetching furnitori:", error);
        setFurnitoriError(true);
      })
      .finally(() => setFurnitoriLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  const handleEdit = (invoice) => {
    const selectedOption = furnitoriOptions.find(
      (opt) => opt.value === invoice.furnitori
    );
    setEditingInvoice({
      ...invoice,
      optionsSelected: selectedOption || null,
      vlPaTvshInput: invoice.vlPaTvsh.toString(),
      tvsh18Input: invoice.tvsh18.toString(),
      tvsh8Input: invoice.tvsh8.toString(),
    });
  };

  return (
    <div className="min-h-screen pb-12">
      <Container className="py-5 animate-fade-in">
        <header className="text-center mb-10">
          <img
            src="/logo.png"
            alt="Logoja e Blerjet me TVSH"
            className="d-block mx-auto mb-4 app-logo"
          />
          <h1 className="display-4 fw-bold gradient-text mb-2">Blerjet me TVSH</h1>
          <p className="text-muted fs-5">Menaxhoni faturat tuaja me thjeshtësi dhe stil!</p>
        </header>

        {furnitoriError && (
          <div className="alert alert-warning text-center" role="alert">
            Furnitorët nuk u ngarkuan. Provoni të rifreskoni faqen.
          </div>
        )}

        <ErrorBoundary>
          <Row className="g-4">
            <Col lg={4} className="mb-4">
              <div className="h-100">
                <InvoiceForm
                  invoices={invoices}
                  setInvoices={setInvoices}
                  furnitoriOptions={furnitoriOptions}
                  furnitoriLoading={furnitoriLoading}
                  editingInvoice={editingInvoice}
                  setEditingInvoice={setEditingInvoice}
                />
              </div>
            </Col>
            <Col lg={8}>
              <div className="h-100">
                <InvoiceTable
                  invoices={invoices}
                  setInvoices={setInvoices}
                  furnitoriOptions={furnitoriOptions}
                  onEdit={handleEdit}
                />
              </div>
            </Col>
          </Row>
        </ErrorBoundary>

        <div className="mt-12">
          <Suspense fallback={<div className="text-center py-4"><Spinner animation="border" size="sm" /></div>}>
            <Footer />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}

export default App;