import { registerValidators } from "../libs/validators/registerValidators"
import { publicProfileValidator } from "../libs/validators/publicProfileValidator"

export const publicProfileFormInputs = [
    {
        tag: "Nombre",
        name: "firstName",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.namesLengthValidator
        ]
    },
    {
        tag: "Apellidos",
        name: "lastName",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            registerValidators.notEmptyValidator,
            registerValidators.namesLengthValidator
        ]
    },
    {
        tag: "Biografía",
        name: "biography",
        type: "textarea",
        defaultValue: "",
        isRequired: false,
        validators: []
    },
    {
        tag: "Etiquetas",
        name: "tags",
        type: "flatter-tags",
        tagType: "user",
        defaultValues: [],
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
    // {
    //     tag: "Fecha de nacimiento",
    //     name: "birthDate",
    //     type: "date",
    //     defaultValue: "1900-01-01",
    //     isRequired: false,
    //     validators: [
    //         //publicProfileValidator.notPastDate,
    //     ]
    // }
]