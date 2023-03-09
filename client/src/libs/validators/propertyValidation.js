import { interpolate } from "framer-motion"
import { RedIntegerFormat } from "three"

export const propertyValidators = {
    minPrice: {
        validate: (value) => parseInt(value)>0,
        message: "El valor debe ser mayor de 0"
    },

    maxPrice: {
        validate: (value) => parseInt(value)<5000,
        message: "El valor debe ser menor de 5000"
    },

    minDimensions: {
        validate: (value) => parseInt(value)>0,
        message: "El valor debe ser mayor de 0"
    },

    maxDimensions: {
        validate: (value) => parseInt(value)<320,
        message: "El valor debe ser menor de 5000"
    },

    minRooms: {
        validate: (value) => parseInt(value)>0,
        message: "El valor debe ser mayor de 0"
    },

    maxRooms: {
        validate: (value) => parseInt(value)<320,
        message: "El valor debe ser menor de 30"
    },

    minBaths: {
        validate: (value) => parseInt(value)>0,
        message: "El valor debe ser mayor de 0"
    },

    maxBaths: {
        validate: (value) => parseInt(value)<320,
        message: "El valor debe ser menor de 8"
    },

    notEmptyValidator: {
        validate: (value) => value.trim().length > 0,
        message: "El campo no puede estar vacío"
    },
    
    noNumbersValidator: {
        validate: (value) => !value.match(/\d+/g),
        message: "El campo no puede contener números"
    },
    
    namesLengthValidator: {
        validate: (value) => value.trim().length >= 3 && value.trim().length <= 50,
        message: "El campo debe tener entre 3 y 50 caracteres"
    },
    
    usernameLengthValidator: {
        validate: (value) => value.trim().length >= 6 && value.trim().length < 25,
        message: "El campo debe tener entre 6 y 25 caracteres"
    },
    
    passwordLengthValidator: {
        validate: (value) => value.trim().length >= 6,
        message: "El campo debe tener al menos 6 caracteres"
    },
    
    emailValidator: {
        validate: (value) => value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
        message: "El campo debe ser un email válido"
    },
    
    validGenre: {
        validate: (value) => {
            let validGenres = ['Hombre', 'Mujer', 'No Binario', 'Otro'];
            return validGenres.includes(value);
        },
        message: "El campo debe ser un género válido",
    },
    
    validRole: {
        validate: (value) => {
            let validRoles = ['Propietario', 'Inquilino', 'Ambos'];
            return validRoles.includes(value);
        },
        message: "El campo debe ser un rol válido",
    },
}