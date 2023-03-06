import "../static/css/searchProperties.css";
import FlatterPage from "../sections/flatterPage";
import Slider from "../components/Slider";

const OwnerProperties = () => {

  return (
    <FlatterPage withBackground>
      <div>
        <h1 className="properties-title">Todas tus propiedades</h1>
      </div>
      <section id="searchView">
        <div className="filterview">
          <div className="filterview-header">

            <h3>Filtrar por:</h3>
          </div>
          <div className="filterview-content">
            <div>Ciudad:</div>
            <div>
              <input type="text" name="city" className="text-input" id="city" placeholder="Escribe tu Ciudad"/>
            </div>
            <div>Rango de Precio:</div>
            <input type="text" className="text-input" id="minprice" placeholder="Precio Mínimo"></input>
            <input type="text" className="text-input" id="maxprice" placeholder="Precio Máximo"></input>
            <div></div>
            <button className="styled-button">Filtrar</button>
          </div>

          
           
        </div>
        
        <div className="listview">
          <div id="informationView">
            <div className="listview">
              <div className="listview-header">
                <h3>Habitación en Bami cerca de facultades</h3>
              </div>
              <div>
                <div className="prueba"> 
                  <img className="small-picture" src={require('../static/files/icons/ubicacion.png')} alt='Ubicacion'/>
                  <p className = "location">Sevilla</p>
                </div>
                <div>
                  <img className="small-picture-back" src={require('../static/files/icons/conversation.png')} alt='Ubicacion'/>
                  <p className = "team">2/4</p>
                </div>

              </div>

              <div className="listview-content">

                <Slider>

                </Slider>
              </div>
              <div className="pruebaetiqueta">
                <button className="etiqueta2">Compañerismo</button>
              </div>
              <button className="etiqueta1">LGTB</button>
              <div className="listview-content">
 
                <p className="small-size">Buscamos 2 integrantes para un piso de hasta 4 personas. Está localizado en el barrio de Bami, cerca de 
                todas las facultades. El piso tiene 90m2 repartidos en diferentes estancias
                </p>
              </div>
              <div className="listview-content">
                <div className="prueba2">
                  <button className="styled-info-button">Editar</button>
                  </div>
                  <button className="styled-info-button">Borrar</button>
                  <button className="styled-info-button">Ver</button>
              </div>
            </div>

            <div className="listview">
              <div className="listview-header">
                <h3>Habitación en Bami cerca de facultades</h3>
              </div>
              <div>
                <div className="prueba"> 
                  <img className="small-picture" src={require('../static/files/icons/ubicacion.png')} alt='Ubicacion'/>
                  <p className = "location">Sevilla</p>
                </div>
                <div>
                  <img className="small-picture-back" src={require('../static/files/icons/conversation.png')} alt='Ubicacion'/>
                  <p className = "team">2/4</p>
                </div>

              </div>

              <div className="listview-content">

                <Slider>

                </Slider>
              </div>
              <div className="pruebaetiqueta">
                <button className="etiqueta2">Compañerismo</button>
              </div>
              <button className="etiqueta1">LGTB</button>
              <div className="listview-content">
 
                <p className="small-size">Buscamos 2 integrantes para un piso de hasta 4 personas. Está localizado en el barrio de Bami, cerca de 
                todas las facultades. El piso tiene 90m2 repartidos en diferentes estancias
                </p>
              </div>
              <div className="listview-content">
                <div className="prueba2">
                  <button className="styled-info-button">Ver piso</button>
                  </div>
                  <button className="styled-info-button">Reseñas</button>
              </div>
            </div>

            <div className="listview">
              <div className="listview-header">
                <h3>Habitación en Bami cerca de facultades</h3>
              </div>
              <div>
                <div className="prueba"> 
                  <img className="small-picture" src={require('../static/files/icons/ubicacion.png')} alt='Ubicacion'/>
                  <p className = "location">Sevilla</p>
                </div>
                <div>
                  <img className="small-picture-back" src={require('../static/files/icons/conversation.png')} alt='Ubicacion'/>
                  <p className = "team">2/4</p>
                </div>

              </div>

              <div className="listview-content">

                <Slider>

                </Slider>
              </div>
              <div className="pruebaetiqueta">
                <button className="etiqueta2">Compañerismo</button>
              </div>
              <button className="etiqueta1">LGTB</button>
              <div className="listview-content">
 
                <p className="small-size">Buscamos 2 integrantes para un piso de hasta 4 personas. Está localizado en el barrio de Bami, cerca de 
                todas las facultades. El piso tiene 90m2 repartidos en diferentes estancias
                </p>
              </div>
              <div className="listview-content">
                <div className="prueba2">
                  <button className="styled-info-button">Ver piso</button>
                  </div>
                  <button className="styled-info-button">Reseñas</button>
              </div>
            </div>

            <div className="listview">
              <div className="listview-header">
                <h3>Habitación en Bami cerca de facultades</h3>
              </div>
              <div>
                <div className="prueba"> 
                  <img className="small-picture" src={require('../static/files/icons/ubicacion.png')} alt='Ubicacion'/>
                  <p className = "location">Sevilla</p>
                </div>
                <div>
                  <img className="small-picture-back" src={require('../static/files/icons/conversation.png')} alt='Ubicacion'/>
                  <p className = "team">2/4</p>
                </div>

              </div>

              <div className="listview-content">

                <Slider>

                </Slider>
              </div>
              <div className="pruebaetiqueta">
                <button className="etiqueta2">Compañerismo</button>
              </div>
              <button className="etiqueta1">LGTB</button>
              <div className="listview-content">
 
                <p className="small-size">Buscamos 2 integrantes para un piso de hasta 4 personas. Está localizado en el barrio de Bami, cerca de 
                todas las facultades. El piso tiene 90m2 repartidos en diferentes estancias.
                </p>
              </div>
              <div className="listview-content">
                <div className="prueba2">
                  <button className="styled-info-button">Ver piso</button>
                  </div>
                  <button className="styled-info-button">Reseñas</button>
              </div>
            </div>

          </div>
        </div>
           
      </section>
    </FlatterPage>
  );
};

export default OwnerProperties;