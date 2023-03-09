import { propertyValidators } from "../libs/validators/propertyValidation"

export const propertyInputs = [
    {
      title: {
          label: 'Título de la propiedad',
          placeholder: 'Introduce un título para tu propiedad',
          type: 'text',
          flex: 3,
          validators: [
            propertyValidators.notEmptyValidator,
            propertyValidators.noNumbersValidator,
            propertyValidators.namesLengthValidator
          ]
      },
      price: {
          label: 'Precio',
          placeholder: '50',
          type: 'number',
          flex: 1,
          validators: [
            propertyValidators.minPrice,
            propertyValidators.maxPrice
          ]
      }
    },
    {
      province: {
          label: 'Provincia',
          type: 'text',
          flex: 1,
          validators: [
            propertyValidators.notEmptyValidator
          ]
      },
      location: {
          label: 'Municipio',
          placeholder: 'Introduce el municipio de tu propiedad',
          type: 'text',
          flex: 1,
          validators: [
            propertyValidators.notEmptyValidator
          ]
      },
      dimensions: {
        label: 'Dimensiones en m2',
        placeholder: '100',
        default: "0",
        type: 'number',
        flex: 1,
        validators: [
          propertyValidators.minDimensions,
          propertyValidators.maxDimensions
        ]
      }
    },
    {
      description: {
          label: 'Descripción',
          placeholder: 'Descripción de tu propiedad',
          type: 'textarea',
          flex: 4,
          validators: [
            propertyValidators.notEmptyValidator
          ]
      }
    },
    {
      gallery: {
        label: 'Galería',
        type: 'imageUploader',
        flex: 1,
        name: 'property-gallery'
      }
    },
    {
      group: {
        flex: 1,
        type: 'group',
        flexType: 'vertical',
        children: 
          {
            bedroomsNumber: {
                label: 'Habitaciones',
                placeholder: '3',
                default: "",
                type: 'number',
                flex: 1,
                validators: [
                  propertyValidators.minRooms,
                  propertyValidators.maxRooms
                ]
            },
            bathroomsNumber: {
                label: 'Baños',
                placeholder: '2',
                default: "",
                type: 'number',
                flex: 1,
                validators: [
                  propertyValidators.minBaths,
                  propertyValidators.maxBaths
                ]
            }
          }
        
      },
      tags: {
          label: 'Etiquetas',
          placeholder: 'Selecciona hasta 8 etiquetas',
          default: "",
          type: 'textarea',
          flex: 1
      },
    },
    {
      is_oustanding: {
        label: 'Destaca tu propiedad y gana visibilidad',
        type: 'checkbox',
        flex: 1
      },
      submit: {
        type: 'submit',
        text: 'Guardar'
      }
    }
]