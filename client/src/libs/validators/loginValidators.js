export const loginValidators = {
    notEmptyValidator: {
        validate: (value) => {
            return value.trim().length > 0
        },
        message: "El campo no puede estar vacío"
    }
}