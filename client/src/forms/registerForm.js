import { registerValidators } from "../libs/validators/registerValidators"

export const registerInputs = [
    {
        tag: "Nombre",
        name: "first_name",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.noNumbersValidator,
            registerValidators.namesLengthValidator
        ]
    },
    {
        tag: "Apellidos",
        name: "last_name",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.noNumbersValidator,
            registerValidators.namesLengthValidator
        ]
    },
    {
        tag: "Género",
        name: "genre",
        type: "select",
        defaultValue: "Hombre",
        isRequired: true,
        values: ['Hombre', 'Mujer', 'No Binario', 'Otro'],
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.validGenre
        ],
    },
    {
        tag: "Rol",
        name: "role",
        type: "select",
        defaultValue: "Propietario",
        isRequired: true,
        values: ['Propietario', 'Inquilino', 'Ambos'],
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.validRole
        ],
    },
    {
        tag: "Nombre de usuario",
        name: "username",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.usernameLengthValidator
        ]
    },
    {
        tag: "Contraseña",
        name: "password",
        type: "password",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.passwordLengthValidator
        ]
    },
    {
        tag: "Email",
        name: "email",
        type: "email",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.emailValidator
        ]
    }
]