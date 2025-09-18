import { useState, useEffect } from "react";
import { Card, Table, Button } from "react-bootstrap";
import exportFromJSON from "export-from-json";

function InvoiceTable({ invoices, setInvoices, furnitoriOptions }) {
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => setHighlightedId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  const handleDeleteAll = () => {
    setInvoices([]);
  };

  const handleExport = (type) => {
    const formattedList = invoices.map((item) => ({
      Data: new Date(item.data).toLocaleDateString("en-US"),
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
                  <td>{new Date(item.data).toLocaleDateString("en-US")}</td>
                  <td>
                    {furnitoriOptions.find((opt) => opt.value === item.furnitori)
                      ?.label || item.furnitori}
                  </td>
                  <td>{item.nrFatures}</td>
                  <td>{item.vlPaTvsh.toFixed(2)}</td>
                  <td>{item.tvsh18.toFixed(2)}</td>
                  <td>{item.tvsh8.toFixed(2)}</td>
                  <td>{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="d-flex gap-2 mt-3">
          <Button variant="success" onClick={() => handleExport("csv")}>
            Export ne CSV
          </Button>
          <Button variant="primary" onClick={() => handleExport("xls")}>
            Export ne Excel
          </Button>
          <Button variant="danger" onClick={handleDeleteAll}>
            Pastro Tabelen
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default InvoiceTable;