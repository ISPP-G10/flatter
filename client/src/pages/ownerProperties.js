import "../static/css/pages/ownerProperties.css";

import FlatterPage from "../sections/flatterPage";
import Slider from "../components/slider/slider";
import SolidButton from "../sections/solidButton";
import Tag from "../components/tag";
import FlatterForm from "../components/forms/flatterForm";
import FlatterModal from "../components/flatterModal";
import FormProperty from "../components/forms/formProperty";
import propertiesAPI from "../api/propertiesAPI";

import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { filterInputs } from "../forms/filterPropertiesForm";
import {useQuery} from '@apollo/client';

const FilteredProperties = ({min, max, city}) => {

  const {data, loading} = useQuery(propertiesAPI.filterProperties, {
    variables: {
      minPrice: min,
      maxPrice: max,
      city: city
    }
  });
    
  return {
    loading,
    properties: data?.getFilteredPropertiesByPriceAndCity ?? []
  };
};

const OwnerProperties = () => {

  const addPropertyModalRef = useRef(null);
  const editPropertyModalRef = useRef(null);
  const registerFormRef = useRef(null);

  const [filterValues, setFilterValues] = useState({
    min: 0,
    max: 2000,
    city: ''
  });

  const properties = FilteredProperties(filterValues).properties;

  const { page } = useParams();

  function handleFilterForm({values}) {

    console.log(values);

    setFilterValues({
      min: 100,
      max: 300,
      city: 'Sevilla'
    })
  }

return (
    <FlatterPage withBackground userLogged>
      <div>
        <h1 className="properties-title">Todas tus propiedades</h1>
      </div>
  
      <div className="over-listing">
        <div className="actions">
          <SolidButton text="Nueva Propiedad" type="" onClick={ () => { 
              addPropertyModalRef.current.open();
          } } />

          <SolidButton text="Editar Propiedad" type="" onClick={ () => { 
              editPropertyModalRef.current.open();
          } } />
        </div>
      </div>
      <section className="site-content-sidebar properties">
        <div className="sidebar">
          <div className="card">
            <div className="filters">
              <h3>Filtrar por</h3>

              <FlatterForm ref={registerFormRef} inputs={filterInputs} onSubmit={handleFilterForm} buttonText="Filtrar Propiedades" />
            </div>
          </div>
        </div>
  
        <div className="content">
          {properties.map((property, index) => (
            <article key={ index } className="property-card card">
              <div className="property-gallery">
                <Slider>
                </Slider>
              </div>
              <div className="property-body">
                <div className="property-body-content">
                  <h3>{property.title}</h3>
                  <p>{property.description}</p>
                </div>
  
                <div className="property-meta">
                  <div className="meta-right">
                    {property.tags && property.tags.map((tag, index) => (
                      <Tag key={ index } name={tag.title} color={tag.color}></Tag>
                    ))}
                  </div>
  
                  <div className="meta-left">
                    <div className="meta-location">{ property.province }</div>
  
                    <div className="meta-flatmates">2/4</div>
                  </div>
                </div>
  
                <footer className="property-footer">
                  <SolidButton text="Ver piso" />
                  <SolidButton text="Ver reseñas" />
                  <SolidButton text="Compartir" />
                </footer>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FlatterModal maxWidth={700} ref={addPropertyModalRef}>
        <FormProperty property={{}} />
      </FlatterModal>

      <FlatterModal maxWidth={700} ref={editPropertyModalRef}>
        <FormProperty property={properties[0] ?? {}} />
      </FlatterModal>
    </FlatterPage>
  );
};

export default OwnerProperties;