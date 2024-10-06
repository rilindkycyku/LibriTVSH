import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCheck,
  faXmark,
  faFileImport,
} from "@fortawesome/free-solid-svg-icons";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import KontrolloAksesinNeFunksione from "../../../TeTjera/KontrolliAksesit/KontrolloAksesinNeFunksione";
import data from "../../../../Data/Data";

function FaturoOferten(props) {
  const [kalkulimet, setKalkulimet] = useState([]);
  const [detajetRegjistrimi, setDetajetRegjistrimit] = useState([]);
  const [teDhenatBiznesit, setTeDhenatBiznesit] = useState([]);

  const [emriBiznesit, setEmriBiznesit] = useState("");
  const [nrFatures, setNrFatures] = useState("");
  const [referenti, setReferenti] = useState("");
  const [dataFatures, setDataFatures] = useState("");
  const [idPartneri, setidPartneri] = useState("");

  const [idRegjistrimit, setIdRegjistrimit] = useState(0);

  const [perditeso, setPerditeso] = useState("");
  const [produktet, setProduktet] = useState([]);
  const [importoOfertenKonfirmimi, setImportoOfertenKonfirmimi] =
    useState(false);

  const [produktetPerFletLejim, setProduktetPerFletLejim] = useState([]);
  const [kaFletLejim, setKaFleteLejim] = useState(false);
  const [krijoFletLejimin, setKrijoFleteLejimin] = useState(false);

  const [nrRendorKalkulimit, setNrRendorKalkulimit] = useState(0);
  const [nrRendorKalkulimitFat, setNrRendorKalkulimitFat] = useState(0);

  const [teDhenat, setTeDhenat] = useState([]);

  const [ePara, setEPara] = useState(true);

  const getToken = localStorage.getItem("token");

  const getID = localStorage.getItem("id");

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  };

  const dataPorosise = new Date(
    detajetRegjistrimi &&
      detajetRegjistrimi.regjistrimet &&
      detajetRegjistrimi.regjistrimet.dataRegjistrimit
  );
  const dita = dataPorosise.getDate().toString().padStart(2, "0");
  const muaji = (dataPorosise.getMonth() + 1).toString().padStart(2, "0");
  const viti = dataPorosise.getFullYear().toString().slice(-2);

  useEffect(() => {
    const vendosNrFaturesMeRradhe = async () => {
      try {
        setNrRendorKalkulimitFat(parseInt(3));
      } catch (err) {
        console.log(err);
      }
    };

    vendosNrFaturesMeRradhe();
  }, [perditeso]);

  const barkodiOferte = `${
    teDhenatBiznesit && teDhenatBiznesit.shkurtesaEmritBiznesit
  }-${dita}${muaji}${viti}-${"OFERTE"}-${nrFatures}`;

  const barkodiFat = `${
    teDhenatBiznesit && teDhenatBiznesit.shkurtesaEmritBiznesit
  }-${dita}${muaji}${viti}-${"FAT"}-${nrRendorKalkulimitFat + 1}`;

  useEffect(() => {
    if (getID) {
      const vendosTeDhenat = async () => {
        try {
          setTeDhenatBiznesit(data.ShfaqTeDhenat);
          setTeDhenat(
            data.shfaqPerdoruesit.find(
              (item) => item.perdoruesi.aspNetUserID == getID
            )
          );
          setDetajetRegjistrimit(data.shfaqRegjistrimetNgaID34);
        } catch (err) {
          console.log(err);
        }
      };

      vendosTeDhenat();
    }
  }, [perditeso]);

  useEffect(() => {
    const shfaqKalkulimet = async () => {
      try {
        setKalkulimet(data.shfaqRegjistrimetNgaID34);
      } catch (err) {
        console.log(err);
      }
    };

    shfaqKalkulimet();
  }, [perditeso, importoOfertenKonfirmimi]);

  async function importoOferte(idRegjistrimit) {
    props.setPerditeso();
    if (produktet.sasiaStokut > produktet.sasiaAktualeNeStok) {
      setProduktetPerFletLejim((prev) => {
        return [...prev, produktet];
      });
      setKaFleteLejim(true);
    }

    setImportoOfertenKonfirmimi(false);
    setEPara(false);
  }

  useEffect(() => {
    if (!ePara) {
      kontrolloFletLejimin();
    }
  }, [kaFletLejim, ePara]);

  function kontrolloFletLejimin() {
    if (kaFletLejim) {
      setImportoOfertenKonfirmimi(false);
      setKrijoFleteLejimin(true);
    } else {
      props.setPerditeso();
      props.hide();
      props.setShfaqMesazhin(true);
      props.setPershkrimiMesazhit("Oferta u importua me Sukses!");
      props.setTipiMesazhit("success");
    }
  }

  useEffect(() => {
    const vendosNrFaturesMeRradhe = async () => {
      try {
        setNrRendorKalkulimit(parseInt(3));
      } catch (err) {
        console.log(err);
      }
    };

    vendosNrFaturesMeRradhe();
  }, [perditeso]);

  let totalPaTVSH = 0;
  let totalTVSH = 0;
  let totalRabati = 0;

  function PerditesoFleteLejimin(
    llojiTVSH,
    qmimiShites,
    sasiaStokut,
    rabati1,
    rabati2,
    rabati3
  ) {
    let totalFat =
      (qmimiShites -
        qmimiShites * (rabati1 / 100) -
        (qmimiShites - qmimiShites * (rabati1 / 100)) * (rabati2 / 100) -
        (qmimiShites -
          qmimiShites * (rabati1 / 100) -
          (qmimiShites - qmimiShites * (rabati1 / 100)) * (rabati2 / 100)) *
          (rabati3 / 100)) *
      sasiaStokut;
    let totTVSHProdukt = totalFat * (1 + llojiTVSH / 100) - totalFat;

    totalTVSH -= totTVSHProdukt;
    totalPaTVSH -= totalFat - totTVSHProdukt;
    totalRabati -= qmimiShites * sasiaStokut - totalFat;
  }

  async function krijoFleteLejimin() {
    setPerditeso(Date.now());
    for (let produktet of produktetPerFletLejim) {
      PerditesoFleteLejimin(
        produktet.llojiTVSH,
        -produktet.qmimiShites,
        produktet.sasiaNeStok * -1,
        produktet.rabati1,
        produktet.rabati2,
        produktet.rabati3
      );
    }

    props.setPerditeso();
    setKrijoFleteLejimin(false);
    props.hide();
    props.setShfaqMesazhin(true);
    props.setPershkrimiMesazhit(
      "Oferta u importua me Sukses & Flete Lejimi u Krijua me Sukses!"
    );
    props.setTipiMesazhit("success");
  }

  function mbyllKrijoFletLejimin() {
    props.setPerditeso();
    setKrijoFleteLejimin(false);
    props.hide();
    props.setShfaqMesazhin(true);
    props.setPershkrimiMesazhit(
      "Oferta u importua me Sukses ndersa Flete Lejimi u anulua!"
    );
    props.setTipiMesazhit("success");
  }

  return (
    <>
      <KontrolloAksesinNeFunksione
        roletELejuara={["Menaxher", "Kalkulant", "Faturist"]}
        largo={() => props.largo()}
        shfaqmesazhin={() => props.shfaqmesazhin()}
        perditesoTeDhenat={() => props.perditesoTeDhenat()}
        setTipiMesazhit={(e) => props.setTipiMesazhit(e)}
        setPershkrimiMesazhit={(e) => props.setPershkrimiMesazhit(e)}
      />
      {importoOfertenKonfirmimi && (
        <Modal
          show={importoOfertenKonfirmimi}
          style={{ marginTop: "7em" }}
          onHide={() => setImportoOfertenKonfirmimi(false)}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">Konfirmo Faturimin e Ofertes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <strong style={{ fontSize: "10pt" }}>
              A jeni te sigurt qe deshironi ta faturoni kete Oferte?
            </strong>
            <hr />
            <span style={{ fontSize: "10pt" }}>
              <strong>Partneri:</strong> {emriBiznesit}
            </span>
            <br />
            <span style={{ fontSize: "10pt" }}>
              <strong>Nr. Ofertes:</strong> {nrFatures}
            </span>
            <br />
            <span style={{ fontSize: "10pt" }}>
              <strong>Referenti: </strong> {referenti}
            </span>
            <br />
            <span style={{ fontSize: "10pt" }}>
              <strong>Data Ofertes: </strong>
              {new Date(dataFatures).toLocaleDateString("en-GB", {
                dateStyle: "short",
              })}
            </span>
            <hr />
            <strong style={{ fontSize: "10pt" }}>
              Pas konfirmimit kjo oferte do te quhet si e kompletuar! Si e tille
              faturimi nuk do te jete me i mundur per kete.
            </strong>
            <br />
            <p style={{ fontSize: "10pt" }}>
              Ne rast se produktet e ofertes nuk jane ne stok do te shfaqet
              opsioni i krijimit te Flete Lejimit!
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setImportoOfertenKonfirmimi(false)}>
              Anulo <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button
              size="sm"
              variant="warning"
              onClick={() => {
                importoOferte(idRegjistrimit);
              }}>
              Konfirmo <FontAwesomeIcon icon={faCheck} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {krijoFletLejimin && (
        <Modal
          show={krijoFletLejimin}
          style={{ marginTop: "7em" }}
          onHide={() => setKrijoFleteLejimin(false)}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">Krijoni Flete Lejimin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <strong style={{ fontSize: "10pt" }}>
              Disa nga produktet jane jashte stokut. A deshironi te krijoni
              fletelejimin?
            </strong>
            <br />
            <strong style={{ fontSize: "10pt" }}>
              Ne rast se e anuloni, Flete Lejimi duhet te punohet manualisht!
            </strong>
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => mbyllKrijoFletLejimin()}>
              Anulo <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button
              size="sm"
              onClick={() => {
                krijoFleteLejimin();
              }}>
              Konfirmo <FontAwesomeIcon icon={faCheck} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal
        size="lg"
        style={{ marginTop: "3em" }}
        show={props.show}
        onHide={props.hide}>
        <Modal.Header closeButton>
          <Modal.Title>Lista e Ofertave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MDBTable small>
            <MDBTableHead>
              <tr>
                <th scope="col">Nr. Ofertes</th>
                <th scope="col">Partneri</th>
                <th scope="col">Komercialisti</th>
                <th scope="col">Data e Fatures</th>
                <th scope="col"> Funksione</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {detajetRegjistrimi && detajetRegjistrimi.regjistrimet && (
                <tr key={detajetRegjistrimi.regjistrimet.idRegjistrimit}>
                  <td>{detajetRegjistrimi.regjistrimet.nrFatures}</td>
                  <td>{detajetRegjistrimi.regjistrimet.emriBiznesit}</td>
                  <td>{detajetRegjistrimi.regjistrimet.username}</td>
                  <td>
                    {new Date(
                      detajetRegjistrimi.regjistrimet.dataRegjistrimit
                    ).toLocaleDateString("en-GB", {
                      dateStyle: "short",
                    })}
                  </td>
                  <td>
                    <Button
                      style={{ marginRight: "0.5em" }}
                      variant="warning"
                      size="sm"
                      onClick={() => {
                        setIdRegjistrimit(
                          detajetRegjistrimi.regjistrimet.idRegjistrimit
                        );
                        setidPartneri(
                          detajetRegjistrimi.regjistrimet.idPartneri
                        );
                        setNrFatures(detajetRegjistrimi.regjistrimet.nrFatures);
                        setEmriBiznesit(
                          detajetRegjistrimi.regjistrimet.emriBiznesit
                        );
                        setReferenti(detajetRegjistrimi.regjistrimet.username);
                        setDataFatures(
                          detajetRegjistrimi.regjistrimet.dataRegjistrimit
                        );
                        setImportoOfertenKonfirmimi(true);
                      }}>
                      <FontAwesomeIcon icon={faFileImport} />
                    </Button>
                  </td>
                </tr>
              )}
            </MDBTableBody>
          </MDBTable>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default FaturoOferten;
