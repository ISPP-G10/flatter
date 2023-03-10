import { registerValidators } from "../libs/validators/registerValidators"

export const filterInputs = [
    {
        tag: "Ciudad",
        name: "province",
        type: "text",
        defaultValue: "",
        isRequired: false,
        validators: [
            registerValidators.noNumbersValidator,
        ]
    },
    {
        tag: "Precio",
        name: "price",
        type: "interval",
        min: 0,
        max: 2000,
        defaultValue: "",
        isRequired: false,
        validators: [
        ]
    }
]