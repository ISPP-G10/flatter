import FlatterPage from "../sections/flatterPage";
import { useRef } from "react";
import FlatterForm from "../components/forms/flatterForm";
import { changePasswordInputs } from "../forms/changePasswordForm";
import OptionMenu from "../components/config/options";

import '../static/css/pages/config.css';

const ChangePassword = () => {

    const registerFormRef = useRef(null);

    const inputs = changePasswordInputs;

    function handleChangePasswordSubmit({values}){
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
                            <img src={require('../static/files/icons/candado.png')} style={{marginLeft: '5px', marginRight:'5px', height:'25px'}}></img>
                            <p style={{fontWeight:'bold', fontSize: '25px', color: '#005f8f'}}>Cambiar Contraseña</p>
                        </div>
                        <FlatterForm
                            buttonText="Cambiar"
                            showSuperAnimatedButton
                            numberOfColumns={1}
                            inputs={inputs}
                            onSubmit={handleChangePasswordSubmit}
                            ref={registerFormRef}/>
                    </div>
                </div>
            </section>
        </FlatterPage>
    );
}

export default ChangePassword