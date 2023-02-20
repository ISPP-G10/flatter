import "../static/css/sections/header.css";

import PropTypes from "prop-types";

import SolidButton from "./solidButton";

const Header = ({scrollY}) => {

    let isScrolling = scrollY>0;

    const logo = require('../static/files/images/flatter-logo.png');

    return(
        <header className={`site-header${isScrolling ? ' scroll' : ''}`}>
            <div>
                <img src={logo} />
            </div>
            <nav>
                <ul>
                    <li><a href="/">Pisos en alquiler</a></li>
                    <li><a href="/">Alquilar habitación</a></li>
                    <li><a href="/">Publicar mi inmueble</a></li>
                    <li><a href="/">Encontrar compañeros de piso</a></li>
                </ul>
            </nav>
            <div>
                <SolidButton text="Registrarme" href="/login" type="outlined" />
                <SolidButton text="Acceder" href="/login" type="featured" />
            </div>
        </header>
    );
}

Header.propTypes = {
    scrollY: PropTypes.number
}

Header.defaultProps = {
    scrollY: 0
}

export default Header;