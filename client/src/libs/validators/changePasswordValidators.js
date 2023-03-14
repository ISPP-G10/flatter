export const changePasswordValidators = {
    samePassword: {
        validate: (value) => {
            let password = document.getElementById('newPassword').value;
            return value === password;
        },
        message: "Las contraseñas debe coincidir"
    },
    notSameAsOldPassword: {
        validate: (value) => {
            let password = document.getElementById('oldPassword').value;
            return value !== password;
        },
        message: "La contraseña nueva no puede ser igual a la anterior"
    },
}