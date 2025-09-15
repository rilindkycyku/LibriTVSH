
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import exportFromJSON from "export-from-json";
import Select from "react-select";
import {
  Container,
  Card,
  Form,
  Button,
  Table,
  InputGroup,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [furnitori, setFurnitori] = useState("");
  const [data, setData] = useState("2025-01-20");
  const [nrFatures, setNrFatures] = useState("");
  const [vlPaTvsh, setVlPaTvsh] = useState(0);
  const [tvsh18, setTvsh18] = useState(0);
  const [tvsh8, setTvsh8] = useState(0);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });
  const [showAlert, setShowAlert] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [options, setOptions] = useState([]);
  const [optionsSelected, setOptionsSelected] = useState(null);

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
      .then((response) => {
        const fetchedOptions = response.data.map((item) => ({
          value: item.key,
          label: item.Name,
        }));
        setOptions(fetchedOptions);
      })
      .catch((error) => console.error("Error fetching furnitori:", error));
  }, []);

  useEffect(() => {
    setTotal(vlPaTvsh + tvsh18 + tvsh8);
  }, [vlPaTvsh, tvsh18, tvsh8]);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => setHighlightedId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  const handleAdd = () => {
    if (!furnitori || !data || !nrFatures.trim()) {
      setShowAlert(true);
      furnitoriRef.current.focus();
      return;
    }
    setShowAlert(false);

    const newItem = {
      id: Date.now(),
      furnitori,
      data,
      nrFatures,
      vlPaTvsh,
      tvsh18,
      tvsh8,
      total,
    };

    setList([newItem, ...list]);
    setHighlightedId(newItem.id);
    setFurnitori("");
    setData("2025-01-20");
    setNrFatures("");
    setVlPaTvsh(0);
    setTvsh18(0);
    setTvsh8(0);
    setOptionsSelected(null);
    furnitoriRef.current.focus();
  };

  const handleDeleteAll = () => {
    setList([]);
    setFurnitori("");
    setData("2025-01-20");
    furnitoriRef.current.focus();
  };

  const handleExport = (type) => {
    const formattedList = list.map((item) => ({
      Data: new Date(item.data).toLocaleDateString("en-US"),
      Furnitori:
        options.find((opt) => opt.value === item.furnitori)?.label ||
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

  const handleFurnitoriKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const selectInstance = furnitoriRef.current;
      if (
        selectInstance.state.menuIsOpen &&
        selectInstance.state.focusedOption
      ) {
        setFurnitori(selectInstance.state.focusedOption.value);
        setTimeout(() => datePickerRef.current.focus(), 0);
      } else if (furnitori) {
        datePickerRef.current.focus();
      }
    }
  };

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 1050,
    }),
  };

  const handleChange = async (partneri) => {
    setFurnitori(partneri.value);
    setOptionsSelected(partneri);
    document.getElementById("dataEFatures").focus();
  };

  return (
    <>
      <style>
        {`
          .highlight-row {
            background-color: #e0f7fa;
            transition: background-color 1s ease;
          }
          .footer {
            text-align: center;
            padding: 1rem 0;
            background-color: #f8f9fa;
            border-top: 1px solid #e9ecef;
            margin-top: 2rem;
            width: 100%;
          }
          .header-image {
            max-width: 50%; /* Reduced size to 50% of container width */
            height: auto;
            margin-bottom: 1rem;
            display: block;
            margin-left: auto;
            margin-right: auto; /* Center the image */
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
                      <Form.Group controlId="idDheEmri">
                        <Form.Label>
                          Furnitori <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Select
                          value={optionsSelected}
                          onChange={handleChange}
                          options={options}
                          id="furnitoriSelect"
                          inputId="furnitoriSelect-input"
                          styles={customStyles}
                          ref={furnitoriRef}
                          onKeyDown={handleFurnitoriKeyDown}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group controlId="dataEFatures">
                        <Form.Label>
                          Data <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={data}
                          onChange={(e) =>
                            setData(e.target.value || "2025-01-20")
                          }
                          onKeyDown={(e) => handleKeyDown(e, nrFaturesRef)}
                          ref={datePickerRef}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group controlId="nrFatures">
                        <Form.Label>
                          Nr. Fatures <span style={{ color: "red" }}>*</span>
                        </Form.Label>
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
                            onChange={(e) =>
                              setVlPaTvsh(e.target.valueAsNumber || 0)
                            }
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
                            onChange={(e) =>
                              setTvsh18(e.target.valueAsNumber || 0)
                            }
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
                            onChange={(e) =>
                              setTvsh8(e.target.valueAsNumber || 0)
                            }
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
                      {list.map((item) => (
                        <tr
                          key={item.id}
                          className={
                            item.id === highlightedId ? "highlight-row" : ""
                          }
                        >
                          <td>
                            {new Date(item.data).toLocaleDateString("en-US")}
                          </td>
                          <td>
                            {options.find((opt) => opt.value === item.furnitori)
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
          </Col>
        </Row>
        <div className="footer">
          &copy; {new Date().getFullYear()} Blerjet me TVSH - Produkt i BESA NJË SH.P.K. - Zhvilluar nga Rilind Kyçyku
        </div>
      </Container>
    </>
  );
}

export default App;