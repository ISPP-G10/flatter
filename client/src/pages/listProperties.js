import "../static/css/pages/listProperties.css";

import FlatterPage from "../sections/flatterPage";
import Slider from "../components/slider/slider";
import SolidButton from "../sections/solidButton";
import Tag from "../components/tag";
import FlatterForm from "../components/forms/flatterForm";
import propertiesAPI from "../api/propertiesAPI";

import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { filterInputs } from "../forms/filterPropertiesForm";
import {useQuery} from '@apollo/client';
import {useNavigate} from 'react-router-dom';

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

const ListProperties = () => {

  const registerFormRef = useRef(null);

  const navigator = useNavigate();

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
        <h1 className="properties-title">Buscar habitaciones en alquiler</h1>
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
                  <div className="property-header">
                    <h3>{property.title}</h3>

                    <div className="property-price">
                    <img src={require('../static/files/icons/flattercoins-icon.png')} alt="Logo Flatter Coins" style={{height: 32, width: 32, margin: 0}}></img> { property.price }
                    </div>
                  </div>
                  
                  <p>{property.description}</p>
                </div>
  
                <div className="property-meta">
                  <div className="meta-right">
                    {property.tags && property.tags.map((tag, index) => (
                      <Tag key={ index } name={tag.title} color={tag.color}></Tag>
                    ))}
                  </div>
  
                  <div className="meta-left">
                    <div className="meta-location"><img className="small-picture-back" src={require('../static/files/icons/ubicacion.png')} alt='Ubicacion'/> { property.province }</div>
  
                    <div className="meta-flatmates"><img className="small-picture-back" src={require('../static/files/icons/partners.png')} alt='Compañeros'/> 2/4</div>
                  </div>
                </div>
  
                <footer className="property-footer">
                  <SolidButton text="Ver piso" onClick={ () => {
                      navigator(`/property/${property.id}`)
                  } } />
                  <SolidButton text="Ver reseñas" />
                  <SolidButton text="Compartir" />
                </footer>
              </div>
            </article>
          ))}
        </div>
      </section>
    </FlatterPage>
  );
};

export default ListProperties;