import { registerValidators } from "../libs/validators/registerValidators"

export const filterInputs = [
    {
        tag: "Etiqueta",
        name: "tag",
        type: "text",
        defaultValue: "",
        isRequired: false,
        validators: [
            registerValidators.noNumbersValidator,
        ]
    },
    {
        tag: "Rol",
        name: "role",
        type: "select",
        values: ["Cualquiera", "Propietario", "Inquilino"],
        defaultValue: "Cualquiera",
        isRequired: false,
        validators: []
    },
    {
        tag: "Valoración",
        name: "rating",
        type: "interval",
        min: 0,
        max: 5,
        defaultValue: "",
        isRequired: false,
        validators: [
        ]
    }
]