import Hero from '../sections/hero';
import SolidButton from '../sections/solidButton';

import ImageUploader from '../sections/imageUploader';

import PropTypes from "prop-types";

const FormProperty = ({ property }) => {
  const isSet = property.id !== undefined;

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

  const recursiveRender = (group) => {
    return Object.entries(group).map(([key, value]) => {
      const propValue = property[key];
      switch (value.type) {
        case "text":
        case "number":
          return (
            <label key={key} style={{ flex: value.flex }}>
              {value.label}
              <input
                type={value.type}
                name={key}
                defaultValue={propValue || value.default}
                placeholder={value.placeholder}
              />
            </label>
          );
        case "checkbox":
          return (
            <label key={key} style={{ flex: value.flex }}>
              {value.label}
              <input
                type={value.type}
                name={key}
                defaultChecked={propValue || value.default}
              />
            </label>
          );
        case "select":
          return (
            <label key={key} style={{ flex: value.flex }}>
              {value.label}
              <select
                name={key}
                defaultValue={propValue || value.default}
              >
                <option disabled>{value.default}</option>
                {value.options.map(({ id, text }) => (
                  <option key={id} value={text}>
                    {text}
                  </option>
                ))}
              </select>
            </label>
          );
        case "textarea":
          return (
            <label key={key} style={{ flex: value.flex }}>
              {value.label}
              <textarea
                name={key}
                defaultValue={propValue || value.default}
                placeholder={value.placeholder}
              />
            </label>
          );
        case "imageUploader":
          return (
            <label key={key} style={{ flex: value.flex }}>
              {value.label}
              <ImageUploader />
            </label>
          );
        case "group":
          console.log('fncionaaa');
          return (
            <div
              className="form-group-parent"
              key={key}
              style={{ flex: value.flex }}
            >
              {recursiveRender(value.children)}
            </div>
          );
          break;

        case "submit":
        case "button":
          return (
            <div className="input-button" key={key} style={{ flex: value.flex }}>
              <SolidButton type={ value.type } text={ value.text } />
            </div>
          );

        default:
          return null;
      }
    });
  };

  return (
    <form
      onSubmit={
        isSet
          ? function () {
              console.log("Editando propiedad");
            }
          : function () {
              console.log("Creando propiedad");
            }
      }
    >
      {formSchema.map((group, i) => (
        <div className="form-group" key={i}>
          {recursiveRender(group)}
        </div>
      ))}
    </form>
  );
};

export default FormProperty