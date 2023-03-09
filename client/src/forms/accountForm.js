import { registerValidators } from "../libs/validators/registerValidators"

export const accountInputs = [
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
        tag: "Número de teléfono",
        name: "phone_number",
        type: "tel",
        defaultValue: "",
        isRequired: false,
        validators: [
            registerValidators.phoneNumber,
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