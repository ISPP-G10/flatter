import { useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

const FormInput = ({ tag, name, type, defaultValue, isRequired, validators, formValues, setFormValues}, ref) => {

    const [inputErrors, setInputErrors] = useState([]);
    let inputField = useRef(null);

    useEffect(() => {
        inputField.current.addEventListener("change", () => {
            let errors = [];
            formValues[name] = inputField.current.value;
            setFormValues(formValues);
            validators.forEach((validator) => {
                if(!validator.validate(inputField.current.value)){
                    errors.push(validator.message);
                }
            });
            setInputErrors(errors);
        });
        // eslint-disable-next-line
    }, []);

    return(
        <div className={`class-form-group ${inputErrors.length>0 ? "class-error-form" : ""}`} id={`${name}_form`}>	
            <input className="class-form-input" type={type} id={`${name}`} name={`${name}`} placeholder=" " defaultValue={`${defaultValue ? defaultValue : ""}`} required={isRequired} ref={inputField}/>
            <label htmlFor={`${name}`} className="class-form-label">{tag}:</label>
            {
                inputErrors.length > 0 && inputErrors.map((error) => {
                    return(<span className="class-error-message">{error}</span>)
                })
            }
        </div>
    );
};

FormInput.propTypes = {
    tag: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.oneOf(["text", "password", "email", "number"]),
    defaultValue: PropTypes.string,
    isRequired: PropTypes.bool,
    validators: PropTypes.array,
    formValues: PropTypes.object,
    setFormValues: PropTypes.func,
}

FormInput.defaultProps = {
    tag: "default",
    name: "default",
    type: "text",
    defaultValue: "",
    isRequired: false,
    validators: [],
    formValues: {},
    setFormValues: () => {},
}

export default FormInput;