import ZoomingImages from "../components/imagesZoom";
import HeroHome from "../components/heroHome";
import ScrollingPage from "../sections/scrollingPage";
import ToggleFeatures from "../components/toggleFeatures";

const LandingPage = () => {

    const imageSet = [
        require("../static/files/images/sample-1.jpg"),
        require("../static/files/images/sample-2.jpg"),
        require("../static/files/images/sample-3.jpg"),
        require("../static/files/images/sample-4.jpg"),
    ];

    return(
        <ScrollingPage>
            <HeroHome />

            <section id="whatsFlatter">
                <div>
                    <img src={require('../static/files/images/ubicaciones.jpeg')} alt='Encontrar piso ideal'/>
                </div>
                <div>
                    <h2>Encontrar tu piso ideal...</h2>

                    <p>Nuestra plataforma de alquiler de pisos es más que una simple herramienta de búsqueda: es una comunidad colaborativa donde los inquilinos pueden compartir sus experiencias y valoraciones sobre sus arrendatarios y compañeros, así como los propietarios pueden recibir comentarios útiles para mejorar su gestión y ofrecer un mejor servicio.</p>
                </div>
            </section>

            <section id="fastView">
                <div className="view">
                    <div className="view-header">
                        <div>
                            <img src={require('../static/files/icons/ubicacion.png')} alt='Busca en la zona que quieras'/>
                        </div>
                        
                        <h3>Busca en la zona que quieras</h3>
                    </div>
                    <div className="view-content">
                        Encuentra el hogar perfecto en la zona que más te guste. Si no conoces la ciudad, no te preocupes, ¡marca un punto de referencia que conozcas y nosotros haremos el resto!
                    </div>
                </div>
                <div className="view">
                    <div className="view-header">
                        <div>
                            <img src={require('../static/files/icons/manos.png')} alt='Gana en confianza'/>
                        </div>
                        
                        <h3>Gana en confianza</h3>
                    </div>
                    <div className="view-content">
                        Velamos por tu tranquilidad. Todos los trámites se realizan a través de nuestra plataforma para garantizar la máxima seguridad.
                    </div>
                </div>
                <div className="view">
                    <div className="view-header">
                        <div>
                            <img src={require('../static/files/icons/pulgares-hacia-arriba.png')} alt='Construye tu reputación'/>
                        </div>
                        
                        <h3>Construye tu reputación</h3>
                    </div>
                    <div className="view-content">
                        ¡No te olvides de valorar al propietario y a tus compañeros! Tu opinión es muy importante para nosotros y para otros inquilinos.
                    </div>
                </div>
            </section>

            <section id="features">
                <ToggleFeatures />
            </section>

            <section id="zoom">
                <h1>La búsqueda de piso que supera cualquier límite</h1>
                <ZoomingImages imageSet={imageSet} marginTop={300} />
            </section>
        </ScrollingPage>
    );
}

export default LandingPage;