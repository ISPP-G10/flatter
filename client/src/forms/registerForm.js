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
        tag: "Email",
        name: "email",
        type: "email",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.emailValidator
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
        tag: "Confirmar contraseña",
        name: "passwordConfirm",
        type: "password",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.passwordLengthValidator
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
        tag: "Código de invitación o de regalo",
        name: "code",
        type: "text",
        defaultValue: "",
        isRequired: false,
        validators: [
            registerValidators.codeLengthValidator
        ]
    }
]