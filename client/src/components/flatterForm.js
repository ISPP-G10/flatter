import '../static/css/components/loginRegisterForm.css'

import SuperAnimatedButton from "./superAnimatedButton/superAnimatedButton";

import {useState, useImperativeHandle, forwardRef, useEffect} from 'react';

import PropTypes from 'prop-types';
import FormInput from './formInput';
import SolidButton from '../sections/solidButton';

const FlatterForm = forwardRef(({title, inputs, onSubmit, buttonText, showSuperAnimatedButton}, ref) => {

    const [formValues, setFormValues] = useState({});

    useImperativeHandle(ref, () => {
        return{
            validate: () => {
                for(let input of inputs){
                    for(let validator of input.validators){
                        if(!validator.validate(formValues[input.name])){
                            return false;
                        }
                    }
                }

                return true;
            }
        }
    });

    function handleSubmit(e){
        e.preventDefault();
        onSubmit({values: formValues});
    }

    useEffect(() => {
        let newFormValues = {};

        inputs && inputs.forEach(input => {
            newFormValues[input.name] = input.defaultValue ? input.defaultValue : '';
        });

        setFormValues(newFormValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="class-profile-form">
            <form className="class-form">
                    <p>{title}</p>
                
                    { 
                        inputs && inputs.map((input, index) => {
                            return(
                                <FormInput key={index} tag={input.tag} name={input.name} type={input.type} defaultValue={input.defaultValue} isRequired={input.isRequired} validators={input.validators} formValues={formValues} setFormValues={setFormValues}/>
                            )
                        })
                    }

                    {
                        showSuperAnimatedButton ?
                        (
                            <div style={{height: '50px', width: `${buttonText.length*15}px`, marginTop: '40px'}}>
                                <SuperAnimatedButton onClick={handleSubmit}>{buttonText}</SuperAnimatedButton>
                            </div>
                        )
                        :
                        (
                            <div style={{marginTop: '40px'}}>
                                <SolidButton text={buttonText} type="featured" onClick={onSubmit}/>
                            </div>
                        )
                    }
            </form>
        </div>
    );
});

FlatterForm.propTypes = {
    title: PropTypes.string,
    inputs: PropTypes.array,
    onSubmit: PropTypes.func,
    buttonText: PropTypes.string,
    showSuperAnimatedButton: PropTypes.bool,
}

FlatterForm.defaultProps = {
    title: "",
    inputs: {},
    onSubmit: () => {},
    buttonText: "Enviar",
    showSuperAnimatedButton: false,
}

export default FlatterForm;