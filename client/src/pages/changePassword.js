import FlatterPage from "../sections/flatterPage";
import { useRef } from "react";
import FlatterForm from "../components/forms/flatterForm";
import { changePasswordInputs } from "../forms/changePasswordForm";
import OptionMenu from "../components/config/options";

import '../static/css/pages/config.css';
import TitleConfig from "../components/config/title";

const ChangePassword = () => {

    const registerFormRef = useRef(null);

    const inputs = changePasswordInputs;

    function handleChangePasswordSubmit({values}){
        return null;
    }

    return(
        <FlatterPage withBackground >
            <TitleConfig>
                <OptionMenu/>
                <div className="form">
                    <div id="titleForm">
                        <img  className="imgTitle" src={require('../static/files/icons/candado.png')}></img>
                        <p className="pTitle">Cambiar Contraseña</p>
                    </div>
                    <FlatterForm
                        buttonText="Cambiar Contraseña"
                        showSuperAnimatedButton
                        numberOfColumns={1}
                        inputs={inputs}
                        onSubmit={handleChangePasswordSubmit}
                        ref={registerFormRef}/>
                </div>
            </TitleConfig>
        </FlatterPage>
    );
}

export default ChangePassword