export const publicProfileValidator = {
    notPastDate: {
        validate: (value) => {
            return new Date(value) < new Date();
        },
        message: "La fecha no puede ser posterior a la actual"
    }
}