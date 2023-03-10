export const commentsValidators = {
    notEmptyValidator: {
        validate: (value) => value.trim().length > 0,
        message: "El campo no puede estar vacío"
    },
    
    commentsLengthValidator: {
        validate: (value) => value.trim().length >= 2 && value.trim().length <= 256,
        message: "El campo debe tener entre 2 y 256 caracteres"
    },

    validRelationship: {
        validate: (value) => {
            let validRelationships = ['Amigo', 'Excompañero', 'Compañero', 'Propietario'];
            return validRelationships.includes(value);
        },
        message: "El campo debe ser una relación válida",
    },
}