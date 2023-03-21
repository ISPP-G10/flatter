import "../static/css/pages/listProperties.css";
import "../static/css/pages/propertyRequests.css";

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

import FlatterModal from "../components/flatterModal";

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

  let [sharedProperty, setSharedProperty] = useState({});

  let [properties, setProperties] = useState([]);

  const modalRef = useRef(null);

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
    .then((response) => setProperties(response.data.getFilteredPropertiesByPriceAndCityAndTags))
    .catch((error) => alert("Ha ocurrido un error, por favor, intétalo más tarde o contacta con nuestro equipo de soporte"));

    filterInputs.map((input) => {
      if(input.name === 'price'){
       input.min = isNaN(filterValues.min) ? 0 : filterValues.min;
       input.max = isNaN(filterValues.max) ? 2000 : filterValues.max;
      }
      if(input.name === 'province') input.defaultValue = filterValues.city ?? '';
    })

  }, [filterValues]);

  const copyShareInputClipboard = () => {
    const input = document.querySelector('#share-modal-input');
    input.select();
    document.execCommand('copy');
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
                      <div className="meta-location"><img className="small-picture-back" src={require('../static/files/icons/ubicacion.png')} alt='Ubicacion'/> { property.province }</div>
    
                      <div className="meta-flatmates"><img className="small-picture-back" src={require('../static/files/icons/partners.png')} alt='Compañeros'/> {property.flatmates.length}/{property.maxFlatmates}</div>
                    </div>
                  </div>
    
                  <footer className="property-footer">
                    <SolidButton text="Ver piso" onClick={ () => {
                        navigator(`/property/${property.id}`);
                    } } />
                    <SolidButton text="Ver reseñas" onClick={ () => {
                      navigator(`/profile/${property.owner.username}`);
                    } } />
                    <SolidButton text="Compartir" onClick={ () => {
                      modalRef.current.open();
                      setSharedProperty(property);
                    } }/>
                  </footer>
                </div>
              </article>
              );
              }
            )}
        </div>
      </section>

      <FlatterModal maxWidth={350} ref={modalRef}>
        <div className="info-modal share-property-modal">
          <h3>¿Conoces a alguien a quién le puede interesar?</h3>
          <p>Comparte este alquiler con quien tú quieras. Puedes copiar el siguiente enlace y la persona que lo reciba podrá entrar directamente a ver la información de la propiedad.</p>
          <div className="share-input">
            <input id="share-modal-input" type="text" value={`https://${window.location.host}/property/${sharedProperty.id}`} placeholder="Aquí aparecerá el enlace para compartir del alquiler que selecciones" readOnly={ true } /><button onClick={ function(e) {
            
              copyShareInputClipboard();
              e.target.innerText = '¡Copiado!';

              setTimeout(() => {
                e.target.innerText = 'Copiar';
              }, 3000);

            } }>Copiar</button>
          </div>

          <div>
            <SolidButton className="share-whatsapp" onClick={ () => {
              const text = `¡Hola! Si estás buscando alquiler te recomiendo este sitio: ${sharedProperty.title}. Puedes entrar desde: https://${window.location.host}/property/${sharedProperty.id}`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURI(text)}`, "_blank");
            } } text="Compartir en WhatsApp" />
          </div>
        </div>
      </FlatterModal>
    </FlatterPage>
  );
};

export default ListProperties;