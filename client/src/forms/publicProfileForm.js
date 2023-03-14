import { registerValidators } from "../libs/validators/registerValidators"

export const publicProfileFormInputs = [
    {
        tag: "Biografía",
        name: "biography",
        type: "textarea",
        defaultValue: "",
        isRequired: false,
        validators: []
    },
    {
        tag: "Profesión",
        name: "profession",
        type: "text",
        defaultValue: "",
        isRequired: false,
        validators: [
            registerValidators.noNumbersValidator,
        ]
    },
]