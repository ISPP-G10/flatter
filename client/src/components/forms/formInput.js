import PropTypes from 'prop-types';
import MultiRangeSlider from '../inputs/multiRangeSlider';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';

const FormInput = forwardRef(({ tag, name, type, defaultValue, values, isRequired, 
                    numberOfColumns, validators, minValue, maxValue}, ref) => {
                        
    const [inputErrors, setInputErrors] = useState([]);
    let [files, setFiles] = useState([]);
    let [minInputValue, setMinInputValue] = useState(minValue);
    let [maxInputValue, setMaxInputValue] = useState(maxValue);
    let inputField = useRef(null);

    useImperativeHandle(ref, () => {

        return{
            setErrors: (errors) => {
                setInputErrors(errors);
            },
            value: inputField.current ? inputField.current.value : "",
            min: minInputValue,
            max: maxInputValue,
            files: files,
        }
    });

    function handleFiles(fileItems){
        setFiles(fileItems);
    }

    useEffect(() => {
        if(type !== "interval" && type !== "files"){
            inputField.current.addEventListener("change", () => {
                let errors = [];
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

    switch(type){

        case "select":
            return(
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
            );
        
        case "textarea":

            return(
                <div className={`class-form-group ${inputErrors.length>0 ? "class-error-form" : ""}`} id={`${name}_form`} style={{width: `100%`}}>	
                    <textarea className="class-form-input" type={type} id={`${name}`} name={`${name}`} placeholder=" " defaultValue={`${defaultValue ? defaultValue : ""}`} required={isRequired} ref={inputField}/>
                    <label htmlFor={`${name}`} className="class-form-label">{tag}:</label>
                    {
                        inputErrors.length > 0 && inputErrors.map((error, index) => {
                            return(<span key={index} className="class-error-message">{error}</span>)
                        })
                    }
                </div>
            );

        case "interval":

            return(
                <div className={`class-form-group interval-group d-flex justify-content-evenly ${inputErrors.length>0 ? "class-error-form" : ""}`} id={`${name}_form`} style={numberOfColumns>1 ? {width: `${100/numberOfColumns-3}%`} : {}}>	
                    <label htmlFor={`${name}`} className="class-form-label">{tag}:</label>
                    <MultiRangeSlider
                                min={minValue}
                                max={maxValue}
                                onChange={({min, max})=>{
                                    setMinInputValue(min);
                                    setMaxInputValue(max);
                                }}
                            />
                </div>
            );

        case "files":

            registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode);

            return(
                <div className={`class-form-group files-group`} id={`${name}_form`} style={{paddingTop: `2%`, width: `100%`}}>	
                    <label htmlFor={`${name}`} className="class-form-label">{tag}:</label>
                    <FilePond 
                        files={files}
                        onupdatefiles={handleFiles}
                        allowMultiple={true}
                        allowReorder={true}
                        maxFiles={10}
                        name={name} /* sets the file input name, it's filepond by default */
                        labelIdle='Arrastra tus archivos o <span class="filepond--label-action">Selecciona</span>'
                        credits={false}
                    />
                </div>
            );
        
        case "date":
            
            return(
                <div className={`class-form-group ${inputErrors.length>0 ? "class-error-form" : ""}`} id={`${name}_form`} style={numberOfColumns>1 ? {paddingTop: `2%`, width: `${100/numberOfColumns-3}%`} : {marginTop: `7.5%`}}>	
                    <input className="class-form-input" type="date" id={`${name}`} name={`${name}`} required={isRequired} defaultValue={defaultValue} ref={inputField} />
                    <label htmlFor={`${name}`} className="class-form-label" style={numberOfColumns>1 ? {paddingLeft: `1%`} : {}}>{tag}:</label>
                    {
                        inputErrors.length > 0 && inputErrors.map((error, index) => {
                            return(<span key={index} className="class-error-message">{error}</span>)
                        })
                    }
                </div>
            );

        default:
            return(
                <div className={`class-form-group ${inputErrors.length>0 ? "class-error-form" : ""}`} id={`${name}_form`} style={numberOfColumns>1 ? {width: `${100/numberOfColumns-3}%`} : {}}>	
                    <input className="class-form-input" type={type} id={`${name}`} name={`${name}`} placeholder=" " defaultValue={`${defaultValue ? defaultValue : ""}`} required={isRequired} ref={inputField}/>
                    <label htmlFor={`${name}`} className="class-form-label">{tag}:</label>
                    {
                        inputErrors.length > 0 && inputErrors.map((error, index) => {
                            return(<span key={index} className="class-error-message">{error}</span>)
                        })
                    }
                </div>
            );
    }
});

FormInput.propTypes = {
    tag: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.oneOf(["text", "password", "email", "number", "select", "textarea", "interval", "files", "date", "flatter-tags"]),
    values: PropTypes.array,
    defaultValue: PropTypes.string,
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