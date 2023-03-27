import { commentsValidators } from "../libs/validators/commentsValidators"

export const propertyRequestsInputs = [
    {
        tag: "Mensaje",
        name: "message",
        type: "textarea",
        defaultValue: "¡Hola! Estoy interesado en alquilar el inmmueble. Muchas gracias.",
        isRequired: true,
        validators: [
            commentsValidators.notEmptyValidator,
            commentsValidators.commentsLengthValidator
        ]
    },

];