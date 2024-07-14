import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import classes from './Style/produktet.module.css';
import buttonat from '../Layout/Style/Buton.module.css';

function ProduktetNeHome({ produkti }) {
  return (
    <div className={classes.artikulli} data-aos="zoom-in">
      <Link to={`/Produkti`}>
        <div className={classes.emriFoto}>
          <div className={classes.zbritjaBadge}>
            <p>- 20 %</p>
          </div>
          <img
            src={produkti.fotoProduktit}
            alt={produkti.emriProduktit}
            width="150"
            height="150" // Adjust as needed
          />
          <p className={classes.artikulliLabel}>{produkti.emriProduktit}</p>
        </div>
      </Link>
      <div className={classes.cmimet}>
        <p className={classes.cmimi}>{produkti.qmimiProduktit} €</p>
        <p className={classes.cmimiPaZbritje}>{produkti.qmimiMeZbritjeProduktit} €</p>
      </div>
      <div className={classes.butonatDiv}>
        <button className={`${buttonat.buttonat} ${buttonat.butoniAddToCart}`}>
          Shto ne Shporte <FontAwesomeIcon icon={faCartShopping} />
        </button>
      </div>
    </div>
  );
}

export default ProduktetNeHome;
