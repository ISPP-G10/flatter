import FlatterPage from "../sections/flatterPage";
import { useRef } from "react";
import FlatterForm from "../components/forms/flatterForm";
import { accountInputs } from "../forms/accountForm";
import OptionMenu from "../components/config/options";

import '../static/css/pages/config.css';
import TitleConfig from "../components/config/title";

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
        <FlatterPage withBackground >
            <TitleConfig>
                <OptionMenu/>
                <div className="form">
                    <div id="titleForm">
                        <img  className='imgTitle' src={require('../static/files/icons/usuario.png')} alt="Icono usuario"></img>
                        <p className="pTitle">Mi Cuenta</p>
                    </div>
                    <FlatterForm
                        buttonText="Actualizar Datos"
                        showSuperAnimatedButton
                        numberOfColumns={2}
                        inputs={inputs}
                        onSubmit={handleRegisterSubmit}
                        ref={registerFormRef}/>
                </div>
            </TitleConfig>
        </FlatterPage>
    );

}

export default Account