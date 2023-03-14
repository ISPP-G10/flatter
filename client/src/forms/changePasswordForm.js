import { registerValidators } from "../libs/validators/registerValidators"
import { changePasswordValidators } from "../libs/validators/changePasswordValidators"

export const changePasswordInputs = [
    {
        tag: "Contraseña actual",
        name: "oldPassword",
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
            registerValidators.passwordLengthValidator,
            changePasswordValidators.notSameAsOldPassword
        ]
    },
    {
        tag: "Repite Contraseña",
        name: "newPasswordConfirm",
        type: "password",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.passwordLengthValidator,
            changePasswordValidators.samePassword
        ]
    }
]