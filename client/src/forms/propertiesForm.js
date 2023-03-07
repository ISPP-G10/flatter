import { registerValidators } from "../libs/validators/registerValidators"

export const propertyInputs = [
    {
      title: {
          label: 'Título de la propiedad',
          placeholder: 'Introduce un título para tu propiedad',
          type: 'text',
          flex: 3,
      },
      price: {
          label: 'Precio',
          placeholder: '50',
          type: 'number',
          flex: 1
      }
    },
    {
      province: {
          label: 'Provincia',
          default: 'Seleccionar',
          type: 'select',
          flex: 1,
          options: [{
              id: 1,
              text: 'Sevilla',
          }, {
              id: 2,
              text: 'Valencia',
          }]
      },
      location: {
          label: 'Municipio',
          placeholder: 'Introduce el municipio de tu propiedad',
          type: 'text',
          flex: 1
      },
      dimensions: {
        label: 'Dimensiones en m2',
        placeholder: '100',
        default: "0",
        type: 'number',
        flex: 1
      }
    },
    {
      description: {
          label: 'Descripción',
          placeholder: 'Descripción de tu propiedad',
          type: 'textarea',
          flex: 4
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
                flex: 1
            },
            bathroomsNumber: {
                label: 'Baños',
                placeholder: '2',
                default: "",
                type: 'number',
                flex: 1
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