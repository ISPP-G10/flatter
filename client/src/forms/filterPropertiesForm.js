import { registerValidators } from "../libs/validators/registerValidators"

export const filterInputs = [
    {
        tag: "Provincia",
        name: "province",
        type: "select",
        values: ["-"],
        defaultValue: "-",
        isRequired: false,
        validators: [
            registerValidators.noNumbersValidator,
        ]
    },
    {
        tag: "Municipio",
        name: "municipality",
        type: "select",
        values: ["-"],
        defaultValue: "-",
        isRequired: false,
        validators: [
            registerValidators.noNumbersValidator,
        ]
    },
    {
        tag: "Etiqueta",
        name: "tag",
        type: "select",
        values: [],
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