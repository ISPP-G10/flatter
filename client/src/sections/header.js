import "../static/css/sections/header.css";
import PropTypes from "prop-types";
import SolidButton from "./solidButton";
import { useEffect, useState, useRef } from "react";

const Header = ({scrollY}) => {

    let isScrolling = scrollY>0;

    const logo = require('../static/files/images/flatter-logo.png');

    const headerToggler = useRef(null);
    const headerMenu = useRef(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function toggleMenu(){
        setIsMenuOpen(!isMenuOpen);
    }

    useEffect(() => {
        if(isMenuOpen){
            headerMenu.current.style.right = '0';
        }else{
            headerMenu.current.style.right = '100%';
        }
    }, [isMenuOpen]);

    return(
        <header className={`site-header${isScrolling ? ' scroll' : ''}`}>
            <div>
                <img src={logo} alt='Logo Flatter'/>
            </div>
            <nav>
                <ul ref={headerMenu}>
                    <div style={{width: '100%', display: `${isMenuOpen ? 'block' : 'none'}`}}>
                        <div className="wrapper-header-icon--close" ref={headerToggler} onClick={toggleMenu}></div>
                    </div>
                    <div>
                        <li><a href="/">Pisos en alquiler</a></li>
                        <li><a href="/">Alquilar habitación</a></li>
                        <li><a href="/">Publicar mi inmueble</a></li>
                        <li><a href="/">Encontrar compañeros de piso</a></li>
                    </div>
                    <div>
                        <SolidButton text="Registrarme" href="/login" type="outlined" />
                        <SolidButton text="Acceder" href="/login" type="featured" />
                    </div>
                </ul>
            </nav>
            <div className="wrapper-header-icon--open" ref={headerToggler} onClick={toggleMenu}></div>
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