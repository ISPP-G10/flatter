import '../../static/css/components/formBuilder.css'

import SolidButton from '../../sections/solidButton';
import ImageUploader from '../../sections/imageUploader';

import PropTypes from "prop-types";

const FormBuilder = ({ inputs, values }) => {

    const isSet = Object.keys(values)>0;

    const recursiveRender = (group) => {
        return Object.entries(group).map(([key, value]) => {
          const propValue = values[key];
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
              return (
                <div
                  className="form-group-parent"
                  key={key}
                  style={{ flex: value.flex }}
                >
                  {recursiveRender(value.children)}
                </div>
              );
    
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
        <form style={{overflow: 'scroll', width: '100%'}}
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
            {inputs.map((group, i) => (
                <div className="form-group" key={i}>
                {recursiveRender(group)}
                </div>
            ))}
        </form>
    )

}

export default FormBuilder