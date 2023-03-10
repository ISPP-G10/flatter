import { registerValidators } from "../libs/validators/registerValidators"

export const filterInputs = [
    {
        tag: "Ciudad",
        name: "province",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.noNumbersValidator,
            registerValidators.namesLengthValidator
        ]
    },
    {
        tag: "Precio",
        name: "price",
        type: "interval",
        min: 0,
        max: 2000,
        defaultValue: "",
        isRequired: true,
        validators: [
        ]
    }
]