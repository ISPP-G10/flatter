import "../static/css/pages/searchProperties.css";
import FlatterPage from "../sections/flatterPage";
import Slider from "../components/slider/slider";
import Tag from "../components/tag";
import SolidButton from "../sections/solidButton";
import {useApolloClient} from '@apollo/client';
import {useNavigate} from 'react-router-dom';

import {useQuery, gql, useMutation, useLazyQuery} from '@apollo/client';
import propertiesAPI from '../api/propertiesAPI';
//import usersAPI from '../api/usersAPI';

import { useEffect } from 'react';


const SearchProperties = ({}) => {

    const client = useApolloClient();
    const navigator = useNavigate();

    function deleteProperty(id){

          client.mutate({
              mutation: propertiesAPI.deletePropertyById,
              variables: {
                  propertyId: parseInt(id),
              }
          }).then((response) => {

              navigator('/searchProperties');
          }).catch((error) => {
              console.log(error);
          });
      
    }

    function standOutProperty(idPiso, idPropietario){

      client.mutate({
          mutation: propertiesAPI.outStandPropertyById,
          variables: {
              propertyId: parseInt(idPiso),
              ownerId: parseInt(idPropietario)
          }
      }).then((response) => {

          navigator('/searchProperties');
      }).catch((error) => {
          console.log(error);
      });
  
}

    const usern = localStorage.getItem('user','');

    const {data, loading} = useQuery(propertiesAPI.getPropertiesByOwner, {variables: {
      username: usern
    }});

    if (loading) return <p>Loading...</p>
    // if (loading2) return <p>Loading2...</p>

  return(
    <FlatterPage withBackground userLogged>
      <div>
        <h1 className="properties-title">Tus Propiedades</h1>
      </div>
      <section id="searchView">
        <div className="filterview">
          <div className="filterview-content">
            <SolidButton text="Crear Piso">

            </SolidButton>
          </div>

          
           
        </div>
        
        <div className="listview">
          <section id="informationView">
          {
          data && 
            (
              data.getPropertiesByOwner.map ((prop) => { 
                return(
            <div className="listview">
              <div className="listview-header">
                <h3>{prop.title}</h3>
              </div>
              <div>
                <div className="attrcontainer"> 
                  <div className="attrindv">
                    <img className="small-picture-back" src={require('../static/files/icons/ubicacion.png')} alt='Ubicacion'/>
                    <p className = "location">{prop.province}</p>  
                  </div>
                  <div className="attrindvder">
                    <p className = "team">{prop.price}</p>
                    <img className="small-picture-back" src={require('../static/files/icons/flattercoins-icon.png')} alt='Precio'/>
                  </div>
                </div>
              </div>

              <div className="listview-content">

                <Slider>

                </Slider>
              </div>
              <div className="etiquetacontainer">
                {prop && prop.tags.map((tag,index) => {
                  <div className="etiquetaindv">
                  <Tag name={tag.title} color={tag.color} key={index}/>
                  </div>  
                })
              }
                
              </div>


              <div className="listview-content">
 
                <p className="small-size">{prop.description}</p>
              </div>
              
                <div className="btncontainer">
                    <div className="btnindv">
                      <button className="styled-info-button">Editar Piso</button>
                    </div>
                    <div className="btnindv">
                      <button className="styled-red-info-button" onClick={()=>{deleteProperty(prop.id)}}>Borrar Piso</button>
                    </div>
                    <div className="btnindv">
                      {/* hay que sustituir ese 1 por el id del propietario. todavia no se como se consigue */}
                      <button className="styled-info-button"onClick={()=>{standOutProperty(prop.id,1)}}>Destacar Piso</button>
                    </div>

                  </div>
                  
              </div>
          );}))}

          </section>
        </div>
           
      </section>
    </FlatterPage>
  );
};

export default SearchProperties;