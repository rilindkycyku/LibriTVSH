import { useState, useEffect, useRef } from "react";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import exportFromJSON from "export-from-json";
import { Container, Card, Form, Button, Table, InputGroup, Row, Col, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [options, setOptions] = useState(() => {
    const savedOptions = localStorage.getItem("furnitoriOptions");
    return savedOptions ? JSON.parse(savedOptions) : [];
  });
  const [selectedFurnitori, setSelectedFurnitori] = useState(null);
  const [data, setData] = useState(""); // Initialize as empty string for native date input
  const [nrFatures, setNrFatures] = useState("");
  const [vlPaTvsh, setVlPaTvsh] = useState(0);
  const [tvsh18, setTvsh18] = useState(0);
  const [tvsh8, setTvsh8] = useState(0);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });
  const [showAlert, setShowAlert] = useState(false); // For Alert component

  // Refs for input fields
  const furnitoriRef = useRef();
  const datePickerRef = useRef();
  const nrFaturesRef = useRef();
  const vlPaTvshRef = useRef();
  const tvsh18Ref = useRef();
  const tvsh8Ref = useRef();

  useEffect(() => {
    axios
      .get("/furnitori.json")
      .then((res) => {
        const jsonOptions = res.data.map((item) => ({ value: item.Name, label: item.Name }));
        // Merge with saved options, avoiding duplicates
        setOptions((prev) => {
          const combined = [...prev, ...jsonOptions];
          return [...new Map(combined.map((opt) => [opt.value, opt])).values()];
        });
      })
      .catch((err) => console.error("Error fetching furnitori:", err));
  }, []);

  useEffect(() => {
    setTotal(vlPaTvsh + tvsh18 + tvsh8);
  }, [vlPaTvsh, tvsh18, tvsh8]);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    localStorage.setItem("furnitoriOptions", JSON.stringify(options));
  }, [options]);

  const handleAdd = () => {
    if (!selectedFurnitori || !data || !nrFatures.trim()) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);

    const newItem = {
      id: Date.now(),
      furnitori: selectedFurnitori.label,
      data, // Store as YYYY-MM-DD string
      nrFatures,
      vlPaTvsh,
      tvsh18,
      tvsh8,
      total,
    };

    setList([...list, newItem]); // Appends new item to the end
    setSelectedFurnitori(null);
    setData(""); // Reset to empty string
    setNrFatures("");
    setVlPaTvsh(0);
    setTvsh18(0);
    setTvsh8(0);
    furnitoriRef.current.focus(); // Focus returns to Furnitori
  };

  const handleDeleteAll = () => {
    setList([]);
    furnitoriRef.current.focus();
  };

  const handleExport = (type) => {
    const formattedList = list.map((item) => ({
      Data: new Date(item.data).toLocaleDateString('en-GB'), // Convert string to date for display
      Furnitori: item.furnitori,
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

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      } else {
        handleAdd();
      }
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.25rem",
      borderColor: "#ced4da",
      padding: "0.375rem 0.75rem",
      fontSize: "1rem",
      lineHeight: "1.5",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 1050,
    }),
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Blerjet me TVSH</h2>
      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          Furnitori, Data, dhe Nr. Fatures jane te detyrueshme!
        </Alert>
      )}
      <Row className="g-3">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Shtoni Faturen</Card.Title>
              <Form>
                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group controlId="furnitori">
                      <Form.Label>Furnitori <span style={{ color: "red" }}>*</span></Form.Label>
                      <CreatableSelect
                        ref={furnitoriRef}
                        value={selectedFurnitori}
                        onChange={(option) => {
                          setSelectedFurnitori(option);
                          if (option && !options.find((opt) => opt.value === option.value)) {
                            setOptions((prev) => [...prev, option]);
                          }
                        }}
                        options={options}
                        placeholder="Zgjidh ose shkruaj Furnitori"
                        isClearable
                        styles={customSelectStyles}
                        onKeyDown={(e) => handleKeyDown(e, datePickerRef)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="dataEFatures">
                      <Form.Label>Data <span style={{ color: "red" }}>*</span></Form.Label>
                      <Form.Control
                        id="dataEFatures"
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, nrFaturesRef)}
                        ref={datePickerRef}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="nrFatures">
                      <Form.Label>Nr. Fatures <span style={{ color: "red" }}>*</span></Form.Label>
                      <Form.Control
                        type="text"
                        value={nrFatures}
                        onChange={(e) => setNrFatures(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, vlPaTvshRef)}
                        ref={nrFaturesRef}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="vlPaTvsh">
                      <Form.Label>VL. Pa TVSH (€)</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={vlPaTvsh}
                          onChange={(e) => setVlPaTvsh(e.target.valueAsNumber || 0)}
                          onKeyDown={(e) => handleKeyDown(e, tvsh18Ref)}
                          ref={vlPaTvshRef}
                        />
                        <InputGroup.Text>€</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="tvsh18">
                      <Form.Label>TVSH 18% (€)</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={tvsh18}
                          onChange={(e) => setTvsh18(e.target.valueAsNumber || 0)}
                          onKeyDown={(e) => handleKeyDown(e, tvsh8Ref)}
                          ref={tvsh18Ref}
                        />
                        <InputGroup.Text>€</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="tvsh8">
                      <Form.Label>TVSH 8% (€)</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={tvsh8}
                          onChange={(e) => setTvsh8(e.target.valueAsNumber || 0)}
                          onKeyDown={(e) => handleKeyDown(e, null)}
                          ref={tvsh8Ref}
                        />
                        <InputGroup.Text>€</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="total">
                      <Form.Label>Totali (€)</Form.Label>
                      <InputGroup>
                        <Form.Control
                          disabled
                          value={total.toFixed(2)}
                          className="bg-light"
                        />
                        <InputGroup.Text>€</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  variant="primary"
                  onClick={handleAdd}
                  className="w-100 mt-3"
                >
                  Shtoni Faturen
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Tabela e Faturave</Card.Title>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
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
                    {list.map((item) => (
                      <tr key={item.id}>
                        <td>{new Date(item.data).toLocaleDateString()}</td>
                        <td>{item.furnitori}</td>
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
        </Col>
      </Row>
    </Container>
  );
}

export default App;