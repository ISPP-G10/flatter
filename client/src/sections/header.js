import "../static/css/sections/header.css";

import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginInputs } from "../forms/loginForm";
import { registerInputs } from "../forms/registerForm";
import { useApolloClient } from "@apollo/client";
import customAlert from "../libs/functions/customAlert";
import PropTypes from "prop-types";
import SolidButton from "./solidButton";
import HeaderProfile from "../components/header/headerProfile";
import FlatterModal from "../components/flatterModal";
import FlatterForm from "../components/forms/flatterForm";
import usersAPI from "../api/usersAPI";

const Header = ({scrollY, userLogged}) => {

    let isScrolling = scrollY>0;

    const client = useApolloClient();
    const navigator = useNavigate();

    const logo = require('../static/files/images/flatter-logo.png');

    const headerToggler = useRef(null);
    const headerMenu = useRef(null);
    const loginModalRef = useRef(null);
    const registerModalRef = useRef(null);
    const loginFormRef = useRef(null);
    const registerFormRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    let [user, setUser] = useState(null);
    // TODO: USAR TOKEN PARA VERIFICAR SI EL USUARIO ESTA LOGUEADO Y TIENE PERMISOS
    //eslint-disable-next-line
    let [token, setToken] = useState(null);

    function toggleMenu(){
        setIsMenuOpen(!isMenuOpen);
    }

    function handleLoginButtonClick(){
        isMenuOpen && toggleMenu();
        loginModalRef.current.open();
    }

    function handleLoginSubmit({values}){
        if(!loginFormRef.current.validate()) return;

        client.mutate({
            mutation: usersAPI.logUser,
            variables: {
                username: values.username,
                password: values.password,
            }
        }).then((response) => {
            let token = response.data.tokenAuth.token;
            let username = response.data.tokenAuth.user.username;
            let roles = response.data.tokenAuth.user.roles.map((role) => role.role);

            localStorage.setItem('token', token);
            localStorage.setItem('user', username);
            localStorage.setItem('roles', roles);

            navigator(0);

        }).catch((error) => {
            customAlert(['Usuario o contraseña incorrectos']);
        });

    }

    function handleRegisterButtonClick(){
        isMenuOpen && toggleMenu();
        registerModalRef.current.open();
    }

    function handleRegisterSubmit({values}){

        if(!registerFormRef.current.validate()) return;

        client.mutate({
            mutation: usersAPI.createUser,
            variables: {
                firstName: values.first_name,
                lastName: values.last_name,
                username: values.username,
                password: values.password,
                email: values.email,
                genre: values.genre,
                roles: values.role
            }
        }).then((response) => {
            let token = response.data.tokenAuth.token;
            let username = response.data.tokenAuth.user.username;
            let roles = response.data.tokenAuth.user.roles.map((role) => role.role);

            localStorage.setItem('token', token);
            localStorage.setItem('user', username);
            localStorage.setItem('roles', roles);

            navigator(0);
        }).catch((error) => {
            customAlert(error.message.split("\n")[0]);
        });
        
    }

    useEffect(() => {
        if(isMenuOpen){
            headerMenu.current.style.right = '0';
        }else{
            headerMenu.current.style.right = '100%';
        }
    }, [isMenuOpen]);

    useEffect(() => {
        if(userLogged){
            localStorage.getItem("user") ? setUser(localStorage.getItem("user")) : navigator("/");
            localStorage.getItem("token") ? setToken(localStorage.getItem("token")) : navigator("/");
            localStorage.getItem("roles") ? setToken(localStorage.getItem("roles")) : navigator("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <>
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
                            {
                                userLogged && 
                                <>
                                    <li><Link to="/">Inicio</Link></li>
                                    <li><Link to="/search">Buscador de viviendas</Link></li>
                                    <li><Link to="/users">Buscador de usuarios</Link></li>
                                    {
                                        localStorage.getItem("roles") && localStorage.getItem("roles").includes("OWNER") &&
                                        <li><Link to="/properties">Mis viviendas</Link></li>
                                    }
                                </>
                            }
                        </div>
                        {
                            user ?
                            <HeaderProfile user={user}/>
                            :
                            <div>
                                <SolidButton text="Registrarme" type="outlined" onClick={handleRegisterButtonClick}/>
                                <SolidButton text="Acceder" type="featured" onClick={handleLoginButtonClick}/>
                            </div>
                        }
                    </ul>
                </nav>
                <div className="wrapper-header-icon--open" ref={headerToggler} onClick={toggleMenu}></div>
            </header>
            <FlatterModal maxWidth={700} ref={registerModalRef}>
                <h1 className="auth-form-title">Regístrate</h1>
                <FlatterForm 
                    buttonText="Regístrate"
                    showSuperAnimatedButton
                    numberOfColumns={2}
                    inputs={registerInputs}
                    onSubmit={handleRegisterSubmit}
                    ref={registerFormRef}/>
            </FlatterModal>
            <FlatterModal 
                maxHeight={400}
                ref={loginModalRef}
                >
                <h1 className="auth-form-title">Iniciar Sesión</h1>
                <FlatterForm 
                    buttonText="Iniciar Sesión"
                    showSuperAnimatedButton
                    inputs={loginInputs}
                    onSubmit={handleLoginSubmit}
                    ref={loginFormRef}/>
            </FlatterModal>
        </>
    );
}

Header.propTypes = {
    scrollY: PropTypes.number,
    userLogged: PropTypes.bool,
}

Header.defaultProps = {
    scrollY: 0,
    userLogged: false,
}

export default Header;