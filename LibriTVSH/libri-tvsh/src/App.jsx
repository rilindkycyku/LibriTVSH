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

  useEffect(() => {
    fetchFurnitori()
      .then((options) => setFurnitoriOptions(options))
      .catch((error) => console.error("Error fetching furnitori:", error));
  }, []);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  return (
    <>
      <style>
        {`
          .highlight-row {
            background-color: #e0f7fa;
            transition: background-color 1s ease;
          }
          .header-image {
            max-width: 50%;
            height: auto;
            margin-bottom: 1rem;
            display: block;
            margin-left: auto;
            margin-right: auto;
          }
          .error-message {
            font-size: 0.875rem;
            color: #dc3545;
            margin-top: 0.25rem;
          }
        `}
      </style>
      <Container className="py-4">
        <img
          src="/logo.png"
          alt="Invoice Management Logo"
          className="header-image"
        />
        <h2 className="mb-4">Blerjet me TVSH</h2>
        <Row className="g-3">
          <Col md={6}>
            <InvoiceForm
              invoices={invoices}
              setInvoices={setInvoices}
              furnitoriOptions={furnitoriOptions}
            />
          </Col>
          <Col md={6}>
            <InvoiceTable
              invoices={invoices}
              setInvoices={setInvoices}
              furnitoriOptions={furnitoriOptions}
            />
          </Col>
        </Row>
        <Footer />
      </Container>
    </>
  );
}

export default App;