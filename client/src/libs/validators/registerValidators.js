export const registerValidators = {
    notEmptyValidator: {
        validate: (value) => value.trim().length > 0,
        message: "El campo no puede estar vacío"
    },
    
    noNumbersValidator: {
        validate: (value) => !value.match(/\d+/g),
        message: "El campo no puede contener números"
    },
    
    namesLengthValidator: {
        validate: (value) => value.trim().length >= 3 && value.trim().length <= 50,
        message: "El campo debe tener entre 3 y 50 caracteres"
    },
    
    usernameLengthValidator: {
        validate: (value) => value.trim().length >= 6 && value.trim().length < 25,
        message: "El campo debe tener entre 6 y 25 caracteres"
    },
    
    passwordLengthValidator: {
        validate: (value) => value.trim().length >= 6,
        message: "El campo debe tener al menos 6 caracteres"
    },
    
    emailValidator: {
        validate: (value) => value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
        message: "El campo debe ser un email válido"
    },
    
    validGenre: {
        validate: (value) => {
            let validGenres = ['Hombre', 'Mujer', 'No Binario', 'Otro'];
            return validGenres.includes(value);
        },
        message: "El campo debe ser un género válido",
    },
    
    validRole: {
        validate: (value) => {
            let validRoles = ['Propietario', 'Inquilino', 'Ambos'];
            return validRoles.includes(value);
        },
        message: "El campo debe ser un rol válido",
    },

    phoneNumber: {
        validate: (value) => value.match(/^(?:[9|6|7][0-9]{8})?$/),
        message: "El campo debe ser un número válido"
    }
}