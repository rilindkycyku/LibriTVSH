import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceTable from "./components/InvoiceTable";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import useFitToViewport from "./hooks/useFitToViewport";
import { fetchFurnitori } from "./utils";
import { fetchPrefikset } from "./utils/prefikset";

function App() {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });
  const [furnitoriOptions, setFurnitoriOptions] = useState([]);
  const [furnitoriLoading, setFurnitoriLoading] = useState(true);
  const [furnitoriError, setFurnitoriError] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [prefiksetIndex, setPrefiksetIndex] = useState(null);
  const fitRef = useFitToViewport();

  useEffect(() => {
    fetchFurnitori()
      .then((options) => setFurnitoriOptions(options))
      .catch((error) => {
        console.error("Error fetching furnitori:", error);
        setFurnitoriError(true);
      })
      .finally(() => setFurnitoriLoading(false));
  }, []);

  // Prefikset e Nr. Faturës janë ndihmë opsionale — një gabim këtu nuk e bllokon formën.
  useEffect(() => {
    fetchPrefikset()
      .then((index) => setPrefiksetIndex(index))
      .catch((error) => console.error("Error fetching prefikset:", error));
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
    // `min-h-screen` rri jashtë elementit që zvogëlohet, që lartësia e tij të
    // mos e prishë matjen e `useFitToViewport`.
    <div className="min-h-screen">
      <div ref={fitRef}>
        {/* `fluid` me kufi të vetin: në 1366px kontejneri fiks i Bootstrap-it
          linte mbi 200px anash bosh, hapësirë që i takon tabelës. */}
        <Container fluid className="app-container animate-fade-in">
          <header className="app-header text-center">
            <img
              src="/logo-besa.png"
              alt="BESA Supermarket"
              width="500"
              height="271"
              fetchPriority="high"
              decoding="async"
              className="d-block mx-auto app-logo"
            />
            <h1 className="gradient-text">Blerjet me TVSH</h1>
            <p className="text-muted m-0">
              Menaxhoni faturat tuaja me thjeshtësi dhe stil!
            </p>
          </header>

          {furnitoriError && (
            <div className="alert alert-warning text-center" role="alert">
              Furnitorët nuk u ngarkuan. Provoni të rifreskoni faqen.
            </div>
          )}

          <ErrorBoundary>
            <Row className="g-4">
              {/* Krah për krah hapësirën e jep `g-4` i rreshtit — margjina e
                  poshtme duhet vetëm kur kolonat grumbullohen. */}
              <Col lg={4} className="mb-4 mb-lg-0">
                <div className="h-100">
                  <InvoiceForm
                    invoices={invoices}
                    setInvoices={setInvoices}
                    furnitoriOptions={furnitoriOptions}
                    furnitoriLoading={furnitoriLoading}
                    prefiksetIndex={prefiksetIndex}
                    editingInvoice={editingInvoice}
                    setEditingInvoice={setEditingInvoice}
                  />
                </div>
              </Col>
              <Col lg={8}>
                <div className="h-100">
                  {/* Fundfaqja rri brenda kartelës së tabelës: një shirit i vetëm
                    poshtë regjistrit e shkurton faqen me një ekran të tërë. */}
                  <InvoiceTable
                    invoices={invoices}
                    setInvoices={setInvoices}
                    furnitoriOptions={furnitoriOptions}
                    onEdit={handleEdit}
                    footer={<Footer />}
                  />
                </div>
              </Col>
            </Row>
          </ErrorBoundary>
        </Container>
      </div>
    </div>
  );
}

export default App;
