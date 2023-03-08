import FlatterPage from "../sections/flatterPage";
import { useRef } from "react";
import FlatterForm from "../components/forms/flatterForm";
import { useApolloClient } from "@apollo/client";
import usersAPI from "../api/usersAPI";
import { registerInputs } from "../forms/registerForm";

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
    const inputs = registerInputs

    inputs[0].defaultValue=user.first_name
    inputs[1].defaultValue=user.last_name
    inputs[2].defaultValue=user.genre
    inputs[3].defaultValue=user.role
    inputs[4].defaultValue=user.username
    inputs[5].defaultValue=user.password
    inputs[6].defaultValue=user.email

    
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