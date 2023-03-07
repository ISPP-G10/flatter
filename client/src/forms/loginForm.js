const notEmptyValidator = {
    validate: (value) => {
        return value.trim().length > 0
    },
    message: "El campo no puede estar vacío"
}

export const loginInputs = [
    {
        tag: "Nombre de usuario",
        name: "username",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            notEmptyValidator
        ]
    },
    {
        tag: "Contraseña",
        name: "password",
        type: "password",
        defaultValue: "",
        isRequired: true,
        validators: [
            notEmptyValidator
        ]
    }
]