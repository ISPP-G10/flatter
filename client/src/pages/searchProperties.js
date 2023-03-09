import "../static/css/pages/searchProperties.css";
import FlatterPage from "../sections/flatterPage";
import Slider from "../components/slider/slider";
import Tag from "../components/tag";
import SolidButton from "../sections/solidButton";

import {useQuery, gql, useMutation, useLazyQuery} from '@apollo/client';
import propertiesAPI from '../api/propertiesAPI';
//import usersAPI from '../api/usersAPI';

import { useEffect } from 'react';

// const Ejemplo = () => {

    

//     return data && data.getRoles.map(({role}) => (
//         <p>Role: {role}</p>
//     ));

// }

// query uno {
//   getPropertiesByOwner(username: "joseluisps21"){
//     id
//     description
//     tags {
//       name
//       color
//     }
//     title
//     price
//     isOutstanding
    
//   }
// }

// const GET_ROLES = gql`
// query GetRoles{
//     getRoles{
//         role
//     }
// }`;

// const {data, loading} = useQuery(GET_ROLES);

// if (loading) return <p>Loading...</p>

// return data && data.getRoles.map (({role}) => (

const prueba = sessionStorage.userId;

const SearchProperties = ({}) => {

    // const {data2, loading2} = useQuery(usersAPI.getUserByUsernameHeader, {variables: {
    //   username: user
    // }});

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
                <div className="etiquetaindv">
                  {/* hay que cambiar el color a el de la etiqueta. de momento esta uno por defecto */}
                <Tag name={prop.tags.title} color="red"/>
                </div>
                
              </div>


              <div className="listview-content">
 
                <p className="small-size">{prop.description}</p>
              </div>
              
                <div className="btncontainer">
                    <div className="btnindv">
                      <button className="styled-info-button">Editar Piso</button>
                    </div>
                    <div className="btnindv">
                      <button className="styled-red-info-button">Borrar Piso</button>
                    </div>
                    <div className="btnindv">
                      <button className="styled-info-button">Destacar Piso</button>
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