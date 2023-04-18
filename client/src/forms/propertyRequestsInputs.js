import { commentsValidators } from "../libs/validators/commentsValidators";


export const propertyRequestsInputs = (nombre,edad,profesion) => ([
    {
        tag: "Mensaje",
        name: "message",
        type: "textarea",
        defaultValue: createMessage(nombre, edad, profesion),
        isRequired: true,
        validators: [
            commentsValidators.notEmptyValidator,
            commentsValidators.commentsLengthValidator
        ]
    },
]);

function createMessage(nombre, edad, profesion) {
    let message = `Hola, mi nombre es ${nombre}`;
    
    if(edad && profesion){
        message += `, tengo ${edad} años y mi profesión es ${profesion}`;
    }
    
    if (edad && !profesion) {
        message += `y tengo ${edad} años`;
    }
    if (profesion && !edad) {
        message += `y mi profesión es ${profesion}`;
    }
    message += `. Estoy interesado en alquilar el inmueble.`;
    return message;
}