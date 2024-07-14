import classes from './Style/Footer.module.css';
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';

function Footer() {
    const teDhenatBiznesit = {
        logo: "../../../img/web/logoo.jpg",
        shkurtesaEmritBiznesit: "SportStore",
        nrKontaktit: "+123 456 789",
        email: "info@sportstore.com",
        adresa: "123 Sport Street, Innovation City",
        emriIbiznesit: "Sport Store",
        vitiFillimit: 2022
    };

    return (
        <footer>
            <div className={classes.footer}>
                <div className={classes.footerLogo}>
                    {teDhenatBiznesit.logo === null || teDhenatBiznesit.logo === "" ?
                        <Link to="/">
                            <h1>{teDhenatBiznesit.shkurtesaEmritBiznesit}</h1>
                        </Link> :
                        <Link className={classes.logo} to="/">
                            <img 
                                src={`${process.env.PUBLIC_URL}/img/web/${teDhenatBiznesit.logo}`} 
                                alt="Logo" 
                                style={{ maxWidth: '400px', height: 'auto' }}
                            />
                        </Link>
                    }
                </div>
                <div className={classes.footerNav}>
                    <h2 className={classes.footerNavTitle}>Quick Links</h2>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/AboutUs">About Us</Link></li>
                        <li><Link to="/PingPong">Game</Link></li>
                    </ul>
                </div>
                <div className={classes.footerContact}>
                    <h2 className={classes.footerNavTitle}>Get in touch</h2>
                    <ul>
                        <li><a href={"tel:" + teDhenatBiznesit.nrKontaktit}>{teDhenatBiznesit.nrKontaktit}</a></li>
                        <li><a href={"mailto:" + teDhenatBiznesit.email}>{teDhenatBiznesit.email}</a></li>
                        <li style={{ color: "black" }}>{teDhenatBiznesit.adresa}</li>
                    </ul>
                    <div className={classes.footerSocialIcons}>
                        <a href="https://facebook.com"><i><FontAwesomeIcon icon={faFacebook} /></i></a>
                        <a href="https://instagram.com"><i><FontAwesomeIcon icon={faInstagram} /></i></a>
                        <a href="https://twitter.com"><i><FontAwesomeIcon icon={faTwitter} /></i></a>
                    </div>
                </div>
            </div>
            <div className={classes.copyright}>
                <FontAwesomeIcon icon={faCopyright} /> {teDhenatBiznesit.vitiFillimit} - {new Date().getFullYear()} {teDhenatBiznesit.emriIbiznesit}
            </div>
        </footer>
    );
}

export default Footer;
