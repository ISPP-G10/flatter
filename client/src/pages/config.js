import FlatterPage from "../sections/flatterPage";
import { useState, useEffect, useRef } from "react";
import { registerValidators } from "../libs/validators/registerValidators"
import FlatterForm from "../components/forms/flatterForm";
import { useApolloClient } from "@apollo/client";
import usersAPI from "../api/usersAPI";

import '../static/css/pages/config.css';

const Config = () => {

    const registerFormRef = useRef(null);
    const client = useApolloClient();
    const micuenta = useRef(null)
    const planDePrecio = useRef(null)

    const user = {
            first_name: "Rafael",
            last_name: "Ornedo",
            genre: "Hombre",
            role: "Ambos",
            username: "rafestorn",
            password: "rafestorn",
            email: "rafa@gmail.com"
        }

    const registerInputs = [
        {
            tag: "Nombre",
            name: "first_name",
            type: "text",
            defaultValue: `${user.first_name}`,
            isRequired: true,
            validators: [
                registerValidators.notEmptyValidator,
                registerValidators.noNumbersValidator,
                registerValidators.namesLengthValidator
            ]
        },
        {
            tag: "Apellidos",
            name: "last_name",
            type: "text",
            defaultValue: `${user.last_name}`,
            isRequired: true,
            validators: [
                registerValidators.notEmptyValidator,
                registerValidators.noNumbersValidator,
                registerValidators.namesLengthValidator
            ]
        },
        {
            tag: "Género",
            name: "genre",
            type: "select",
            defaultValue: `${user.genre}`,
            isRequired: true,
            values: ['Hombre', 'Mujer', 'No Binario', 'Otro'],
            validators: [
                registerValidators.notEmptyValidator,
                registerValidators.validGenre
            ],
        },
        {
            tag: "Rol",
            name: "role",
            type: "select",
            defaultValue: `${user.role}`,
            isRequired: true,
            values: ['Propietario', 'Inquilino', 'Ambos'],
            validators: [
                registerValidators.notEmptyValidator,
                registerValidators.validRole
            ],
        },
        {
            tag: "Nombre de usuario",
            name: "username",
            type: "text",
            defaultValue: `${user.username}`,
            isRequired: true,
            validators: [
                registerValidators.notEmptyValidator,
                registerValidators.usernameLengthValidator
            ]
        },
        {
            tag: "Contraseña",
            name: "password",
            type: "password",
            defaultValue: `${user.password}`,
            isRequired: true,
            validators: [
                registerValidators.notEmptyValidator,
                registerValidators.passwordLengthValidator
            ]
        },
        {
            tag: "Email",
            name: "email",
            type: "email",
            defaultValue: `${user.email}`,
            isRequired: true,
            validators: [
                registerValidators.notEmptyValidator,
                registerValidators.emailValidator
            ]
        }
    ]

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
            navigator('/config');
        }).catch((error) => {
            alert(error.message.split("\n")[0]);
        });
        
    }

    return(
        <FlatterPage withBackground>
            <section id="configBody">
                <div className="title">CONFIGURACIÓN DE FLATTER</div>
                <div id="menu">
                    <div className="options">
                        <div><p style={{fontWeight:'bold', fontSize: '25px', color: '#005f8f', marginLeft: '8px', paddingBottom:'15px'
                        , paddingTop:'15px'}}>
                            Opciones</p></div>
                        <div className="opt" style={{backgroundColor: '#00aaff97'}} ref={micuenta}>
                            Mi cuenta
                        </div>
                        <div className="opt" ref={planDePrecio}>Plan de precio</div>
                    </div>
                    
                    <div className="form" style={{width: '70%'}}>
                        <FlatterForm
                            buttonText="Actualizar Datos"
                            showSuperAnimatedButton
                            numberOfColumns={2}
                            inputs={registerInputs}
                            onSubmit={handleRegisterSubmit}
                            ref={registerFormRef}/>
                    </div>
                </div>
            </section>
        </FlatterPage>
    );
}

export default Config