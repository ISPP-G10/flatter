import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import MultiRangeSlider from '../inputs/multiRangeSlider';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';

const FormInput = forwardRef(({ tag, name, type, defaultValue, values, isRequired, 
                    numberOfColumns, validators, minValue, maxValue, formValues, setFormValues}, ref) => {

    const [inputErrors, setInputErrors] = useState([]);
    let [files, setFiles] = useState([]);
    let inputField = useRef(null);

    useImperativeHandle(ref, () => {
        return{
            setErrors: (errors) => {
                setInputErrors(errors);
            },
        }
    });

    function handleFiles(fileItems){
        setFiles(fileItems);
        formValues[name] = fileItems.map(file => file.getFileEncodeBase64String());
        setFormValues(formValues);
    }

    useEffect(() => {
        if(type !== "interval" && type !== "files"){
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
                                    formValues[`min_${name}`] = min;
                                    formValues[`max_${name}`] = max;
                                    setFormValues(formValues);
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
            )
        
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
    type: PropTypes.oneOf(["text", "password", "email", "number", "select", "textarea", "interval", "files"]),
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