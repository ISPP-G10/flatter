import { couponValidators } from "../libs/validators/couponValidators";

export const couponFormInputs = [
    {
        tag: "Cupón de descuento o regalo",
        name: "code",
        type: "text",
        defaultValue: "",
        isRequired: true,
        validators: [
            couponValidators.notEmptyValidator,
            couponValidators.maxLengthValidator,
        ]
    },
];