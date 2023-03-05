import "../static/css/sections/header.css";

import { useEffect, useState, useRef } from "react";

import PropTypes from "prop-types";
import SolidButton from "./solidButton";
import HeaderProfile from "../components/header/headerProfile";

const Header = ({scrollY, user, token}) => {

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

    }, [isMenuOpen, user]);

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
                        <li><a href="/">Inicio</a></li>
                        <li><a href="/">Buscador de viviendas</a></li>
                        <li><a href="/">Buscador de compañeros</a></li>
                    </div>
                    {
                        user ?
                        <HeaderProfile user={user}/>
                        :
                        <div>
                            <SolidButton text="Registrarme" href="/login" type="outlined" modalid="ejemplo" setIsMenuOpen={setIsMenuOpen}/>
                            <SolidButton text="Acceder" href="/login" type="featured" modalid="ejemplo" setIsMenuOpen={setIsMenuOpen}/>
                        </div>
                    }
                </ul>
            </nav>
            <div className="wrapper-header-icon--open" ref={headerToggler} onClick={toggleMenu}></div>
        </header>
    );
}

Header.propTypes = {
    scrollY: PropTypes.number,
    user: PropTypes.string,
    token: PropTypes.string
}

Header.defaultProps = {
    scrollY: 0,
    user: null,
    token: null,
}

export default Header;