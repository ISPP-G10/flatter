import { propertyValidators } from "../libs/validators/propertyValidation"

export const propertyInputs = [
    {
      tag: 'Título de la propiedad',
      name: 'title',
      type: 'text',
      defaultValue: "",
      isRequired: true,
      validators: [
        propertyValidators.notEmptyValidator,
        propertyValidators.namesLengthValidator
      ]
    },
    {
      tag: 'Precio',
      name: 'price',
      type: 'number',
      defaultValue: "",
      isRequired: true,
      validators: [
        propertyValidators.minPrice,
        propertyValidators.maxPrice
      ]
    },
    {
      tag: 'Provincia',
      name: 'province',
      type: 'text',
      defaultValue: "",
      isRequired: true,
      validators: [
        propertyValidators.notEmptyValidator
      ]
    },
    {
      tag: 'Municipio',
      name: 'location',
      type: 'text',
      defaultValue: "",
      isRequired: true,
      validators: [
        propertyValidators.notEmptyValidator
      ]
    },
    {
      tag: 'Dimensiones (m2)',
      name: 'dimensions',
      type: 'number',
      defaultValue: "5",
      isRequired: true,
      validators: [
        propertyValidators.minDimensions,
        propertyValidators.maxDimensions
      ]
    },
    {
      tag: 'Descripción',
      name: 'description',
      type: 'textarea',
      defaultValue: "",
      isRequired: false,
      validators: [] 
    },
    {
      tag: 'Imágenes de la propiedad',
      name: 'images',
      type: 'files',
      defaultValue: "",
      isRequired: false,
      validators: [] 
    },
    {
      tag: 'Habitaciones',
      name: 'bedroomsNumber',
      type: 'number',
      defaultValue: "1",
      isRequired: true,
      validators: [
        propertyValidators.minRooms,
        propertyValidators.maxRooms
      ]
    },
    {
      tag: 'Baños',
      name: 'bathroomsNumber',
      type: 'number',
      defaultValue: "1",
      isRequired: true,
      validators: [
        propertyValidators.minBaths,
        propertyValidators.maxBaths
      ]
    },
    {
      tag: 'Capacidad',
      name: 'maxCapacity',
      type: 'number',
      defaultValue: "1",
      isRequired: true,
      validators: [
        propertyValidators.minCapacity,
        propertyValidators.maxCapacity
      ]
    }
]