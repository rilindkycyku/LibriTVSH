import React, { useState, useEffect } from 'react';
import NavBar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import BrandsSlider from "../components/slideri/BrandsSlider";
import { Helmet } from 'react-helmet';
import ProduktetNeHome from '../components/Produktet/ProduktetNeHome';

import classes from './Style/Home.module.css'; // Assuming the correct path for your CSS file

function Home() {
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
                    emriProduktit: "Raketë ping pongu Donic Top Team 500, e verdhë / e zezë",
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
                {
                    produktiId: 7,
                    fotoProduktit: "../../../img/produktet/tavoline2.webp",
                    emriProduktit: "Tabelë ping-pongu Sponeta S1-12e, 274 x 152.5 x 76 cm, e palosshme",
                    qmimiProduktit: 300,
                    sasiaNeStok: 20,
                    qmimiMeZbritjeProduktit: 270,
                },
                {
                    produktiId: 8,
                    fotoProduktit: "../../../img/produktet/topa.webp",
                    emriProduktit: "Topa ping-pong Spokey, 6 copë, të portokalltë",
                    qmimiProduktit: 300,
                    sasiaNeStok: 20,
                    qmimiMeZbritjeProduktit: 270,
                }
                ,
                {
                    produktiId: 9,
                    fotoProduktit: "../../../img/produktet/topa2.webp",
                    emriProduktit: "Topa pingpongu Victoria Sport, 6copë, të bardhë",
                    qmimiProduktit: 300,
                    sasiaNeStok: 20,
                    qmimiMeZbritjeProduktit: 270,
                },
                {
                    produktiId: 10,
                    fotoProduktit: "../../../img/produktet/topa3.webp",
                    emriProduktit: "Topa pingpongu Victoria Sport, 6 copë, të portokalltë",
                    qmimiProduktit: 300,
                    sasiaNeStok: 20,
                    qmimiMeZbritjeProduktit: 270,
                },
                {
                    produktiId: 11,
                    fotoProduktit: "../../../img/produktet/topa4.webp",
                    emriProduktit: "Topa ping pongu Sponeta",
                    qmimiProduktit: 300,
                    sasiaNeStok: 20,
                    qmimiMeZbritjeProduktit: 270,
                }
            ];

            setProduktet(randomProducts);
        }

        shfaqProduktet();
    }, [])

    return (
        <div>
            <Helmet>
                <title>Home | Sport Store</title>
            </Helmet>
            <NavBar />
            <div className={classes.banner}>
                <div className={classes.titulliPershkrim}>
                    <p>A place where Sport is everything.</p>
                </div>
            </div>
            <BrandsSlider />
            <div className={classes.artikujt}>
                <div className={classes.titulliArtikuj}>
                    <h1>Produktet Tona</h1>
                </div>
                {produktet.map((produkti) => {
                    return (
                        <ProduktetNeHome
                            key={produkti.produktiId}
                            produkti={produkti}
                        />
                    );
                })}
            </div>
            <Footer />
        </div>
    );
}

export default Home;
