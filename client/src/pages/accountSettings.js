import '../static/css/pages/settings.css';

import FlatterPage from "../sections/flatterPage";
import usersAPI from '../api/usersAPI';
import FlatterModal from '../components/flatterModal';
import AccountSettingsForm from '../components/userSettings/accountSettingsForm';

import { useEffect, useRef, useState } from "react";
import { accountInputs } from "../forms/accountForm";
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import PasswordSettingForm from '../components/userSettings/passwordSettingForm';
import Incidence from '../components/userSettings/incidence';
import Request from '../components/userSettings/request';

const AccountSettings = () => {

    let [setting, setSetting] = useState('account');
    
    const navigator = useNavigate();
    const correctModalRef = useRef(null);

    const { loading, data } = useQuery(usersAPI.getUserByUsernameSettings, {
        variables: {username: localStorage.getItem('user', '')}
    });

    function logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = "/";
    }

    useEffect(() => {
        if(!loading && setting === 'account'){
            //eslint-disable-next-line
            accountInputs.map((input) => {
                if(input.name === 'role'){
                    if(data.getUserByUsername[input.name + 's'].length > 1){
                        input.defaultValue = 'Ambos';
                    }else{
                        let currentBackendRole = data.getUserByUsername[input.name + 's'][0].role;
                        if(currentBackendRole === 'OWNER'){
                            input.defaultValue = 'Propietario';
                        }else{
                            input.defaultValue = 'Inquilino';
                        }            
                    }
                }else if(input.name === 'genre'){
                    switch(data.getUserByUsername[input.name]){
                        case 'H':
                            input.defaultValue = 'Hombre';
                            break;
                        case 'M':
                            input.defaultValue = 'Mujer';
                            break;
                        case 'NB':
                            input.defaultValue = 'No Binario';
                            break;
                        default:
                            input.defaultValue = 'Otro';
                    }
                }else{
                    input.defaultValue = data.getUserByUsername[input.name];
                }
            });
        }
    }, [data, loading, setting]);

    return(
        <FlatterPage withBackground userLogged>
            <div className='settings-page-container'>
                <div className='settings-title'>
                    <h1>Configuración de la cuenta</h1>
                </div>
                <div className='settings-content'>
                    <div className='settings-sections'>
                        <h2 className='settings-sections-title'>Opciones</h2>
                        <div className='settings-section' onClick={() => setSetting('account')} style={setting === 'account' ? {backgroundColor: 'rgba(0, 168, 255, 0.8)', color: 'white'} : {}}>
                            <h4>Mi cuenta</h4>
                        </div>
                        <div className='settings-section' onClick={() => setSetting('password')} style={setting === 'password' ? {backgroundColor: 'rgba(0, 168, 255, 0.8)', color: 'white'} : {}}>
                            <h4>Cambiar contraseña</h4>
                        </div>
                        <div className='settings-section' onClick={() => setSetting('incidence')} style={setting === 'incidence' ? {backgroundColor: 'rgba(0, 168, 255, 0.8)', color: 'white'} : {}}>
                            <h4>Abrir incidencia</h4>
                        </div>
                        <div className='settings-section' onClick={() => setSetting('request')} style={setting === 'request' ? {backgroundColor: 'rgba(0, 168, 255, 0.8)', color: 'white'} : {}}>
                            <h4>Sugerir cambios</h4>
                        </div>
                        <div className='settings-section' onClick={() => navigator(`/profile/${localStorage.getItem("user", "")}`)}>
                            <h4>Ver mi perfil público</h4>
                        </div>
                        <div className='settings-section' onClick={logout}>
                            <h4>Cerrar sesión</h4>
                        </div>
                    </div>
                    <div className='setting-body'>
                        <div className='setting-form-container'>
                            {
                                loading ? 
                                    <h1>Loading...</h1>
                                :
                                    setting === 'account' ?
                                        <AccountSettingsForm inputs={accountInputs} data={data} correctModalRef={correctModalRef}/>
                                    :
                                        setting === 'password' ?
                                            <PasswordSettingForm correctModalRef={correctModalRef}/>
                                        :
                                            setting === 'incidence' ?
                                                <Incidence />
                                            :
                                                setting === 'request' ?
                                                    <Request />
                                                :
                                                    <></>

                            }
                        </div>
                    </div>
                </div>
            </div>
            <FlatterModal ref={correctModalRef} maxHeight={200}>
                <span className='everithing-fine-text'>¡Datos actualizados correctamente!</span>
            </FlatterModal>
        </FlatterPage>
    );

}

export default AccountSettings