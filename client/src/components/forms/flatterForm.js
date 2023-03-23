import '../../static/css/components/flatterForm.css'
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';


import SuperAnimatedButton from "../superAnimatedButton/superAnimatedButton";

import {useState, useImperativeHandle, forwardRef, useEffect, useRef} from 'react';

import PropTypes from 'prop-types';
import FormInput from './formInput';
import SolidButton from '../../sections/solidButton';

const FlatterForm = forwardRef((props, ref) => {

    const [formValues, setFormValues] = useState({});
    const [submitForm, setSubmitForm] = useState(false);

    let formElement = useRef(null);
    let formInputs = useRef([]);

    useImperativeHandle(ref, () => {
        return{
            validate: () => {
                let isValid = true;
                for(let i=0; i< props.inputs.length; i++){
                    let input = props.inputs[i];
                    for(let validator of input.validators){
                        if(!validator.validate(formValues[input.name])){
                            formInputs.current[i].setErrors([validator.message]);
                            isValid = false;
                        }
                    }
                }

                return isValid;
            },
        }
    });

    function handleSubmit(e){
        e.preventDefault();
        let formValuesCopy = {};

        for(let i=0; i< props.inputs.length; i++){
            let input = props.inputs[i];
            if(input.type === "files"){
                formValuesCopy[input.name] = formInputs.current[i].files.map(file => file.getFileEncodeBase64String());
            }else if(input.type === "flatter-tags"){
                formValuesCopy[input.name] = formInputs.current[i].selectedTags;
            }else if(input.type === "interval"){
                formValuesCopy[`min_${input.name}`] = formInputs.current[i].min;
                formValuesCopy[`max_${input.name}`] = formInputs.current[i].max;
            }else{
                formValuesCopy[input.name] = formInputs.current[i].value;
            }
        }
        setFormValues(formValuesCopy);
        setSubmitForm(true);
    }

    useEffect(() => {

        if(Object.keys(formValues).length === 0){
            let newFormValues = {};
            for(let input of props.inputs){
                if(input.type === "interval"){
                    newFormValues[`min_${input.name}`] = input.min;
                    newFormValues[`max_${input.name}`] = input.max;
                }else if(input.type === "flatter-tags"){
                    newFormValues[input.name] = input.defaultValues ? input.defaultValues : [];
                }
                else{
                    newFormValues[input.name] = input.defaultValue ? input.defaultValue : '';
                }
            };
            setFormValues(newFormValues);
        }

        if(props.scrollable){   
            formElement.current.style.overflow = 'scroll';
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues]);

    useEffect(() => {

        if(submitForm){
            props.onSubmit({values: formValues});
            setSubmitForm(false);
        }

    }, [submitForm]);

    useEffect(() => {

        document.addEventListener('keyup', (e) => {
            if(e.key === 'Enter'){
                handleSubmit(e);
            }
        });

    }, []);

    return (
        <div className="class-profile-form">
            <form className="class-form" ref={formElement} style={props.numberOfColumns > 1 ? {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'} : {}}>
                    {props.children}
                    { 
                        Object.keys(formValues).length > 0 && props.inputs.map((input, index) => {
                            return(
                                <FormInput  key={index} 
                                            tag={input.tag}
                                            name={input.name}
                                            type={input.type}
                                            tagType={input.tagType}
                                            values={input.values}
                                            defaultValue={input.defaultValue}
                                            defaultValues={input.defaultValues}
                                            isRequired={input.isRequired}
                                            minValue={input.min}
                                            maxValue={input.max}
                                            numberOfColumns={props.numberOfColumns}
                                            validators={input.validators}
                                            formValues={formValues}
                                            setFormValues={setFormValues}
                                            ref={(input) => (formInputs.current[index] = input)}
                                            />
                            )
                        })
                    }
            </form>
            {
                props.showSuperAnimatedButton ?
                (
                    <div style={{height: '50px', width: '100%', maxWidth: `${props.buttonText.length*15}px`, marginTop: '40px'}}>
                        <SuperAnimatedButton onClick={handleSubmit}>{props.buttonText}</SuperAnimatedButton>
                    </div>
                )
                :
                (
                    <div style={{marginTop: '40px'}}>
                        <SolidButton text={props.buttonText} type="featured" onClick={handleSubmit}/>
                    </div>
                )
            }
        </div>
    );
});

FlatterForm.propTypes = {
    inputs: PropTypes.array,
    onSubmit: PropTypes.func,
    buttonText: PropTypes.string,
    showSuperAnimatedButton: PropTypes.bool,
    numberOfColumns: PropTypes.number,
}

FlatterForm.defaultProps = {
    inputs: {},
    onSubmit: () => {},
    buttonText: "Enviar",
    showSuperAnimatedButton: false,
    numberOfColumns: 1,
}

export default FlatterForm;