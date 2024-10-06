import React, { useState, useEffect } from "react";
import NavBar from "../Components/TeTjera/layout/NavBar";
import { Helmet } from "react-helmet";
import "./Styles/Dashboard.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { Tab, Tabs, Form, InputGroup, Row, Col, Modal, Button } from "react-bootstrap";
import Titulli from "../Components/TeTjera/Titulli";
import KontrolloAksesinNeFaqe from "../Components/TeTjera/KontrolliAksesit/KontrolloAksesinNeFaqe";
import {
  MDBBtnGroup,
  MDBContainer,
  MDBNavbar,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarNav,
} from "mdb-react-ui-kit";
import { roleBasedDropdowns } from "../Components/TeTjera/layout/roleBasedDropdowns";
import jwtDecode from "jwt-decode";

import data from "../Data/Data";

const Dashboard = () => {
  const [shfaqAdmin, setShfaqAdmin] = useState(false);
  const [teDhenat, setTeDhenat] = useState([]);
  const [perditeso, setPerditeso] = useState("");
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState("kryesore");
  const navigate = useNavigate();

  const [userRoles, setUserRoles] = useState([]);

  const [showModal, setShowModal] = useState(true); // State for modal

  const getID = localStorage.getItem("id");

  useEffect(() => {
    if (getID) {
      const vendosTeDhenat = async () => {
        try {
          setTeDhenat(
            data.shfaqPerdoruesit.find(
              (item) => item.perdoruesi.aspNetUserID == getID
            )
          );
          setUserRoles(
            data.shfaqPerdoruesit.find(
              (item) => item.perdoruesi.aspNetUserID == getID
            ).rolet || []
          );
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

      vendosTeDhenat();
    } else {
      navigate("/login");
    }
  }, [perditeso]);

  return (
    <>
      <KontrolloAksesinNeFaqe
        roletELejuara={[
          "Financa",
          "Mbeshtetje e Klientit",
          "Faturist",
          "Puntor i Thjeshte",
          "Burime Njerzore",
          "Komercialist",
          "Kalkulant",
          "Menaxher",
          "Arkatar",
        ]}
      />
      <Titulli titulli={"Dashboard"} />
      <NavBar />
      <MDBNavbar expand="lg" light style={{ backgroundColor: "#009879" }}>
        <MDBContainer fluid>
          <MDBNavbarNav className="d-flex mr-auto">
            {roleBasedDropdowns.map((category) =>
              category.items.map(
                (item) =>
                  item.roles.some((role) => userRoles.includes(role)) &&
                  item.subItems.map((subItem) =>
                    subItem.shfaqNeDashboard &&
                    subItem.roles.some((role) => userRoles.includes(role)) ? (
                      <MDBNavbarItem key={subItem.path}>
                        <MDBNavbarLink>
                          <Link to={subItem.path}>{subItem.label}</Link>
                        </MDBNavbarLink>
                      </MDBNavbarItem>
                    ) : null
                  )
              )
            )}
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>

      {/* Demo Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>FinanCare Demo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {/* Add the logo */}
          <img
            src={`${process.env.PUBLIC_URL}/img/web/3eab0d81e6ad4923ba72501e3db224db.png`}
            alt="FinanCare Logo"
            style={{ width: "400px", marginBottom: "20px" }}
          />
          <p>
            Ky eshte versioni demo i FinanCare si i till jo te gjitha funksionet jane aktive, ky version nuk do te
            ndryshohet, te gjitha ndryshimet dhe versionet e reja mund te
            gjenden vetem ne GitHub ne kete{" "}
            <a
              href="https://github.com/rkycyku/FinanCare"
              target="_blank"
              rel="noopener noreferrer"
            >
              Link
            </a>
            . 
          </p>
          <strong>© FinanCare - POS, eOrder & More by Rilind Kyçyku</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="dashboard">
        {loading ? (
          <div className="Loader">
            <TailSpin
              height="80"
              width="80"
              color="#009879"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : (
          <div class="containerDashboard">
            <h3 class="titulliPershkrim">Te dhenat personale</h3>
            <Tabs
              id="shenime-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3">
              {/* Shënimet Kryesore */}
              <Tab eventKey="kryesore" title="Shënimet Kryesore">
                <Form>
                  <Form.Group className="mb-3" controlId="emriBiznesit">
                    <Row>
                      <Col>
                        <Form.Label>Emri</Form.Label>
                        <Form.Control
                          type="text"
                          value={teDhenat?.perdoruesi?.emri}
                          disabled
                        />
                      </Col>
                      <Col>
                        <Form.Label>Mbiemri</Form.Label>
                        <Form.Control
                          type="text"
                          value={teDhenat?.perdoruesi?.mbiemri}
                          disabled
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="adresa">
                    <Row>
                      <Col>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="text"
                          value={teDhenat?.perdoruesi?.email}
                          disabled
                        />
                      </Col>
                      <Col>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          value={teDhenat?.perdoruesi?.username}
                          disabled
                        />
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="adresa">
                    <Row>
                      <Col>
                        <Form.Label>Data e fillimit te kontrates</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            teDhenat?.perdoruesi?.teDhenatPerdoruesit
                              ?.dataFillimitKontrates
                              ? new Date(
                                  teDhenat.perdoruesi.teDhenatPerdoruesit.dataFillimitKontrates
                                ).toLocaleDateString("en-GB")
                              : ""
                          }
                          disabled
                        />
                      </Col>
                      <Col>
                        <Form.Label>Data e mbarimit te kontrates</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            teDhenat?.perdoruesi?.teDhenatPerdoruesit
                              ?.dataMbarimitKontrates
                              ? new Date(
                                  teDhenat.perdoruesi.teDhenatPerdoruesit.dataMbarimitKontrates
                                ).toLocaleDateString("en-GB")
                              : ""
                          }
                          disabled
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="adresa">
                    <Row>
                      <Col>
                        <Form.Label>Nr. Personal</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            teDhenat?.perdoruesi?.teDhenatPerdoruesit
                              ?.nrPersonal
                          }
                          disabled
                        />
                      </Col>
                      <Col>
                        <Form.Label>Paga Bruto</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Control
                            type="text"
                            value={
                              teDhenat?.perdoruesi?.teDhenatPerdoruesit?.paga
                                ? parseFloat(
                                    teDhenat?.perdoruesi?.teDhenatPerdoruesit
                                      ?.paga
                                  ).toFixed(2)
                                : ""
                            }
                            disabled
                          />
                          <InputGroup.Text id="basic-addon2">€</InputGroup.Text>
                        </InputGroup>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form>
              </Tab>

              {/* Shënimet Ndihmëse */}
              <Tab eventKey="ndihmese" title="Shënimet Ndihmëse">
                <Form>
                  <Form.Group className="mb-3" controlId="nui">
                    <Row>
                      <Col>
                        <Form.Label>Adresa</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            teDhenat?.perdoruesi?.teDhenatPerdoruesit?.adresa
                          }
                          disabled
                        />
                      </Col>
                      <Col>
                        <Form.Label>Datelindja</Form.Label>
                        <br />
                        <Form.Control
                          type="text"
                          value={
                            teDhenat?.perdoruesi?.teDhenatPerdoruesit
                              ?.datelindja
                              ? new Date(
                                  teDhenat.perdoruesi.teDhenatPerdoruesit.datelindja
                                ).toLocaleDateString("en-GB")
                              : ""
                          }
                          disabled
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="nui">
                    <Row>
                      <Col>
                        <Form.Label>Nr. Kontaktit</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            teDhenat?.perdoruesi?.teDhenatPerdoruesit
                              ?.nrKontaktit
                          }
                          disabled
                        />
                      </Col>
                      <Col>
                        <Form.Label>Email Privat</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            teDhenat?.perdoruesi?.teDhenatPerdoruesit
                              ?.emailPrivat
                          }
                          disabled
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="nui">
                    <Row>
                      <Col>
                        <Form.Label>Profesioni</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            teDhenat?.perdoruesi?.teDhenatPerdoruesit
                              ?.profesioni
                          }
                          disabled
                        />
                      </Col>
                      <Col>
                        <Form.Label>Specializimi</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            teDhenat?.perdoruesi?.teDhenatPerdoruesit
                              ?.specializimi
                          }
                          disabled
                        />
                      </Col>
                      <Col>
                        <Form.Label>Kualifikimi</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            teDhenat?.perdoruesi?.teDhenatPerdoruesit
                              ?.kualifikimi
                          }
                          disabled
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="nui">
                    <Row>
                      <Col>
                        <Form.Label>Banka</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            teDhenat?.perdoruesi?.teDhenatPerdoruesit?.banka
                              ?.emriBankes
                          }
                          disabled
                        />
                      </Col>
                      <Col>
                        <Form.Label>Nr. Llogaris Bankare</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            teDhenat?.perdoruesi?.teDhenatPerdoruesit
                              ?.numriLlogarisBankare
                          }
                          disabled
                        />
                      </Col>
                      <Col>
                        <Form.Label>Statusi Puntorit</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            teDhenat?.perdoruesi?.teDhenatPerdoruesit
                              ?.eshtePuntorAktive == "true"
                              ? "Aktiv"
                              : "Jo Aktiv"
                          }
                          disabled
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Form>
              </Tab>
            </Tabs>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
