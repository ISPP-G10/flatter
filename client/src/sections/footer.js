import '../static/css/sections/footer.css'

import { Link } from 'react-router-dom';

const Footer = () => {

    return(
        <footer className={`site-footer`}>
            <div className="waves">
                <div className="wave" id="wave1"></div>
                <div className="wave" id="wave2"></div>
                <div className="wave" id="wave3"></div>
                <div className="wave" id="wave4"></div>
            </div>
            <ul className="social-icon">
                <li className="social-icon-item"><a className="social-icon-link" href="/">
                    <img src={require('../static/files/icons/facebook.png')} alt="logo-facebook"></img>
                    </a></li>
                <li className="social-icon-item"><a className="social-icon-link" href="/">
                    <img src={require('../static/files/icons/twitter.png')} alt="logo-twitter"></img>
                    </a></li>
                <li className="social-icon-item"><a className="social-icon-link" href="/">
                    <img src={require('../static/files/icons/linkedin.png')} alt="logo-linkedin"></img>
                    </a></li>
                <li className="social-icon-item"><a className="social-icon-link" href="/">
                    <img src={require('../static/files/icons/instagram.png')} alt="logo-instagram"></img>
                    </a></li>
            </ul>
            <ul className="menu">
                <li className="menu-item"><Link className="menu-link" to="/">Viviendas en alquiler</Link></li>
                <li className="menu-item"><Link className="menu-link" to="/">Alquilar habitación</Link></li>
                <li className="menu-item"><Link className="menu-link" to="/">Publicar mi inmueble</Link></li>
                <li className="menu-item"><Link className="menu-link" to="/">Encontrar compañeros</Link></li>
            </ul>
            <p>&copy; 2023 Flatter | Todos los derechos reservados</p>
        </footer>
    );
}

export default Footer;