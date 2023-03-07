import { loginValidators } from "../libs/validators/loginValidators";

export const loginInputs = [
    {
        tag: "Nombre de usuario",
        name: "username",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            loginValidators.notEmptyValidator
        ]
    },
    {
        tag: "Contraseña",
        name: "password",
        type: "password",
        defaultValue: "",
        isRequired: true,
        validators: [
            loginValidators.notEmptyValidator
        ]
    }
]