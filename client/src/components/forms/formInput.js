import { useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import MultiRangeSlider from '../inputs/multiRangeSlider';

const FormInput = ({ tag, name, type, defaultValue, values, isRequired, 
                    numberOfColumns, validators, minValue, maxValue, formValues, setFormValues}, ref) => {

    const [inputErrors, setInputErrors] = useState([]);
    let inputField = useRef(null);

    useEffect(() => {
        if(type !== "interval"){
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
        }
        // eslint-disable-next-line
    }, []);

    return(
        <>
        {
            type === "select" ?
            (
                <div className={`class-form-group ${inputErrors.length>0 ? "class-error-form" : ""}`} id={`${name}_form`} style={numberOfColumns>1 ? {paddingTop: `2%`, width: `${100/numberOfColumns-3}%`} : {marginTop: `7.5%`}}>	
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
                        inputErrors.length > 0 && inputErrors.map((error, index) => {
                            return(<span key={index} className="class-error-message">{error}</span>)
                        })
                    }
                </div>
            )
            :
            type === "textarea" ?
            (
                <div className={`class-form-group ${inputErrors.length>0 ? "class-error-form" : ""}`} id={`${name}_form`} style={numberOfColumns>1 ? {width: `${100/numberOfColumns-3}%`} : {}}>	
                    <textarea className="class-form-input" type={type} id={`${name}`} name={`${name}`} placeholder=" " defaultValue={`${defaultValue ? defaultValue : ""}`} required={isRequired} ref={inputField}/>
                    <label htmlFor={`${name}`} className="class-form-label">{tag}:</label>
                    {
                        inputErrors.length > 0 && inputErrors.map((error) => {
                            return(<span className="class-error-message">{error}</span>)
                        })
                    }
                </div>
            )
            :
            type === "interval" ?
            (
                <div className={`class-form-group interval-group d-flex justify-content-evenly ${inputErrors.length>0 ? "class-error-form" : ""}`} id={`${name}_form`} style={numberOfColumns>1 ? {width: `${100/numberOfColumns-3}%`} : {}}>	
                    <label htmlFor={`${name}`} className="class-form-label">{tag}:</label>
                    <MultiRangeSlider
                                min={minValue}
                                max={maxValue}
                                onChange={({min, max})=>{
                                    formValues[`min_${name}`] = min;
                                    formValues[`max_${name}`] = max;
                                    setFormValues(formValues);
                                }}
                            />
                </div>
            )
            :
            (
                <div className={`class-form-group ${inputErrors.length>0 ? "class-error-form" : ""}`} id={`${name}_form`} style={numberOfColumns>1 ? {width: `${100/numberOfColumns-3}%`} : {}}>	
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
    type: PropTypes.oneOf(["text", "password", "email", "number", "select", "textarea", "interval"]),
    values: PropTypes.array,
    defaultValue: PropTypes.string,
    values: PropTypes.array,
    isRequired: PropTypes.bool,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
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
    minValue: 0,
    maxValue: 100,
    validators: [],
    formValues: {},
    setFormValues: () => {},
}

export default FormInput;