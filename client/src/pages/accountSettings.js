import '../static/css/pages/settings.css';

import FlatterPage from "../sections/flatterPage";
import FlatterForm from "../components/forms/flatterForm";
import usersAPI from '../api/usersAPI';

import { useEffect, useRef, useState } from "react";
import { accountInputs } from "../forms/accountForm";
import { useQuery, useApolloClient } from '@apollo/client';
import * as settings from '../settings';
import FlatterModal from '../components/flatterModal';
import { removeFragmentSpreadFromDocument } from '@apollo/client/utilities';

const AccountSettings = () => {

    let [userImage, setUserImage] = useState(null);

    const accountFormRef = useRef(null);
    const userImageField = useRef(null);
    const correctModalRef = useRef(null);
    const client = useApolloClient();

    const { loading, error, data } = useQuery(usersAPI.getUserByUsernameSettings, {
        variables: {username: localStorage.getItem('user', '')}
    });

    function handleFormSubmit({values}){

        if(!accountFormRef.current.validate()) {
            
            alert('Hay campos incorrectos. Por favor, revise el formulario')
            
            return;
        }

        var reader = new FileReader();
        reader.readAsDataURL(userImage);

        reader.onload = function () {
            client.mutate({
                mutation: usersAPI.updateUser,
                variables: {
                    username: localStorage.getItem('user', ''),
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    genre: values.genre,
                    role: values.role,
                    profilePicture: reader.result,
                    phoneNumber: values.phoneNumber,
                }
            })
            .then((response) => {
                correctModalRef.current.open();
            })
            .catch((error) => alert(error.message.split("\n")[1]));
        };

    }

    function changeImage(e){

        let file = e.target.files[0];

        userImageField.current.src = URL.createObjectURL(file);

        setUserImage(file);
    }

    useEffect(() => {
        if(!loading){
            accountInputs.map((input) => {
                if(input.name === 'role'){
                    if(data.getUserByUsername[input.name + 's'].length > 1){
                        input.defaultValue = 'Ambos';
                    }else{
                        input.defaultValue = data.getUserByUsername[input.name + 's'][0].role;
                    }
                }else{
                    input.defaultValue = data.getUserByUsername[input.name];
                }
            });
        }
    }, [data]);

    return(
        <FlatterPage withBackground userLogged>
            <div className='settings-page-container'>
                <div className='settings-title'>
                    <h1>Configuración de la cuenta</h1>
                </div>
                <div className='settings-content'>
                    <div className='settings-sections'>
                        <h2 className='settings-sections-title'>Opciones</h2>
                        <div className='settings-section'>
                            <h4>Mi cuenta</h4>
                        </div>
                        <div className='settings-section'>
                            <h4>Cambiar contraseña</h4>
                        </div>
                    </div>
                    <div className='setting-body'>
                        <div className='setting-form-container'>
                            {
                                loading ? 
                                    <h1>Loading...</h1>
                                :
                                    <>
                                    <h2 className='section-title'>Mi cuenta</h2>
                                    <FlatterForm
                                    ref={accountFormRef}
                                    inputs={accountInputs}
                                    numberOfColumns={2}
                                    buttonText='Guardar cambios'
                                    onSubmit={handleFormSubmit}
                                    showSuperAnimatedButton
                                    >
                                        <div className="setting-profile-pic">
                                            <label className="-label" htmlFor="file">
                                                <img src={require('../static/files/icons/camera.png')} alt="camara" className="camera-icon"/>
                                                <span style={{margin: '0'}}>Cambiar</span>
                                            </label>
                                            <input id="file" type="file" onChange={changeImage}/>
                                            <img ref={userImageField} className="user-img" src={settings.API_SERVER_MEDIA + data.getUserByUsername.profilePicture} id="output" width="200" />
                                        </div>
                                    </FlatterForm>   
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <FlatterModal ref={correctModalRef} maxHeight={300}>
                <span className='everithing-fine-text'>¡Datos actualizados correctamente!</span>
            </FlatterModal>
        </FlatterPage>
    );

}

export default AccountSettings