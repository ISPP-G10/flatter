import "../static/css/pages/ownerProperties.css";
import FlatterPage from "../sections/flatterPage";
import Slider from "../components/slider/slider";
import Tag from "../components/tag";
import SolidButton from "../sections/solidButton";
import {useApolloClient} from '@apollo/client';

import FlatterModal from "../components/flatterModal";
import FormProperty from "../components/forms/formProperty";

import {useQuery} from '@apollo/client';

import propertiesAPI from '../api/propertiesAPI';
//import usersAPI from '../api/usersAPI';

import { useState, useRef } from 'react';


const OwnerProperties = ({}) => {

  let [ property, setProperty ] = useState({});

  const addPropertyModalRef = useRef(null);
  const editPropertyModalRef = useRef(null);

    const client = useApolloClient();

    function deleteProperty(id){

          client.mutate({
              mutation: propertiesAPI.deletePropertyById,
              variables: {
                  propertyId: parseInt(id),
              }
          }).then((response) => {
            window.location.reload();
          }).catch((error) => {
              console.log(error);
          });
      
    }

    function standOutProperty(idPiso){

      client.mutate({
          mutation: propertiesAPI.outstandPropertyById,
          variables: {
              propertyId: parseInt(idPiso),
          }
      }).then((response) => {
          window.location.reload();
      }).catch((error) => {
          alert(error.message);
      });
  
    }

    const {data, loading} = useQuery(propertiesAPI.getPropertiesByOwner, {variables: {
      username: localStorage.getItem('user','')
    }});

    if (loading) return <p>Loading...</p>

  return(
    <FlatterPage withBackground userLogged>
      <div>
        <h1 className="properties-title">Tus Propiedades</h1>
      </div>
      <section id="searchView">
        <div className="filterview">
          <div className="filterview-content">
            <SolidButton text="Nueva Propiedad" type="" onClick={ () => { 
                addPropertyModalRef.current.open();
            } } />
          </div>

          
           
        </div>
        
        <div className="listview">
          <section id="informationView">
          {
          data && 
            (
              data.getPropertiesByOwner.map ((prop, index) => { 
                return(
            <div className="listview" key={ index }>
              <div className="listview-header">
                {
                  prop.isOutstanding ? 
                    <img src={require('../static/files/icons/yellow-star.png')} className="outstanding-icon"></img>
                    :
                    <div className="outstanding-icon" style={{marginTop: '50px'}}></div>
                }
                <h3>{prop.title}</h3>
              </div>
              
              <div className="attrcontainer"> 
                <div className="attrindv">
                  <img className="small-picture-back" src={require('../static/files/icons/ubicacion.png')} alt='Ubicacion'/>
                  <p className = "location">{prop.location}</p>  
                </div>
                <div className="attrindv">
                  <p className = "team">{prop.price} €/mes</p>
                </div>
              </div>
              

              <div className="listview-content">

                <Slider images={prop.images.map((image) => image.image)}/>

              </div>
              <div className="etiquetacontainer">
                {prop && prop.tags.map((tag,index) => {
                  return(
                    <div className="etiquetaindv" key={index}>
                      <Tag name={tag.name} color={tag.color}/>
                    </div> 
                  ); 
                })
              }
                
              </div>


              <div className="listview-content">
 
                <p className="small-size">{prop.description}</p>
              </div>
              
                <div className="btncontainer">
                    <div className="btnindv">
                      <button className="styled-info-button" onClick={ () => {
                        
                        setProperty(prop);
                        editPropertyModalRef.current.open();
                      } }>Editar Piso</button>
                    </div>
                    <div className="btnindv">
                      <button className="styled-red-info-button" onClick={()=>{deleteProperty(prop.id)}}>Borrar Piso</button>
                    </div>
                    <div className="btnindv">
                      <button className="styled-info-button"onClick={()=>{standOutProperty(prop.id)}}>Destacar Piso</button>
                    </div>

                  </div>
                  
              </div>
          );}))}

          </section>
        </div>
           
      </section>

      <FlatterModal maxWidth={700} ref={addPropertyModalRef}>
        <FormProperty/>
      </FlatterModal>

      <FlatterModal maxWidth={700} ref={editPropertyModalRef}>
        <FormProperty property={property} />
      </FlatterModal>
    </FlatterPage>
  );
};

export default OwnerProperties;