import FormBuilder from './formBuilder';

import { useApolloClient } from "@apollo/client";
import propertiesAPI from "../../api/propertiesAPI";
import { propertyInputs } from '../../forms/propertiesForm';

const FormProperty = ({ property }) => {

  const client = useApolloClient();

  const isSet = property.id!==undefined;

  return (
    <FormBuilder inputs={ propertyInputs } values={ property } onSubmit={ function (values) {

      let username = localStorage.getItem("user") ?? false;

      if(username) {
        values['ownerUsername'] = localStorage.getItem('user');

        console.log(values);

        client.mutate({
          mutation: isSet ? propertiesAPI.updateProperty : propertiesAPI.createProperty,
          variables: {
            ...(isSet ? {
              id: parseInt(property.id)
            } : {}), 
            ...values
          }
        }).catch(e => {
          
          console.log('Error validación backend: '+ e);
        });
      }

    } }/>
  );
};

export default FormProperty