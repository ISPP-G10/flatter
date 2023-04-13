import { filterRequestsValidators } from "../libs/validators/filterRequestsValidators"

export const filterRequestsInputs = [

    {
        tag: "Estado",
        name: "status",
        type: "select",
        defaultValue: "Todas",
        isRequired: true,
        values: ['Todas', 'Aceptadas', 'Rechazadas', 'Pendientes', 'Pagadas'],
        validators: [
            filterRequestsValidators.notEmptyValidator,
            filterRequestsValidators.validStatus
        ],
    },
    {
        tag: "Fecha Inicio",
        name: "startdate",
        type: "date",
        defaultValue: "",
        isRequired: false,
        validators: [
        ],
    },
    {
        tag: "Fecha Fin",
        name: "enddate",
        type: "date",
        defaultValue: "",
        isRequired: false,
        validators: [
            {
                validate: (value) => {
                    const startdate = document.querySelector('[name="startdate"]').value;
                    const enddate = value;
                    if (startdate && enddate) {
                        return filterRequestsValidators.validDate.validate(startdate, enddate);
                    } else {
                        return true;
                    }
                },
                message: filterRequestsValidators.validDate.message
            }
        ],
    }


]