import "./Style/Produkti.css";
import { useState } from "react";
import { useEffect } from "react";
import ProduktetNeHome from "../components/Produktet/ProduktetNeHome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "./Style/SwiperSlider.css";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import Footer from "../components/Layout/Footer";
import Titulli from "../components/Layout/Titulli";
import NavBar from "../components/Layout/Navbar";

function Produkti() {
  const sliderImages = [
    {
      id: 1,
      src: `${process.env.PUBLIC_URL}/img/produktet/reketa 1.webp`,
      alt: "Ping Pong 1",
    },
    {
      id: 2,
      src: `${process.env.PUBLIC_URL}/img/produktet/reketa2.webp`,
      alt: "Ping Pong 2",
    },
    {
      id: 3,
      src: `${process.env.PUBLIC_URL}/img/produktet/reketa3.webp`,
      alt: "Ping Pong 3",
    },
  ];

  const produkti = {
    produktiId: 1,
    emriProduktit: "Raketë ping pongu Donic Waldner 800, 5 shtresore",
    qmimiProduktit: 100,
    sasiaNeStok: 10,
    qmimiMeZbritjeProduktit: 90,
    emriKompanis: "Kompania1",
    llojiKategoris: "Kategoria1",
    llojiTVSH: 18,
  };

  const [produktet, setProduktet] = useState([]);

  useEffect(() => {
    const shfaqProduktet = () => {
      const randomProducts = [
        {
          produktiId: 1,
          fotoProduktit: "../../../img/produktet/reketa 1.webp",
          emriProduktit: "Raketë ping pongu Donic Waldner 800, 5 shtresore",
          qmimiProduktit: 100,
          sasiaNeStok: 10,
          qmimiMeZbritjeProduktit: 90,
        },
        {
          produktiId: 2,
          fotoProduktit: "../../../img/produktet/reketa2.webp",
          emriProduktit: "Pingpong 800 (S214581)",
          qmimiProduktit: 200,
          sasiaNeStok: 5,
          qmimiMeZbritjeProduktit: 180,
        },
        {
          produktiId: 3,
          fotoProduktit: "../../../img/produktet/reketa3.webp",
          emriProduktit: "Raketë ping pongu Atemi, 5 shtresore",
          qmimiProduktit: 150,
          sasiaNeStok: 8,
          qmimiMeZbritjeProduktit: 140,
        },
        {
          produktiId: 4,
          fotoProduktit: "../../../img/produktet/reketa4.webp",
          emriProduktit: "Raketë ping pongu Atemi 200",
          qmimiProduktit: 250,
          sasiaNeStok: 15,
          qmimiMeZbritjeProduktit: 225,
        },
        {
          produktiId: 5,
          fotoProduktit: "../../../img/produktet/reketa5.webp",
          emriProduktit:
            "Raketë ping pongu Donic Top Team 500, e verdhë / e zezë",
          qmimiProduktit: 300,
          sasiaNeStok: 20,
          qmimiMeZbritjeProduktit: 270,
        },
        {
          produktiId: 6,
          fotoProduktit: "../../../img/produktet/tavoline.webp",
          emriProduktit: "Tabelë ping-pongu SPONETA S3-46i",
          qmimiProduktit: 300,
          sasiaNeStok: 20,
          qmimiMeZbritjeProduktit: 270,
        },
      ];

      setProduktet(randomProducts);
    };

    shfaqProduktet();
  }, []);

  return (
    <div className="container">
      <NavBar />
      <Titulli titulli={"Produkti"} />
      <div className="produkti">
        <div className="detajet">
          <div className="foto">
            <Swiper
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              className="mySwiper">
              {sliderImages &&
                sliderImages.map((foto) => (
                  <SwiperSlide>
                    <img src={`${foto.src}`} alt={foto.alt} />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
          <div className="ContainerTeDhenat">
            <div className="teDhenatProduktit">
              <table>
                <tbody>
                  <tr>
                    <th colSpan="2">
                      <h1 className="emriProd">
                        {produkti && produkti.emriProduktit}
                      </h1>
                    </th>
                  </tr>
                  <tr>
                    <td>Kompania:</td>
                    <td>{produkti && produkti.emriKompanis}</td>
                  </tr>
                  <tr>
                    <td>Kategoria:</td>
                    <td>{produkti && produkti.llojiKategoris}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="blerja">
              <form>
                <h5 className="qmimiPaZbritje">
                  {produkti &&
                    produkti.qmimiMeZbritjeProduktit != null &&
                    parseFloat(produkti && produkti.qmimiProduktit).toFixed(2) +
                      " €"}
                </h5>
                <h5>
                  {produkti &&
                    produkti.qmimiMeZbritjeProduktit != null &&
                    "Ju Kureseni: " +
                      parseFloat(
                        (produkti && produkti.qmimiProduktit) -
                          (produkti && produkti.qmimiMeZbritjeProduktit)
                      ).toFixed(2) +
                      " €" +
                      " (" +
                      (
                        (((produkti && produkti.qmimiProduktit) -
                          (produkti && produkti.qmimiMeZbritjeProduktit)) /
                          (produkti && produkti.qmimiProduktit)) *
                        100
                      ).toFixed(0) +
                      "%)"}
                </h5>
                <h1 className="">
                  {produkti && produkti.qmimiMeZbritjeProduktit != null
                    ? parseFloat(
                        produkti && produkti.qmimiMeZbritjeProduktit
                      ).toFixed(2)
                    : parseFloat(produkti && produkti.qmimiProduktit).toFixed(
                        2
                      )}{" "}
                  €
                </h1>
                <p>
                  {produkti && produkti.qmimiMeZbritjeProduktit != null
                    ? parseFloat(
                        (produkti && produkti.qmimiMeZbritjeProduktit) -
                          (produkti && produkti.qmimiMeZbritjeProduktit) *
                            ((produkti && produkti.llojiTVSH) /
                              (100 + (produkti && produkti.llojiTVSH)))
                      ).toFixed(2)
                    : parseFloat(
                        (produkti && produkti.qmimiProduktit) -
                          (produkti && produkti.qmimiProduktit) *
                            ((produkti && produkti.llojiTVSH) /
                              (100 + (produkti && produkti.llojiTVSH)))
                      ).toFixed(2)}{" "}
                  € pa TVSH
                </p>
                <p>
                  Disponueshmëria:{" "}
                  {produkti && produkti.sasiaNeStok > 10
                    ? "Me shume se 10 artikuj"
                    : produkti && produkti.sasiaNeStok + " artikuj"}
                </p>

                <div className="butonatDiv">
                  {produkti && produkti.sasiaNeStok > 0 && (
                    <button className={`buttonat butoniAddToCart`}>
                      Shto ne Shporte <FontAwesomeIcon icon={faCartShopping} />
                    </button>
                  )}
                  {produkti && produkti.sasiaNeStok <= 0 && (
                    <Button
                      disabled
                      style={{
                        backgroundColor: "lightgray",
                        color: "black",
                        cursor: "unset",
                      }}>
                      Out of Stock
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="pershkrimi">
          <h2>Pershkrimi: </h2>
          <p>{produkti && produkti.emriProduktit}</p>
        </div>
      </div>

      <div className="artikujt">
        <div className="titulliArtikuj">
          <h1 className="">Me te Shiturat</h1>
        </div>
        {produktet &&
          produktet.map((produkti) => {
            return (
              <ProduktetNeHome key={produkti.produktiId} produkti={produkti} />
            );
          })}
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default Produkti;
