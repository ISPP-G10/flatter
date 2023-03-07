import FormBuilder from './formBuilder';

import { useApolloClient } from "@apollo/client";
import propertiesAPI from "../../api/propertiesAPI";
import { propertyInputs } from '../../forms/propertiesForm';

const FormProperty = ({ property }) => {

  const client = useApolloClient();

  return (
    <FormBuilder inputs={ propertyInputs } values={ property } onSubmit={ function (values) {

      let username = localStorage.getItem("user") ?? false;

      if(username) {
        values['ownerUsername'] = localStorage.getItem('user')

        client.mutate({
          mutation: propertiesAPI.createProperty,
          variables: values
        });
      }

    } }/>
  );
};

export default FormProperty