import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import classes from "./Style/BrandsSlider.module.css";

function BrandsSlider() {
  const kornizaEBrendeveRef = useRef([]);
  const shkoDjathtasRef = useRef([]);
  const shkoMajtasRef = useRef([]);

  const kompanit = [
    { kompaniaId: 1, emriKompanis: "Brand1", logo: "../../../img/brands/1.jpeg" },
    { kompaniaId: 2, emriKompanis: "Brand2", logo: "../../../img/brands/2gif.gif" },
    { kompaniaId: 3, emriKompanis: "Brand3", logo: "../../../img/brands/3.webp" },
    { kompaniaId: 4, emriKompanis: "Brand4", logo: "../../../img/brands/4bmp.bmp" },
    { kompaniaId: 5, emriKompanis: "Brand5", logo: "../../../img/brands/5ico.ico" },
    { kompaniaId: 6, emriKompanis: "Brand6", logo: "../../../img/brands/6svg.svg" },
  ];

  useEffect(() => {
    kornizaEBrendeveRef.current.forEach((item, i) => {
      let containerDimensions = item.getBoundingClientRect();
      let containerWidth = containerDimensions.width;

      shkoDjathtasRef.current[i].addEventListener("click", () => {
        item.scrollLeft += containerWidth;
      });

      shkoMajtasRef.current[i].addEventListener("click", () => {
        item.scrollLeft -= containerWidth;
      });
    });
  }, []);

  return (
    <section className={classes.brandsSlider}>
      <h2 className={classes.brandsSliderLabel}>Partneret Tane</h2>
      <button
        className={classes.shkoMajtas}
        ref={(el) => (shkoMajtasRef.current[0] = el)}
      >
        <img src={`${process.env.PUBLIC_URL}/img/arrow.png`} alt="Arrow Left" />
      </button>
      <button
        className={classes.shkoDjathtas}
        ref={(el) => (shkoDjathtasRef.current[0] = el)}
      >
        <img src={`${process.env.PUBLIC_URL}/img/arrow.png`} alt="Arrow Right" />
      </button>
      <div
        className={classes.kornizaEBrendeve}
        ref={(el) => (kornizaEBrendeveRef.current[0] = el)}
      >
        {kompanit.map((kompania) => (
          <div className={classes.kartelaEBrendit} key={kompania.kompaniaId} data-aos="zoom-out">
            <div className={classes.logoBrendit}>
                <img
                  src={`${process.env.PUBLIC_URL}/img/slider/sliderIcons/${kompania.logo}`}
                  alt={kompania.emriKompanis}
                />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BrandsSlider;
