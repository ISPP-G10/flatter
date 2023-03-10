export const requestValidators = {
    notEmptyValidator: {
        validate: (value) => value.trim().length > 0,
        message: "El campo no puede estar vacío"
    },
    
    requestsTextLengthValidator: {
        validate: (value) => value.trim().length >= 2 && value.trim().length <= 256,
        message: "El campo debe tener entre 2 y 256 caracteres"
    },

    requestsTitleLengthValidator: {
        validate: (value) => value.trim().length >= 2 && value.trim().length <= 64,
        message: "El campo debe tener entre 2 y 64 caracteres"
    },
}