import { requestValidators } from "../libs/validators/requestValidators.js";

export const requestInputs = [
    {
        tag: "Título",
        name: "title",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            requestValidators.notEmptyValidator,
            requestValidators.requestsTitleLengthValidator
        ]
    },
    {
        tag: "Sugerencia",
        name: "description",
        type: "textarea",
        defaultValue: "",
        isRequired: true,
        validators: [
            requestValidators.notEmptyValidator,
            requestValidators.requestsTextLengthValidator
        ]
    },
]