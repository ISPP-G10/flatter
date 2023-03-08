import FlatterPage from "../sections/flatterPage";
import { useRef } from "react";
import FlatterForm from "../components/forms/flatterForm";
import { useApolloClient } from "@apollo/client";
import usersAPI from "../api/usersAPI";
import { changePasswordInputs } from "../forms/changePasswordForm";
import OptionMenu from "../components/config/optionsMenu";

import '../static/css/pages/config.css';

const ChangePassword = () => {

    const registerFormRef = useRef(null);
    const client = useApolloClient();

    const inputs = changePasswordInputs;

    
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
        <FlatterPage withBackground userLogged>
            <section id="configBody">
                <div className="title">CONFIGURACIÓN DE FLATTER</div>
                <div id="menu">
                    <OptionMenu/>
                    <div className="form">
                        <div style={{display: 'flex', flexDirection: 'row', marginBottom: '5px', marginTop:'10px'}}>
                            <img src={require('../static/files/icons/candado.png')} style={{marginLeft: '5px', marginRight:'5px', height:'25px'}}></img>
                            <p style={{fontWeight:'bold', fontSize: '25px', color: '#005f8f'}}>Cambiar Contraseña</p>
                        </div>
                        <FlatterForm
                            buttonText="Cambiar"
                            showSuperAnimatedButton
                            numberOfColumns={1}
                            inputs={inputs}
                            onSubmit={handleRegisterSubmit}
                            ref={registerFormRef}/>
                    </div>
                </div>
            </section>
        </FlatterPage>
    );
}

export default ChangePassword