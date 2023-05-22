import "../static/css/pages/ownerProperties.css";

import { useNavigate } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { useState, useRef } from 'react';
import { useApolloClient } from '@apollo/client';

import * as settings from "../settings";
import FlatterPage from "../sections/flatterPage";
import Tag from "../components/tag";
import SolidButton from "../sections/solidButton";
import FlatterModal from "../components/flatterModal";
import FormProperty from "../components/forms/formProperty";
import propertiesAPI from '../api/propertiesAPI';
import customAlert from "../libs/functions/customAlert";
import customConfirm from "../libs/functions/customConfirm";


const OwnerProperties = () => {

  let [ property, setProperty ] = useState({});
  let userToken = localStorage.getItem("token", '');

  const addPropertyModalRef = useRef(null);
  const editPropertyModalRef = useRef(null);

    const client = useApolloClient();
    const navigate = useNavigate();

    function deleteProperty(id){

          client.mutate({
              mutation: propertiesAPI.deletePropertyById,
              variables: {
                  propertyId: parseInt(id),
                  userToken: userToken,
              }
          }).then((response) => {
            window.location.reload();
          }).catch((error) => {
              customAlert(error.message, 'error');
          });
      
    }

    function standOutProperty(idPiso){

      client.mutate({
          mutation: propertiesAPI.outstandPropertyById,
          variables: {
              propertyId: parseInt(idPiso),
              userToken: userToken,
          }
      }).then((response) => {
          window.location.reload();
      }).catch((error) => {
          let message = error.message.split("\n")[0].trim();
          if (message === "Actualmente no se encuentra disponible ningún hueco en la sección 'Destacados', pruebe otro día o contacte con nuestro equipo de marketing.") {
              customAlert(message, 'warning', false, 10000);
          }else{
            customAlert(message, 'error', false);
          }
      });
  
    }

    function handleConfirm(idPiso){
      customConfirm("Estás a punto de destacar por 1000 FlatterCoins, ¿quieres continuar?")
      .then((response) => {
          standOutProperty(idPiso);
          customAlert("Has destacado la propiedad", 'success', false);
      })
      .catch((error) => {
          customAlert("Has rechazado la operación", 'info', false);
      });
  }

    const {data, loading} = useQuery(propertiesAPI.getPropertiesByOwner, {variables: {
      username: localStorage.getItem('user',''),
      userToken: userToken
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
            <div className="filterview-element">
            <SolidButton text="Nueva Propiedad" type="" onClick={ () => { 
                addPropertyModalRef.current.open();
            } } />
            </div>
            <div className="filterview-element" >
                       <SolidButton text="Ver Solicitudes" type="" onClick={ () => {  navigate('/property/requests')} } />
            </div>

          </div>

          
           
        </div>
        
        <div className="listview">
          <section id="informationView">
          {
          data && 
            (
              data.getPropertiesByOwner.map ((prop, index) => { 
                return(
            <div className={`listview`} key={ index }>

              <div className="listview-header" onClick={() => navigate(`/property/${prop.id}`)}>
                <h3>{prop.title}</h3>
              </div>

              <div className="upper">
                <p className = "team">{prop.price} €/mes</p>

                {
                  prop.isOutstanding ? 
                    <div className="outstanding-badge">
                      <span>✓</span> Destacado
                    </div>
                    :
                    ''
                }
              </div>
              
              <div className="attrcontainer"> 
              
                <div className="attrindv">
                  <img className="small-picture-back" src={require('../static/files/icons/ubicacion.png')} alt='Ubicacion'/>
                  <p className = "location" style={{fontSize: '12px', overflowY: 'scroll', maxHeight: '30px', maxWidth: '215px'}}>{prop.location}, {prop.municipality.name}, {prop.province.name}</p>  
                </div>

              </div>
              

              <div className="listview-content" onClick={() => navigate(`/property/${prop.id}`)}>

                <img src={`${settings.API_SERVER_MEDIA}${prop.images[0].image}`} alt="Vista previa vivienda" style={{width: '100%', height: "100%"}}/>

              </div>
              <div className="etiquetacontainer">
                {prop && prop.tags.map((tag,index) => {
                  return(
                    <div className="etiquetaindv" key={index}>
                      <div className="tagDiv" onClick={() => navigate(`/search?tag=${tag.name}`)}>
                        <Tag name={tag.name} color={tag.color}/>
                      </div>
                    </div> 
                  ); 
                })
              }
                
              </div>


              <div className="listview-content" onClick={() => navigate(`/property/${prop.id}`)}>
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
                      <button className="styled-info-button"onClick={()=>{handleConfirm(prop.id)}}>Destacar Piso</button>
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