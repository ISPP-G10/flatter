import Hero from '../sections/hero';
import SolidButton from '../sections/solidButton';

import ImageUploader from '../sections/imageUploader';

import FormBuilder from './formBuilder';

import PropTypes from "prop-types";

const FormProperty = ({ property }) => {

  const formSchema = [
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
            default: 50,
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
          default: "",
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
        flex: 1
      }
    },
    {
      group: {
        flex: 1,
        type: 'group',
        flexType: 'vertical',
        children: 
          {
            bedrooms_number: {
                label: 'Habitaciones',
                placeholder: '3',
                default: "",
                type: 'number',
                flex: 1
            },
            bathrooms_number: {
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

  const editProperty = () => {};

  return (
    <FormBuilder inputs={ formSchema } values={ property } />
  );
};

export default FormProperty