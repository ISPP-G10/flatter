import { incidenceValidators } from "../libs/validators/incidenceValidators.js";

export const incidenceInputs = [
    {
        tag: "Título",
        name: "title",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            incidenceValidators.notEmptyValidator,
            incidenceValidators.incidencesTitleLengthValidator
        ]
    },
    {
        tag: "Incidencia",
        name: "description",
        type: "textarea",
        defaultValue: "",
        isRequired: true,
        validators: [
            incidenceValidators.notEmptyValidator,
            incidenceValidators.incidencesTextLengthValidator
        ]
    },
]