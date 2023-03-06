import '../../static/css/components/loginRegisterForm.css'

import SuperAnimatedButton from "../superAnimatedButton/superAnimatedButton";

import {useState, useImperativeHandle, forwardRef} from 'react';

const LoginRegisterForm = forwardRef((props, ref) => {

    const [currentForm, setCurrentForm] = useState('register');

    useImperativeHandle(ref, () => {
        return{
            register: () => setCurrentForm('register'),
            login: () => setCurrentForm('login'),
        };
    });

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
                            <SuperAnimatedButton>Iniciar Sesión</SuperAnimatedButton>
                        </div>
                    </form>
                    :
                    <form className="login-page-form">
                        <p>Regístrate</p>
                        <input type="text" id="first_name_register" name="first_name" placeholder="Nombre" required="True" />
                        <input type="text" id="last_name_register" name="last_name" placeholder="Apellidos" required="True" />
                        <input type="text" id="username_register" name="username" placeholder="Usuario" required="True" />
                        <input type="email" id="email_register" name="email" placeholder="Email" required="True" />
                        <input type="password" id="password_register" name="password" placeholder="Contraseña" required="True" />
                        <div style={{height: '50px', width: '150px'}}>
                            <SuperAnimatedButton>Regístrate</SuperAnimatedButton>
                        </div>
                    </form>
                    
            }
        </div>
    );
});

export default LoginRegisterForm;