import Hero from '../sections/hero';
import SolidButton from '../sections/solidButton';

import PropTypes from "prop-types";

const FormProperty = ({property}) => {

    const isSet = property.id!==undefined;

    const editProperty = () => {

    }

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
            is_outstanding: {
                label: 'Destacar Propiedad',
                default: false,
                type: 'checkbox',
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
                label: 'Título de la propiedad',
                placeholder: 'Introduce un título para tu propiedad',
                type: 'text',
                flex: 1
            }
        },
        {
            description: {
                label: 'Descripción',
                placeholder: 'Descripción de tu propiedad',
                default: 50,
                type: 'textarea',
                flex: 1
            }
        },
        {
            dimensions: {
                label: 'Dimensiones en m2',
                placeholder: '100',
                default: "",
                type: 'number',
                flex: 1
            },
            bedrooms_number: {
                label: 'Número de habitaciones',
                placeholder: '3',
                default: "",
                type: 'number',
                flex: 1
            },
            bathrooms_number: {
                label: 'Número de baños',
                placeholder: '2',
                default: "",
                type: 'number',
                flex: 1
            }
        },
        {
            tags: {
                label: 'Etiquetas',
                placeholder: 'Selecciona hasta 8 etiquetas',
                default: "",
                type: 'textarea',
                flex: 1
            }
        }
    ]

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
              {Object.entries(group).map(([key, value]) => {
                switch (value.type) {
                  case "text":
                  case "number":
                    return (
                      <label key={key} style={{ flex: value.flex }}>
                        {value.label}
                        <input
                          type={value.type}
                          name={key}
                          defaultValue={value.default}
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
                          defaultChecked={value.default}
                        />
                      </label>
                    );
                  case "select":
                    return (
                      <label key={key} style={{ flex: value.flex }}>
                        {value.label}
                        <select name={key} defaultValue={value.default}>
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
                          defaultValue={value.default}
                          placeholder={value.placeholder}
                        />
                      </label>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          ))}
        </form>
    );

}

FormProperty.propTypes = {
    property: PropTypes.object
}

FormProperty.defaultProps = {
    property: {}
}

export default FormProperty;