import "../static/css/pages/listProperties.css";
import "../static/css/components/pagination.css";
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
import {useLocation, useNavigate} from 'react-router-dom';
import {useApolloClient, useQuery} from '@apollo/client';
import customAlert from "../libs/functions/customAlert";
import FlatterModal from "../components/flatterModal";
import provincesAPI from "../api/provincesAPI";
import tagsAPI from "../api/tagsAPI";

const ListProperties = () => {

  const PAGE_SIZE = 10;

  let userToken = localStorage.getItem("token", '');
  const query = useURLQuery();
  const navigator = useNavigate();
  const client = useApolloClient();
  const filterFormRef = useRef(null);
  const {data: provincesData, loading: provincesLoading} = useQuery(provincesAPI.getAllProvinces);
  const [ optionMunicipality, setOptionMunicipality ] = useState([]);
  const [configured, setConfigured] = useState(false);
  const [inputsChanged, setInputsChanged] = useState(false);
  const [favouritesProperties, setFavouriteProperties] = useState([]);
  const {data: propertyTagsData, loading: propertyTagsLoading} = useQuery(tagsAPI.getTagsByType, {
    variables: {
        type: "P",
        userToken: userToken
    }
  }); 


  let [filterValues, setFilterValues] = useState({
    min: parseInt(query.get("min")),
    max: parseInt(query.get("max")),
    municipality: query.get("municipality") ?? '',
    province: query.get("province") ?? '',
    tag: query.get("tag") ?? '',
  });

  let [paginationIndex, setPaginationIndex] = useState(query.get("page") && parseInt(query.get("page")) > 0 ? parseInt(query.get("page")) : 1);

  const [formKey, setFormKey] = useState(0);
  const [sharedProperty, setSharedProperty] = useState({});
  const [currentPageData, setCurrentPageData] = useState([]);
  const [numberOfFilteredProperties, setNumberOfFilteredProperties] = useState(0);

  const modalRef = useRef(null);
  const location = useLocation();


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const min = parseInt(searchParams.get("min")) || 0;
    const max = parseInt(searchParams.get("max")) || 2000;
    const tag = searchParams.get("tag") || "";
    const province = searchParams.get("province") || "";
    const municipality = searchParams.get("municipality") || "";

    setFilterValues({ min, max, tag, province, municipality });
  }, [location]);

  function handleFilterForm({values}) {

    if(!filterFormRef.current.validate()) return;

    setFilterValues({
      min: values.min_price,
      max: values.max_price,
      municipality: values.municipality==='-' ? '' : values.municipality,
      province: values.province === '-' ? '' : values.province,
      tag: values.tag === '-'? null : values.tag,
    });
  }

  const { loading, data } = useQuery(
    propertiesAPI.getFavouritePropertiesByUser,
    {
      variables: {
        username: localStorage.getItem("user"),
        userToken: userToken,
      },
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    filterInputs.map((input) => {
      if(input.name === 'price'){
        input.min = isNaN(filterValues.min) ? 0 : filterValues.min;
        input.max = isNaN(filterValues.max) ? 2000 : filterValues.max;
      }
      if(input.name === 'municipality') input.defaultValue = filterValues.municipality ?? '';
    })

  }, [filterValues, loading]);

  useEffect(() => { 
    if (!propertyTagsLoading) { 
        filterInputs.map((input) => { 
            if(input.name === 'tag') { 
              const tagNames = propertyTagsData.getTagsByType.map(tag => tag.name);
              input.values = ['-'].concat(tagNames);            
            } 
        }) 
      }
    }, [propertyTagsLoading, propertyTagsData]);

  useEffect(() => {

    client.query({
      query: propertiesAPI.filterProperties,
      variables: {
        minPrice: filterValues.min,
        maxPrice: filterValues.max,
        municipality: filterValues.municipality,
        province: filterValues.province,
        tag: filterValues.tag,
        pageNumber: paginationIndex,
        pageSize: PAGE_SIZE,
        userToken: userToken,
      }
    }).then(response => {
      setCurrentPageData(response.data.getFilteredPropertiesByPriceAndCity.properties);
      setNumberOfFilteredProperties(response.data.getFilteredPropertiesByPriceAndCity.totalCount);
    }).catch(error => customAlert("¡Ups! Parece que no hay resultados que cumplan estos requisitos", 'info'));

  }, [filterValues, paginationIndex]);

  const copyShareInputClipboard = () => {
    const input = document.querySelector('#share-modal-input');
    window.navigator.clipboard.writeText(input.value)
      .then(customAlert("¡Ya puedes compartir la propiedad!", 'success'))
      .catch(error => customAlert('Ha ocurrido un error', 'error'));;
  }
  
  const handleCleanFilters = () => {
    setFilterValues({
      min: 0,
      max: 2000,
      municipality: "",
    });
    
    setFormKey((prevKey) => prevKey + 1);
  }

  useEffect(() => { 
    if(!provincesLoading){
      filterInputs.map((input) => {
        if(input.name === 'province') input.values = ['-'].concat(provincesData.getProvinces.map(province => province.name));
      });
    }

  }, [provincesLoading]);

    useEffect(() => {
      if(optionMunicipality.length > 0){
        filterInputs.map((input) => {
          if(input.name === 'municipality') {
            input.values = ["-"].concat(optionMunicipality);
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
                province: provinceInput.value,
                userToken: userToken
              }
            })
            .then(response => {
              if(provinceInput.value !== "-"){
                setOptionMunicipality(response.data.getMunicipalitiesByProvince.map(municipality => municipality.name));
              }else{
                setOptionMunicipality(["-"]);
              }
            })
            .catch(error => customAlert(error.message.split("\n")[0], 'error'));
    
          });
  
          setConfigured(true);
        }, 1000);
      }
    }, [inputsChanged]);

  useEffect(() => {
    if (!loading){
      setFavouriteProperties(data.getFavouriteProperties);
    }
  }, [loading, data]);

  useEffect(() => {
  }, [favouritesProperties]);

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

              <FlatterForm key={formKey} ref={filterFormRef} inputs={filterInputs} onSubmit={handleFilterForm} buttonText="Filtrar Propiedades"/>
            </div>
          </div>
          <div style={{marginTop: '20px'}}>
            <SolidButton type="featured" text="Limpiar filtros" onClick={() => handleCleanFilters()}/>
          </div>
        </div>
  
        <div className="content">
          {
            currentPageData && favouritesProperties && currentPageData.map((property, index) => {
              const isFavourite = favouritesProperties.map(x => x).filter(x => parseInt(x.id) === parseInt(property.id)).length>0;

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
                        <div className="tagDiv" onClick={() => navigator(`/search?tag=${tag.name}`)}>
                          <Tag key={ index } name={tag.name} color={tag.color}></Tag>
                        </div>
                      ))}
                    </div>
    
                    <div className="meta-left">
                      <div className="meta-location"><img className="small-picture-back" src={require('../static/files/icons/ubicacion.png')} alt='Ubicacion'/> { property.province.name }</div>
    
                      <div className="meta-flatmates"><img className="small-picture-back" src={require('../static/files/icons/partners.png')} alt='Compañeros'/> {property.flatmates.length}/{property.maxCapacity}</div>
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
                { isFavourite ? (
                  <div className="favourite-badge"><img
                  src={require("../static/files/icons/estrella.png")}
                  alt="fav icon"
                /> Favorito</div>
                ) : "" }
              </article>
              );
              }
            )}
            <div className="pagination-container">
              <button onClick={() => setPaginationIndex(paginationIndex-1)} disabled={paginationIndex<=1}>Anterior</button>
              <span>{paginationIndex}</span>
              <button onClick={() => setPaginationIndex(paginationIndex+1)} disabled={paginationIndex*PAGE_SIZE>=numberOfFilteredProperties}>Siguiente</button>
            </div>
        </div>
      </section>

      <FlatterModal maxWidth={500} ref={modalRef}>
        <div className="info-modal share-property-modal">
          <h3>¿Conoces a alguien a quién le puede interesar?</h3>
          <p>Comparte este alquiler con quien tú quieras. Puedes copiar el siguiente enlace y la persona que lo reciba podrá entrar directamente a ver la información de la propiedad.</p>
          <div className="share-input">
            <input id="share-modal-input" type="text" value={`${window.location.protocol}//${window.location.host}/property/${sharedProperty.id}`} placeholder="Aquí aparecerá el enlace para compartir del alquiler que selecciones" readOnly={ true } /><button onClick={ function(e) {
            
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