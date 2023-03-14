import '../../static/css/components/loginRegisterForm.css'

import SuperAnimatedButton from "../superAnimatedButton/superAnimatedButton";

import {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import {useApolloClient} from '@apollo/client';
import {useNavigate} from 'react-router-dom';

import usersAPI from '../../api/usersAPI';

const LoginRegisterForm = forwardRef((props, ref) => {

    const client = useApolloClient();
    const navigator = useNavigate();

    const [currentForm, setCurrentForm] = useState('register');
    //eslint-disable-next-line
    const [currentFormValues, setCurrentFormValues] = useState({
        genre: 'Hombre',
        role: 'Propietario'
    });
    const [currentFormErrors, setCurrentFormErrors] = useState([]);

    useImperativeHandle(ref, () => {
        return{
            register: () => setCurrentForm('register'),
            login: () => setCurrentForm('login'),
            getFormValues: () => currentFormValues
        };
    });

    function sendRegisterForm(e){
        e.preventDefault();
        setCurrentFormErrors(validateRegisterForm(currentFormValues));

        if(currentFormErrors.length === 0){
            client.mutate({
                mutation: usersAPI.createUser,
                variables: {
                    firstName: currentFormValues.first_name,
                    lastName: currentFormValues.last_name,
                    username: currentFormValues.username,
                    password: currentFormValues.password,
                    email: currentFormValues.email,
                    genre: currentFormValues.genre,
                    roles: currentFormValues.role
                }
            }).then((response) => {
                let token = response.data.tokenAuth.token;
                let username = response.data.tokenAuth.user.username;

                localStorage.setItem('token', token);
                localStorage.setItem('user', username);

                navigator('/main');
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    function sendLoginForm(e){
        e.preventDefault();

        setCurrentFormErrors(validateLoginForm(currentFormValues));

        if(currentFormErrors.length === 0){
            
        }
    }

    useEffect(() => {
        let inputs = document.querySelectorAll('input, select');

        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                currentFormValues[e.target.name] = e.target.value;
                if(currentForm === 'login'){
                    setCurrentFormErrors(validateLoginForm(currentFormValues));
                }else{
                    setCurrentFormErrors(validateRegisterForm(currentFormValues));
                }
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentForm]);

    return (
        <div className="authentication-form">
            {
                
                currentForm === 'login'? 
                    
                    <form className="login-page-form">
                        <p>Inicia sesión</p>
                        <div className="login-inputs">
                            <input type="text" id="username" name="username" placeholder="Username" required="True" />
                            <input type="password" id="password" name="password" placeholder="Password" required="True" />
                        </div>
                        <div style={{height: '50px', width: '200px'}}>
                            <SuperAnimatedButton onClick={sendLoginForm}>Iniciar Sesión</SuperAnimatedButton>
                        </div>
                        <div className='errors-container'>
                            {
                                currentFormErrors.length > 0 && currentFormErrors.map((error, index) => {
                                    return <p key={index} className='error'>{error}</p>
                                })
                            }
                        </div>
                    </form>
                    :
                    <form className="login-page-form">
                        <p>Regístrate</p>
                        <input type="text" id="first_name_register" name="first_name" placeholder="Nombre" required="True" />
                        <input type="text" id="last_name_register" name="last_name" placeholder="Apellidos" required="True" />
                        <div className="selects-row" style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '100%'}}>
                            <span>Género: </span>
                            <select id="genre_register" name="genre" placeholder="Género" required="True">
                                <option>Hombre</option>
                                <option>Mujer</option>
                                <option>No Binario</option>
                                <option>Otro</option>
                            </select>
                            <span>Soy: </span>
                            <select id="genre_register" name="role" placeholder="Género" required="True">
                                <option>Propietario</option>
                                <option>Inquilino</option>
                                <option>Ambos</option>
                            </select>
                        </div>
                        <input type="text" id="username_register" name="username" placeholder="Usuario" required="True" />
                        <input type="password" id="password_register" name="password" placeholder="Contraseña" required="True" />
                        <input type="email" id="email_register" name="email" placeholder="Email" required="True" />
                        <div style={{height: '50px', width: '150px'}}>
                            <SuperAnimatedButton onClick={sendRegisterForm}>Regístrate</SuperAnimatedButton>
                        </div>
                        <div className='errors-container'>
                            {
                                currentFormErrors.length > 0 && currentFormErrors.map((error, index) => {
                                    return <p key={index} className='error'>{error}</p>
                                })
                            }
                        </div>
                    </form>
                    
            }
        </div>
    );
});

function validateLoginForm(formValues){
    let errors = [];

    if(formValues.username === '' || formValues.username === undefined){
        errors.push('El campo de usuario no puede estar vacío');
    }

    if(formValues.password === '' || formValues.password === undefined){
        errors.push('El campo de contraseña no puede estar vacío');
    }

    return errors;
}

function validateRegisterForm(formValues){
    let errors = [];

    try{
        for(let key in formValues){
            if(formValues[key] === '' || formValues[key] === undefined){
                errors.push('Todos los campos del formulario son obligatorios');
                break;
            }
        }
    
        if(formValues.first_name.length < 3 || formValues.first_name.length >= 50){
            errors.push('El nombre debe tener entre 3 y 50 caracteres');
        }
    
        if(formValues.last_name.length < 3 || formValues.last_name.length >= 50){
            errors.push('Los apellidos deben tener entre 3 y 50 caracteres');
        }
    
        if(formValues.username.length < 6 || formValues.username.length > 25){
            errors.push('El nombre de usuario debe tener entre 6 y 24 caracteres');
        }
    
        if(formValues.password.length < 6){
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }
    
        if(!formValues.email.includes('@') || formValues.email.includes('.') === false){
            errors.push('El email no es válido');
        }
    }catch(error){}

    return errors;

}

export default LoginRegisterForm;