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
    },
    validDate: {
        validate: (startdate, enddate) => {
            const startDateObj = new Date(startdate);
            const endDateObj = new Date(enddate);
            return startDateObj < endDateObj;
        },
        message: "La fecha de inicio debe ser anterior a la fecha de fin",
    }

}