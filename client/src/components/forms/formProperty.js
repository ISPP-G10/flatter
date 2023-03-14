import { useApolloClient } from "@apollo/client";
import propertiesAPI from "../../api/propertiesAPI";
import { propertyInputs } from '../../forms/propertiesForm';
import FlatterForm from './flatterForm';
import { useEffect, useRef } from 'react';

const FormProperty = ({ property }) => {

  const client = useApolloClient();
  const createPropertyFormRef = useRef(null);

  function handlePropertySubmit({values}){

    if(!createPropertyFormRef.current.validate()) return

    client.mutate({
      mutation: propertiesAPI.createProperty,
      variables: {
        title: values.title,
        description: values.description,
        province: values.province,
        bathroomsNumber: parseInt(values.bathroomsNumber),
        bedroomsNumber: parseInt(values.bedroomsNumber),
        dimensions: parseInt(values.dimensions),
        location: values.location,
        ownerUsername: localStorage.getItem('user',''),
        price: parseFloat(values.price),
        images: values.images,
        maxCapacity: parseInt(values.maxCapacity)
      }
    })
    .then(response => window.location.reload())
    .catch(error => console.log(error));
  }

  useEffect(() => {
    if(property){
      propertyInputs.map((input) => {
        input.defaultValue = property[input.name] ? property[input.name].toString() : property[input.name];
        if(input.name === 'images') input.tag = 'Imágenes de la propiedad (al añadir imágenes, se sustituirán las actuales)';
    });
    }
  }, [property]);

  return (
    <FlatterForm
        buttonText={property ? "Actualizar" : "Publicar"}
        showSuperAnimatedButton
        numberOfColumns={3}
        inputs={propertyInputs}
        onSubmit={handlePropertySubmit}
        ref={createPropertyFormRef}
        scrollable
    />
  );
};

export default FormProperty