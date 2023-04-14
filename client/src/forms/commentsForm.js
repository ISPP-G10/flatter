import { commentsValidators } from "../libs/validators/commentsValidators"

export const commentsInputs = [
    {
        tag: "Relación",
        name: "relationship",
        type: "select",
        defaultValue: "Amigo",
        isRequired: true,
        values: [],
        validators: [
            commentsValidators.notEmptyValidator,
            commentsValidators.validRelationship
        ],
    },
    {
        tag: "Reseña",
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