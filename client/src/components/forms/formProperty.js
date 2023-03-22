import { useApolloClient } from "@apollo/client";
import propertiesAPI from "../../api/propertiesAPI";
import { propertyInputs } from '../../forms/propertiesForm';
import FlatterForm from './flatterForm';
import { useEffect, useRef } from 'react';
import provincesApi from "../../api/provincesAPI";
import { useQuery } from "@apollo/client";
import { useState } from "react";

const FormProperty = ({ property }) => {

  const client = useApolloClient();
  const createPropertyFormRef = useRef(null);

  const provinceInput = useRef(null);
  const municipalityInput = useRef(null);
  const [provinceSelected, setProvinceSelected] = useState(property ? property.province.name : ' - ');
  const [municipalitySelected, setMunicipalitySelected] = useState(property ? property.municipality.name : ' - ');
  const { data, loading } = useQuery(provincesApi.getAllProvincesAndMunicipes);
  const [ optionMunicipality, setOptionMunicipality ] = useState();

  function handleChangeProvince() {
    setProvinceSelected(provinceInput.current.value);
  }

  function handleChangeMunicipality() {
      setMunicipalitySelected(municipalityInput.current.value);
  }

  useEffect(() => { 
      if(provinceSelected != '' && provinceSelected != ' - ' && !loading) {
          const selectedProvinceData = data.getProvincesMunicipalities.find(province => province.name === provinceSelected);
          setOptionMunicipality(selectedProvinceData.municipalitySet.map(municipality => municipality.name));
      }
  }, [data, provinceSelected]);

  function updatePropertySubmit({values}){

    if(!createPropertyFormRef.current.validate()) return
    if(provinceSelected === ' - ' || municipalitySelected === ' - ') return alert('Debes seleccionar una provincia y un municipio');

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
    if(provinceSelected === ' - ' || municipalitySelected === ' - ') return alert('Debes seleccionar una provincia y un municipio');

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

  if(loading) return <p>Loading...</p>
  const options = data.getProvincesMunicipalities.map(province => province.name);

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
      <div className={`class-form-group`} id='province_form' style={3>1 ? {paddingTop: `2%`, width: `${100/3-3}%`} : {marginTop: `7.5%`}}>	
        <select className="class-form-input" id='province' name='province' required={true} defaultValue={property ? property.province.name : ' - ' } onChange={handleChangeProvince} ref={provinceInput}>
            <option value=" - " > - </option>
            {
                options && options.map((option, index) => {
                    return(
                        <option key={index}>{option}</option>
                    )
                })
            }
        </select>
        <label htmlFor='province' className="class-form-label" style={3>1 ? {paddingLeft: `1%`} : {}}>Provincia:</label>
        {
            provinceSelected == ' - ' ? <span className="class-error-message-province-municipality">Selecciona una provincia</span> : null
        }
    </div>
    <div className={`class-form-group`} id='municipality_form' style={3>1 ? {paddingTop: `2%`, width: `${100/3-3}%`} : {marginTop: `7.5%`}}>	
        <select className="class-form-input" id='municipality' name='municipality' required={true} value={municipalitySelected} onChange={handleChangeMunicipality} ref={municipalityInput}>
            <option value=" - " > - </option>
            {
                optionMunicipality && optionMunicipality.map((option, index) => {
                    return(
                        <option key={index}>{option}</option>
                    )
                })
            }
        </select>
        <label htmlFor='municipality' className="class-form-label" style={3>1 ? {paddingLeft: `1%`} : {}}>Municipio:</label>
        {
            municipalitySelected == ' - ' ? <span className="class-error-message-province-municipality">Selecciona un municipio</span> : null
        }
    </div>
    </FlatterForm>
  );
};

export default FormProperty