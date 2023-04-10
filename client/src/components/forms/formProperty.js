import FlatterForm from './flatterForm';
import provincesAPI from "../../api/provincesAPI";
import propertiesAPI from "../../api/propertiesAPI";

import { useApolloClient, useQuery } from "@apollo/client";
import { propertyInputs } from '../../forms/propertiesForm';
import { useEffect, useRef, useState } from 'react';

const FormProperty = ({ property }) => {

  const client = useApolloClient();
  const createPropertyFormRef = useRef(null);

  const { data, loading } = useQuery( provincesAPI.getAllProvinces );
  const [ optionMunicipality, setOptionMunicipality ] = useState([]);
  const [configured, setConfigured] = useState(false);
  const [inputsChanged, setInputsChanged] = useState(false);

  function createPropertySubmit({values}){

    if(!createPropertyFormRef.current.validate()) return;

    client.mutate(property===undefined ? {
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
    } : {
      mutation: propertiesAPI.updateProperty,
      variables: {
        id: parseInt(property.id),
        title: values.title,
        description: values.description,
        province: values.province,
        bathroomsNumber: parseInt(values.bathroomsNumber),
        bedroomsNumber: parseInt(values.bedroomsNumber),
        dimensions: parseInt(values.dimensions),
        location: values.location,
        municipality: values.municipality,
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

        if(input.name === 'province') input.defaultValue = property.province.name;

        if(input.name === 'municipality') {
          input.defaultValue = property.municipality.name;
          client.query({
            query: provincesAPI.getMunicipalitiesByProvince,
            variables: {
              province: property.province.name
            }
          })
          .then(response => {

            let municipalityOptions = response.data.getMunicipalitiesByProvince.map(municipality => municipality.name);

            setOptionMunicipality(municipalityOptions);
            input.values = municipalityOptions;
          })
          .catch(error => console.log(error));
        };

        if(input.name === 'images') input.tag = 'Imágenes de la propiedad (al añadir imágenes, se sustituirán las actuales)';  

      });

    }else{
      propertyInputs.map((input) => {
        if(input.name === "province"){
          input.defaultValue = "-";
        }else if(input.name === "municipality"){
          input.defaultValue = "-";
          setOptionMunicipality(["-"]);
        }else{
          input.defaultValue = '';
        } 
      });
    }

    if(!loading){
      propertyInputs.map((input) => {
        if(input.name === 'province') input.values = ['-'].concat(data.getProvinces.map(province => province.name));
      });
    }

  }, [property, loading]);

  useEffect(() => {
    if(optionMunicipality.length > 0){
      propertyInputs.map((input) => {
        if(input.name === 'municipality') {
          input.values = optionMunicipality;
        }
      });
      setInputsChanged(!inputsChanged);
    }
  }, [optionMunicipality]);

  useEffect(() => {
    if(!configured){
      setTimeout(() => {
        let provinceInput = document.querySelector('select#province');
  
        provinceInput.addEventListener('change', () => {
  
          client.query({
            query: provincesAPI.getMunicipalitiesByProvince,
            variables: {
              province: provinceInput.value
            }
          })
          .then(response => {
            if(provinceInput.value !== "-"){
              setOptionMunicipality(response.data.getMunicipalitiesByProvince.map(municipality => municipality.name));
            }else{
              setOptionMunicipality(["-"]);
            }
          })
          .catch(error => console.log(error));
  
        });

        setConfigured(true);
      }, 1000);
    }
  }, [inputsChanged]);

  if(loading) return <p>Loading...</p>

  return (
    <FlatterForm
        buttonText={property ? "Actualizar" : "Publicar"}
        showSuperAnimatedButton
        numberOfColumns={3}
        inputs={propertyInputs}
        onSubmit={createPropertySubmit}
        ref={createPropertyFormRef}
        scrollable
    />
  );
};

export default FormProperty