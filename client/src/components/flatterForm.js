import '../static/css/components/loginRegisterForm.css'

import SuperAnimatedButton from "./superAnimatedButton/superAnimatedButton";

import {useState, useImperativeHandle, forwardRef, useEffect} from 'react';

import PropTypes from 'prop-types';
import FormInput from './formInput';
import SolidButton from '../sections/solidButton';

const FlatterForm = forwardRef(({inputs, onSubmit, buttonText, showSuperAnimatedButton, numberOfColumns}, ref) => {

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

        if(Object.keys(formValues).length === 0){
            let newFormValues = {};

            inputs && inputs.forEach(input => {
                newFormValues[input.name] = input.defaultValue ? input.defaultValue : '';
            });

            setFormValues(newFormValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues]);

    return (
        <div className="class-profile-form">
            <form className="class-form" style={numberOfColumns > 1 ? {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'} : {}}>
                    { 
                        Object.keys(formValues).length > 0 && inputs.map((input, index) => {
                            return(
                                <FormInput  key={index} 
                                            tag={input.tag}
                                            name={input.name}
                                            type={input.type}
                                            values={input.values}
                                            defaultValue={input.defaultValue}
                                            isRequired={input.isRequired}
                                            numberOfColumns={numberOfColumns}
                                            validators={input.validators}
                                            formValues={formValues}
                                            setFormValues={setFormValues}/>
                            )
                        })
                    }
            </form>
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