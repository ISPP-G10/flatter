import { useApolloClient } from "@apollo/client";
import propertiesAPI from "../../api/propertiesAPI";
import { propertyInputs } from '../../forms/propertiesForm';
import FlatterForm from './flatterForm';
import { useEffect, useRef } from 'react';
import provincesApi from "../../api/provincesAPI";
import { useQuery } from "@apollo/client";
import MunicipalityProvinceSelectors from "../inputs/municipalityProvinceSelectors";

const FormProperty = ({ property }) => {

  const client = useApolloClient();
  const createPropertyFormRef = useRef(null);

  function updatePropertySubmit({values}){

    if(!createPropertyFormRef.current.validate()) return

    client.mutate({
      mutation: propertiesAPI.updateProperty,
      variables: {
        id: parseInt(property.id),
        title: values.title,
        description: values.description,
        province: values.province,
        bathroomsNumber: parseInt(values.bathroomsNumber),
        bedroomsNumber: parseInt(values.bedroomsNumber),
        dimensions: parseInt(values.dimensions),
        municipality: values.municipality,
        ownerUsername: localStorage.getItem('user',''),
        price: parseFloat(values.price),
        images: values.images,
        maxCapacity: parseInt(values.maxCapacity),
        location: values.location
      }
    })
    .then(response => window.location.reload())
    .catch(error => console.log(error));
  }

  function createPropertySubmit({values}){

    if(!createPropertyFormRef.current.validate()) return;

    client.mutate({
      mutation: propertiesAPI.createProperty,
      variables: {
        title: values.title,
        description: values.description,
        province: values.province,
        bathroomsNumber: parseInt(values.bathroomsNumber),
        bedroomsNumber: parseInt(values.bedroomsNumber),
        dimensions: parseInt(values.dimensions),
        municipality: values.municipality,
        ownerUsername: localStorage.getItem('user',''),
        price: parseFloat(values.price),
        images: values.images,
        maxCapacity: parseInt(values.maxCapacity),
        location: values.location
      }
    })
    .then(response => window.location.reload())
    .catch(error => console.log(error));
  }

  useEffect(() => {
    if(property){
      propertyInputs.map((input) => {
        input.defaultValue = property[input.name] ? property[input.name].toString() : property[input.name];
        if(input.name === 'province') input.defaultValue = property.province.name;
        if(input.name === 'municipality') input.defaultValue = property.municipality.name;
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
        onSubmit={property ? updatePropertySubmit : createPropertySubmit}
        ref={createPropertyFormRef}
        scrollable
    >
      <MunicipalityProvinceSelectors
        name_province_input={'province'}
        tag_province_input={'Provincia'}
        isRequired_province_input={true}
        defaultValue_province_input={property ? property.province.name : ''}
        defaultValue_municipality_input={property ? property.municipality.name : ''}
        validators_province_input={[]}
        name_municipality_input={'municipality'}
        tag_municipality_input={'Municipio'}
        isRequired_municipality_input={true}
        validators_municipality_input={[]}
        numberOfColumns={3}
      />
    </FlatterForm>
  );
};

export default FormProperty