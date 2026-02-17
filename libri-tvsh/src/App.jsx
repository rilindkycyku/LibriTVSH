import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceTable from "./components/InvoiceTable";
import Footer from "./components/Footer";
import { fetchFurnitori } from "./utils";

function App() {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });
  const [furnitoriOptions, setFurnitoriOptions] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    fetchFurnitori()
      .then((options) => setFurnitoriOptions(options))
      .catch((error) => console.error("Error fetching furnitori:", error));
  }, []);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  const handleEdit = (invoice) => {
    const selectedOption = furnitoriOptions.find(
      (opt) => opt.value === invoice.furnitori
    );
    console.log("Editing invoice:", invoice);
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
            alt="Logo"
            className="d-block mx-auto mb-4"
            style={{ maxWidth: "50%", height: "auto" }}
          />
          <h1 className="display-4 fw-bold gradient-text mb-2">Blerjet me TVSH</h1>
          <p className="text-muted fs-5">Menaxhoni faturat tuaja me thjeshtësi dhe stil!</p>
        </header>

        <Row className="g-4">
          <Col lg={4} className="mb-4">
            <div className="h-100">
              <InvoiceForm
                invoices={invoices}
                setInvoices={setInvoices}
                furnitoriOptions={furnitoriOptions}
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

        <div className="mt-12">
          <Footer />
        </div>
      </Container>
    </div>
  );
}

export default App;