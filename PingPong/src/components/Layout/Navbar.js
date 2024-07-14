import classes from './Style/Navbar.module.css';
import './Style/ModalDheTabela.css';

import { Link } from "react-router-dom";

function NavBar() {
  const logo = "../../../img/web/logoo.jpg";

  return (
    <header>
      <nav className={classes.nav}>
        <div className={classes.navleft}>
          <Link className={classes.logo} to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <ul className={classes.navLinks}>
          <div className={classes.navCenter}>
            <li className={classes.navItem}>
              <Link to='/'>Home</Link>
              <span className={classes.line}></span>
            </li>
            <li className={classes.navItem}>
              <Link to='/AboutUs'>About Us</Link>
              <span className={classes.line}></span>
            </li><li className={classes.navItem}>
              <Link to='/PingPong'>Luaj PingPong</Link>
              <span className={classes.line}></span>
            </li>
          </div>
        </ul>
        <div className={classes.hamburger}>
          <div className={classes.dropdown}>
            <button className={classes.dropbtn}>
              <span className={classes.hamIkona}></span>
              <span className={classes.hamIkona}></span>
              <span className={classes.hamIkona}></span>
            </button>
            <div className={classes.dropdownContent}>
              <Link to='/'>Home</Link>
              <Link to='/AboutUs'>About Us</Link>
              <Link to='/PingPong'>Luaj PingPong</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
