export const filterRequestsValidators = {

    notEmptyValidator: {
        validate: (value) => value.trim().length > 0,
        message: "El campo no puede estar vacío"
    },

    validStatus: {
        validate: (value) => {
            let validStatus = ['Aceptadas', 'Rechazadas', 'Pendientes', 'Todas'];
            return validStatus.includes(value);
        },
        message: "El campo debe ser un estado válido",
    }
}