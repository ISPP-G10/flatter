export const couponValidators = {
    notEmptyValidator: {
        validate: (value) => value.trim().length > 0,
        message: "El campo no puede estar vacío"
    },
    
    maxLengthValidator: {
        validate: (value) => value.trim().length < 64,
        message: "El campo no puede tener más de 64 caracteres"
    },

}