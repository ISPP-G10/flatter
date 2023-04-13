import FlatterForm from './flatterForm';
import provincesAPI from "../../api/provincesAPI";
import propertiesAPI from "../../api/propertiesAPI";
import TagSelector from '../inputs/tagSelector';
import tagsAPI from '../../api/tagsAPI';

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

  const {data: propertyTagsData, loading: propertyTagsLoading} = useQuery(tagsAPI.getTagsByType, {
    variables: {
        type: "P"
    }
  });
  const tagsInput = useRef(null);
  
  function createPropertySubmit({values}){

    let tagsValues = tagsInput.current.props.value.map(tag => tag.value);

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
        location: values.location,
        tags: tagsValues
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
        maxCapacity: parseInt(values.maxCapacity),
        tags: tagsValues
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
            municipalityOptions = municipalityOptions.filter(municipality => municipality !== property.municipality.name);
            setOptionMunicipality([property.municipality.name].concat(municipalityOptions));
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
        childrenPosition={6}
    >
      <div className='tag-input'>
          {
              !propertyTagsLoading && 
                  <TagSelector 
                      options={propertyTagsData.getTagsByType.map(tag => {
                                  return {
                                          value: tag.id,
                                          name: tag.name, 
                                          color: tag.color
                                      }
                              })}
                      defaultValues={property?property.tags.map(tag => {
                                  return {
                                          value: tag.id,
                                          name: tag.name,
                                          color: tag.color
                                      }
                              }):[]}
                      max={8} 
                      ref={tagsInput}/>
          }
      </div>
    </FlatterForm>
  );
};

export default FormProperty