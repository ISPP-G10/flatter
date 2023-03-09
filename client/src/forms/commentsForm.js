import { commentsValidators } from "../libs/validators/commentsValidators"

export const commentsFormInputs = [
    {
        tag: "Relación",
        name: "relationship",
        type: "select",
        defaultValue: "Amigo",
        isRequired: true,
        values: ['Amigo', 'Compañero', 'Excompañero', 'Propietario'],
        validators: [
            commentsValidators.notEmptyValidator,
            commentsValidators.validRelationship
        ],
    },
    {
        tag: "Comentario",
        name: "comment",
        type: "textarea",
        defaultValue: "",
        isRequired: true,
        validators: [
            commentsValidators.notEmptyValidator,
            commentsValidators.commentsLengthValidator
        ]
    },

];