import "../static/css/sections/header.css";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginInputs } from "../forms/loginForm";
import { registerInputs } from "../forms/registerForm";
import { useApolloClient } from "@apollo/client";

import PropTypes from "prop-types";
import SolidButton from "./solidButton";
import HeaderProfile from "../components/header/headerProfile";
import FlatterModal from "../components/flatterModal";
import FlatterForm from "../components/flatterForm";
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

            localStorage.setItem('token', token);
            localStorage.setItem('user', username);

            navigator('/main-page');

        }).catch((error) => {
            alert(['Usuario o contraseña incorrectos']);
        });

    }

    function handleRegisterButtonClick(){
        isMenuOpen && toggleMenu();
        registerModalRef.current.open();
    }

    function handleRegisterSubmit({values}){

        console.log(values);

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

            localStorage.setItem('token', token);
            localStorage.setItem('user', username);

            navigator('/main-page');
        }).catch((error) => {
            alert(error.message.split("\n")[0]);
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
            localStorage.getItem("token") ? setToken(localStorage.getItem("token")) : setToken("");
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
                            <li><a href="/">Inicio</a></li>
                            <li><a href="/">Buscador de viviendas</a></li>
                            <li><a href="/">Buscador de compañeros</a></li>
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