import FlatterPage from "../sections/flatterPage";
import { useRef } from "react";
import FlatterForm from "../components/forms/flatterForm";
import { accountInputs } from "../forms/accountForm";
import OptionMenu from "../components/config/options";

import '../static/css/pages/config.css';

const Account = () => {

    const registerFormRef = useRef(null);

    const user = {
            first_name: "Rafael",
            last_name: "Ornedo",
            genre: "Hombre",
            role: "Ambos",
            telefono: "956675234",
            ubicacion: "Sevilla",
            email: "rafa@gmail.com"
        }
    const inputs = accountInputs

    inputs[0].defaultValue=user.first_name
    inputs[1].defaultValue=user.last_name
    inputs[2].defaultValue=user.genre
    inputs[3].defaultValue=user.role
    inputs[4].defaultValue=user.telefono
    inputs[5].defaultValue=user.email

    
    function handleRegisterSubmit({values}){
        return null;
    }

    return(
        <FlatterPage withBackground userLogged>
            <section id="configBody">
                <div className="title">CONFIGURACIÓN DE FLATTER</div>
                <div id="menu">
                    <OptionMenu/>
                    <div className="form">
                        <div style={{display: 'flex', flexDirection: 'row', marginBottom: '5px', marginTop:'10px'}}>
                            <img src={require('../static/files/icons/usuario.png')} style={{marginLeft: '5px', marginRight:'5px', height:'25px'}}></img>
                            <p style={{fontWeight:'bold', fontSize: '25px', color: '#005f8f'}}>Mi Cuenta</p>
                        </div>
                        <FlatterForm
                            buttonText="Actualizar Datos"
                            showSuperAnimatedButton
                            numberOfColumns={2}
                            inputs={inputs}
                            onSubmit={handleRegisterSubmit}
                            ref={registerFormRef}/>
                    </div>
                </div>
            </section>
        </FlatterPage>
    );

}

export default Account