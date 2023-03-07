const notEmptyValidator = {
    validate: (value) => value.trim().length > 0,
    message: "El campo no puede estar vacío"
}

const noNumbersValidator = {
    validate: (value) => !value.match(/\d+/g),
    message: "El campo no puede contener números"
}

const namesLengthValidator = {
    validate: (value) => value.trim().length >= 3 && value.trim().length <= 50,
    message: "El campo debe tener entre 3 y 50 caracteres"
}

const usernameLengthValidator = {
    validate: (value) => value.trim().length >= 6 && value.trim().length < 25,
    message: "El campo debe tener entre 6 y 25 caracteres"
}

const passwordLengthValidator = {
    validate: (value) => value.trim().length >= 6,
    message: "El campo debe tener al menos 6 caracteres"
}

const emailValidator = {
    validate: (value) => value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
    message: "El campo debe ser un email válido"
}


export const registerInputs = [
    {
        tag: "Nombre",
        name: "first_name",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            notEmptyValidator,
            noNumbersValidator,
            namesLengthValidator
        ]
    },
    {
        tag: "Apellidos",
        name: "last_name",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            notEmptyValidator,
            noNumbersValidator,
            namesLengthValidator
        ]
    },
    {
        tag: "Nombre de usuario",
        name: "username",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            notEmptyValidator,
            usernameLengthValidator
        ]
    },
    {
        tag: "Contraseña",
        name: "password",
        type: "password",
        defaultValue: "",
        isRequired: true,
        validators: [
            notEmptyValidator,
            passwordLengthValidator
        ]
    },
    {
        tag: "Email",
        name: "email",
        type: "email",
        defaultValue: "",
        isRequired: true,
        validators: [
            notEmptyValidator,
            emailValidator
        ]
    }
]