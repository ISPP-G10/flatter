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

    let formElement = useRef(null);

    useImperativeHandle(ref, () => {
        return{
            validate: () => {
                for(let input of props.inputs){
                    for(let validator of input.validators){
                        if(!validator.validate(formValues[input.name])){
                            return false;
                        }
                    }
                }

                return true;
            },
        }
    });

    function handleSubmit(e){
        e.preventDefault();
        let inputs = document.getElementsByClassName("class-form-input");
        for(let input of inputs){
            formValues[input.name] = input.value;
        }
        props.onSubmit({values: formValues});
    }

    useEffect(() => {

        if(Object.keys(formValues).length === 0){
            let newFormValues = {};

            props.inputs && props.inputs.forEach(input => {
                if(input.type === "interval"){
                    newFormValues[`min_${input.name}`] = input.min;
                    newFormValues[`max_${input.name}`] = input.max;
                }else{
                    newFormValues[input.name] = input.defaultValue ? input.defaultValue : '';
                }
            });

            setFormValues(newFormValues);
        }

        if(props.scrollable){
            
            formElement.current.style.overflow = 'scroll';
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues]);

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
                                            values={input.values}
                                            defaultValue={input.defaultValue}
                                            isRequired={input.isRequired}
                                            minValue={input.min}
                                            maxValue={input.max}
                                            numberOfColumns={props.numberOfColumns}
                                            validators={input.validators}
                                            formValues={formValues}
                                            setFormValues={setFormValues}/>
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