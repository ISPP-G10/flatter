import FlatterForm from "../forms/flatterForm";
import usersAPI from '../../api/usersAPI';
import * as settings from '../../settings';

import { useApolloClient } from '@apollo/client';
import { useRef, useState } from "react";

const AccountSettingsForm = ({inputs, data, correctModalRef}) => {

    let [userImage, setUserImage] = useState(null);

    const client = useApolloClient();

    const accountFormRef = useRef(null);
    const userImageField = useRef(null);

    function performUserMutation(values, encodedImage){
        client.mutate({
            mutation: usersAPI.updatePrivateProfile,
            variables: {
                username: localStorage.getItem('user', ''),
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                genre: values.genre,
                role: values.role,
                profilePicture: encodedImage,
                phone: values.phoneNumber,
                profilePicture: data.profilePicture,

            }
        })
        .then((response) => {
            let roles = response.data.editUserPrivate.user.roles.map((role) => role.role);

            localStorage.setItem('roles', roles);

            window.location.reload();
        })
        .catch((error) => alert(error.message));
    }

    function handleAccountFormSubmit({values}){

        if(accountFormRef.current){

            if(!accountFormRef.current.validate()) return;

            try{
                let reader = new FileReader();
                reader.readAsDataURL(userImage);

                reader.onload = function () {
                    performUserMutation(values, reader.result);
                };
            }catch(error){
                performUserMutation(values, null);
            }
        }
    }

    function changeImage(e){

        let file = e.target.files[0];

        userImageField.current.src = URL.createObjectURL(file);

        setUserImage(file);
    }

    return(
        <>
            <h2 className='section-title'>Mi cuenta</h2>
            <FlatterForm
                ref={accountFormRef}
                inputs={inputs}
                numberOfColumns={2}
                buttonText='Guardar cambios'
                onSubmit={handleAccountFormSubmit}
                showSuperAnimatedButton
            >
                <div className="setting-profile-pic">
                    <label className="-label" htmlFor="file">
                        <img src={require('../../static/files/icons/camera.png')} alt="camara" className="camera-icon"/>
                        <span style={{margin: '0'}}>Cambiar</span>
                    </label>
                    <input id="file" type="file" onChange={changeImage}/>
                    <img ref={userImageField} className="user-img" src={settings.API_SERVER_MEDIA + data.getUserByUsername.profilePicture} id="output" width="200" alt="Imagen de perfil"/>
                </div>
            </FlatterForm>
        </>
    )
}

export default AccountSettingsForm;