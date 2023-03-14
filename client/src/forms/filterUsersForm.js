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