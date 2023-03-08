import { registerValidators } from "../libs/validators/registerValidators"

export const changePasswordInputs = [
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
        tag: "Repite Contraseña",
        name: "password",
        type: "password",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.passwordLengthValidator
        ]
    }
]