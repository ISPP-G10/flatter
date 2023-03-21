import "../static/css/pages/listProperties.css";

import FlatterPage from "../sections/flatterPage";
import Slider from "../components/slider/slider";
import SolidButton from "../sections/solidButton";
import Tag from "../components/tag";
import FlatterForm from "../components/forms/flatterForm";
import propertiesAPI from "../api/propertiesAPI";
import useURLQuery from "../hooks/useURLQuery";
import { useState, useEffect, useRef } from "react";
import { filterInputs } from "../forms/filterPropertiesForm";
import {useNavigate} from 'react-router-dom';
import {useApolloClient} from '@apollo/client';

const ListProperties = () => {

  const query = useURLQuery();
  const navigator = useNavigate();
  const client = useApolloClient();
  const filterFormRef = useRef(null);

  let [filterValues, setFilterValues] = useState({
    min: parseInt(query.get("min")),
    max: parseInt(query.get("max")),
    city: query.get("city") ?? '',
  });

  let [properties, setProperties] = useState([]);

  function handleFilterForm({values}) {

    if(!filterFormRef.current.validate()) return;

    setFilterValues({
      min: values.min_price,
      max: values.max_price,
      city: values.province
    })

  }

  useEffect(() => {

    client.query({
      query: propertiesAPI.filterProperties,
      variables: {
        minPrice: filterValues.min,
        maxPrice: filterValues.max,
        city: filterValues.city
      }
    })
    .then((response) => setProperties(response.data.getFilteredPropertiesByPriceAndCity))
    .catch((error) => alert("Ha ocurrido un error, por favor, intétalo más tarde o contacta con nuestro equipo de soporte"));

    filterInputs.map((input) => {
      if(input.name === 'price'){
       input.min = isNaN(filterValues.min) ? 0 : filterValues.min;
       input.max = isNaN(filterValues.max) ? 2000 : filterValues.max;
      }
      if(input.name === 'province') input.defaultValue = filterValues.city ?? '';
    })

  }, [filterValues]);



  return (
    <FlatterPage withBackground userLogged>
      <div>
        <h1 className="properties-title">Buscar habitaciones en alquiler</h1>
      </div>
  
      <section className="site-content-sidebar properties">
        <div className="sidebar">
          <div className="card">
            <div className="filters">
              <h3>Filtrar por:</h3>

              <FlatterForm ref={filterFormRef} inputs={filterInputs} onSubmit={handleFilterForm} buttonText="Filtrar Propiedades"/>
            </div>
          </div>
          <div style={{marginTop: '20px'}}>
            <SolidButton type="featured" text="Limpiar filtros" onClick={() => {
              navigator('/search')
              setFilterValues({
                min: 0,
                max: 2000,
                city: '',
              })
            }}/>
          </div>
        </div>
  
        <div className="content">
          {
            properties.map((property, index) => {
              return(
              <article key={ index } className="property-card card">
                <div className="property-gallery">
                  <Slider images={property.images.map((image) => image.image)}/>
                </div>
                <div className="property-body">
                  <div className="property-body-content">
                    <div className="property-header">
                      <h3>{property.title}</h3>
                      <p>{property.description}</p>
                    </div>
                    <div className="property-price">
                        <span>{ property.price }</span> <span>€/mes</span>
                    </div>
                  </div>
    
                  <div className="property-meta">
                    <div className="meta-right">
                      {property.tags && property.tags.map((tag, index) => (
                        <Tag key={ index } name={tag.name} color={tag.color}></Tag>
                      ))}
                    </div>
    
                    <div className="meta-left">
                      <div className="meta-location"><img className="small-picture-back" src={require('../static/files/icons/ubicacion.png')} alt='Ubicacion'/> { property.province.name }</div>
    
                      <div className="meta-flatmates"><img className="small-picture-back" src={require('../static/files/icons/partners.png')} alt='Compañeros'/> {property.flatmates.length}/{property.maxFlatmates}</div>
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
              );
              }
            )}
        </div>
      </section>
    </FlatterPage>
  );
};

export default ListProperties;