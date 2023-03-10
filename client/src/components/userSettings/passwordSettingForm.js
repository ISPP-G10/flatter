import { changePasswordInputs } from '../../forms/changePasswordForm';
import { useApolloClient } from '@apollo/client';
import { useRef } from 'react';

import usersAPI from '../../api/usersAPI';
import FlatterForm from '../forms/flatterForm';

const PasswordSettingForm = ({correctModalRef}) => {

    const client = useApolloClient();    
    const accountFormRef = useRef(null);

    function handleAccountFormSubmit({values}){

        if(!accountFormRef.current.validate()) {
            
            alert('Hay campos incorrectos. Por favor, revise el formulario')
            
            return;
        }

        client.mutate({
            mutation: usersAPI.changeUserPassword,
            variables: {
                username: localStorage.getItem('user', ''),
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            }
        })
        .then((response) => {
            correctModalRef.current.open();
        })
        .catch((error) => alert(error.message));

    }

    return(
        <>
            <h2 className='section-title'>Cambiar contraseña</h2>
            <FlatterForm
                ref={accountFormRef}
                inputs={changePasswordInputs}
                numberOfColumns={1}
                buttonText='Cambiar contraseña'
                onSubmit={handleAccountFormSubmit}
                showSuperAnimatedButton
            />
        </>
    );
}

export default PasswordSettingForm;