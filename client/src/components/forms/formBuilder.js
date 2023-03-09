import '../../static/css/components/formBuilder.css'

import SolidButton from '../../sections/solidButton';
import ImageUploader from '../../sections/imageUploader';

import PropTypes from "prop-types";
import FormInput from './formInput';

const FormBuilder = ({ inputs, values, onSubmit }) => {

    const schema = {};

    const recursiveRender = (group) => {
        return Object.entries(group).map(([key, value]) => {
          const propValue = values[key];

          if(value.type !== 'group') {
            schema[key] = {
              type: value.type
            }
          }

          switch (value.type) {
            case "text":
            case "number":
              return (
                <FormInput key={key} tag={ value.label } defaultValue={propValue || value.default} type={ value.type } name={ key } validators={ value.validators } />
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
                      <option key={id} value={id}>
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
                  <ImageUploader name={ key } />
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
                  <SolidButton type={ value.type } text={ value.text } onClick={ value.onClick } />
                </div>
              );
    
            default:
              return null;
          }
        });
    };

    return (
        <form className="form" style={{overflowY: 'auto', width: '100%'}} onSubmit = { function (e) {
          e.preventDefault();

          const formInputs = Array.prototype.slice.call(e.target.querySelectorAll('*[name]')),
          values = {};

          for(let index in Object.keys(schema)) {
            
            // para almacenar los tipos de los inputs y darle los valores en tipo String o Int
            const key = Object.keys(schema)[index],
              inputSchema = schema[key],
              inputForm = formInputs.map(x=>x).filter(input => {
                return input.getAttribute('name') === key;
              }),
              inputValue = inputForm[0]!==undefined ? inputForm[0].value : '';

            console.log(inputForm);

            let parsedValue = null;
            switch(inputSchema.type) {
              case 'number':
                parsedValue = parseInt(inputValue);
                break;

              default:
                parsedValue = inputValue;
                break;
            }

            values[key] = parsedValue;
          }

          onSubmit(values);

        } } >
            {inputs.map((group, i) => (
                <div className="form-group" key={i}>
                {recursiveRender(group)}
                </div>
            ))}
        </form>
    )

}

export default FormBuilder