import { filterRequestsValidators } from "../libs/validators/filterRequestsValidators"

export const filterRequestsInputs = [

    {
        tag: "Estado",
        name: "status",
        type: "select",
        defaultValue: "Todas",
        isRequired: true,
        values: ['Pendientes', 'Aceptadas', 'Rechazadas', 'Todas'],
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
        isRequired: true,
        validators: [
        ],
    },
    {
        tag: "Fecha Fin",
        name: "enddate",
        type: "date",
        defaultValue: "",
        isRequired: true,
        validators: [
        ],
    }


]