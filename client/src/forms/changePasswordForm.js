import { registerValidators } from "../libs/validators/registerValidators"

export const changePasswordInputs = [
    {
        tag: "Contraseña actual",
        name: "newPassword",
        type: "password",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.passwordLengthValidator
        ]
    },
    {
        tag: "Contraseña nueva",
        name: "newPassword",
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
        name: "newPassword2",
        type: "password",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.passwordLengthValidator
        ]
    }
]