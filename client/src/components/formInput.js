import { useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

const FormInput = ({ tag, name, type, defaultValue, values, isRequired, numberOfColumns, validators, formValues, setFormValues}, ref) => {

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
        <>
        {
            type === "select" ?
            (
                <div className={`class-form-group ${inputErrors.length>0 ? "class-error-form" : ""}`} id={`${name}_form`} style={numberOfColumns>1 ? {padding: `2% 1% 0 1%`, width: `${100/numberOfColumns}%`} : {marginTop: `7.5%`}}>	
                    <select className="class-form-input" id={`${name}`} name={`${name}`} required={isRequired} defaultValue={defaultValue} ref={inputField}>
                        {
                            values && values.map((option, index) => {
                                return(
                                    <option key={index}>{option}</option>
                                )
                            })
                        }
                    </select>
                    <label htmlFor={`${name}`} className="class-form-label" style={numberOfColumns>1 ? {paddingLeft: `1%`} : {}}>{tag}:</label>
                    {
                        inputErrors.length > 0 && inputErrors.map((error) => {
                            return(<span className="class-error-message">{error}</span>)
                        })
                    }
                </div>
            )
            :
            (
                <div className={`class-form-group ${inputErrors.length>0 ? "class-error-form" : ""}`} id={`${name}_form`} style={numberOfColumns>1 ? {padding: `0% 1% 0 1%`, width: `${100/numberOfColumns}%`} : {}}>	
                    <input className="class-form-input" type={type} id={`${name}`} name={`${name}`} placeholder=" " defaultValue={`${defaultValue ? defaultValue : ""}`} required={isRequired} ref={inputField}/>
                    <label htmlFor={`${name}`} className="class-form-label">{tag}:</label>
                    {
                        inputErrors.length > 0 && inputErrors.map((error) => {
                            return(<span className="class-error-message">{error}</span>)
                        })
                    }
                </div>
            )
        }
        </>
    );
};

FormInput.propTypes = {
    tag: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.oneOf(["text", "password", "email", "number", "select"]),
    values: PropTypes.array,
    defaultValue: PropTypes.string,
    isRequired: PropTypes.bool,
    numberOfColumns: PropTypes.number,
    validators: PropTypes.array,
    formValues: PropTypes.object,
    setFormValues: PropTypes.func,
}

FormInput.defaultProps = {
    tag: "default",
    name: "default",
    type: "text",
    defaultValue: "",
    numberOfColumns: 1,
    values: [],
    isRequired: false,
    validators: [],
    formValues: {},
    setFormValues: () => {},
}

export default FormInput;