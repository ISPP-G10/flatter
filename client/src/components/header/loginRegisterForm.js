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
    const [currentFormValues, setCurrentFormValues] = useState({
        genre: 'Hombre',
        role: 'Propietario'
    });

    useImperativeHandle(ref, () => {
        return{
            register: () => setCurrentForm('register'),
            login: () => setCurrentForm('login'),
            getFormValues: () => currentFormValues
        };
    });

    function sendRegisterForm(e){
        e.preventDefault();
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

            navigator('/main-page');
        }).catch((error) => {
            console.log(error);
        });
    }

    function sendLoginForm(e){
        e.preventDefault();
        client.mutate({
            mutation: usersAPI.logUser,
            variables: {
                username: currentFormValues.username,
                password: currentFormValues.password,
            }
        }).then((response) => {
            let token = response.data.tokenAuth.token;
            let username = response.data.tokenAuth.user.username;

            localStorage.setItem('token', token);
            localStorage.setItem('user', username);

            navigator('/main-page');
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        let inputs = document.querySelectorAll('input, select');

        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                currentFormValues[e.target.name] = e.target.value;
            });
        });
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
                    </form>
                    
            }
        </div>
    );
});

export default LoginRegisterForm;