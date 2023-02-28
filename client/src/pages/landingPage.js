import ZoomingImages from "../components/imagesZoom";
import HeroHome from "../components/heroHome";
import ScrollingPage from "../sections/scrollingPage";
import ToggleFeatures from "../components/toggleFeatures";
import Modal from "../sections/modal";

const LandingPage = () => {

    const imageSet = [
        require("../static/files/images/sample-1.jpg"),
        require("../static/files/images/sample-2.jpg"),
        require("../static/files/images/sample-7.jpg"),
        require("../static/files/images/sample-4.jpg"),
        require("../static/files/images/sample-5.jpg"),
        require("../static/files/images/sample-6.jpg"),
    ];

    return(
        <ScrollingPage>
            <HeroHome />

            <section id="whatsFlatter">
                <div>
                    <img src={require('../static/files/images/ubicaciones.jpeg')} alt='Encontrar piso ideal'/>
                </div>
                <div>
                    <h2>Encuentra tu hogar ideal...</h2>

                    <p>Nuestra plataforma de alquiler de viviendas es más que una simple herramienta de búsqueda: es una comunidad colaborativa donde los inquilinos pueden compartir sus experiencias y valoraciones sobre sus arrendadores y compañeros, así como los propietarios pueden recibir comentarios útiles para mejorar su gestión y ofrecer un mejor servicio.</p>
                </div>
            </section>

            <section id="fastView">
                <div className="view">
                    <div className="view-header">
                        <div>
                            <img src={require('../static/files/icons/ubicacion.png')} alt='Busca en la zona que quieras'/>
                        </div>
                        
                        <h3>Busca donde necesites</h3>
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

            <section id="mail-form">
                <div id="mc_embed_signup">
                    <form action="https://seafony.us18.list-manage.com/subscribe/post?u=a6fea00d426951e0520437e5d&id=67cc14792f&f_id=005328e7f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                        <div id="mc_embed_signup_scroll" className='mail-form-container'>
                            <div className="mail-form-text-column">
                                <label htmlFor="mce-EMAIL" className='email-text'>¿Quieres ser de los primeros en probrar Flatter?</label>
                                <p>Introduce tu correo electrónico para estar al tanto de las nuevas actualizaciones del proyecto y tener la posiblidad de formar parte del grupo de usuarios que tendrán acceso a las primeras versiones</p>
                            </div>
                            <div className='mail-form-input-column'>
                                <div className="mc-field-group">
                                    <input type="email" name="EMAIL" className="required email email-input" id="mce-EMAIL" placeholder="Correo electrónico" required />
                                </div>
                                <div id="mce-responses" className="clear foot email-form-control-flags">
                                    <div className="response" id="mce-error-response" style={{display: 'none'}} />
                                    <div className="response" id="mce-success-response" style={{display: 'none'}} />
                                </div>
                                <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true"><input type="text" name="b_a6fea00d426951e0520437e5d_67cc14792f" tabIndex={-1} defaultValue /></div>
                                <div className="optionalParent">
                                    <div className="clear foot">
                                        <input type="submit" value="Suscribirme" name="subscribe" id="mc-embedded-subscribe" className="submit-button button featured" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                
            </section>
            <Modal id="ejemplo">
                <div id="mc_embed_signup">
                    <form action="https://seafony.us18.list-manage.com/subscribe/post?u=a6fea00d426951e0520437e5d&id=67cc14792f&f_id=005328e7f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                        <div id="mc_embed_signup_scroll">
                        <h2>Regístrate como usuario piloto</h2>
                        <div className="indicates-required"><span className="asterisk">*</span> indica requerido</div>
                        <div className="mc-field-group">
                            <label htmlFor="mce-EMAIL">Correo electrónico  <span className="asterisk">*</span>
                            </label>
                            <input type="email" name="EMAIL" className="required email" id="mce-EMAIL" required />
                            <span id="mce-EMAIL-HELPERTEXT" className="helper_text" />
                        </div>
                        <div className="mc-field-group">
                            <label htmlFor="mce-FNAME">Nombre completo </label>
                            <input type="text" name="FNAME" id="mce-FNAME" />
                            <span id="mce-FNAME-HELPERTEXT" className="helper_text" />
                        </div>
                        <div className="mc-field-group">
                            <label htmlFor="mce-PHONE">Teléfono </label>
                            <input type="text" name="PHONE" id="mce-PHONE" />
                            <span id="mce-PHONE-HELPERTEXT" className="helper_text" />
                        </div>
                        <div id="mce-responses" className="clear foot">
                            <div className="response" id="mce-error-response" style={{display: 'none'}} />
                            <div className="response" id="mce-success-response" style={{display: 'none'}} />
                        </div>    {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
                        <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true"><input type="text" name="b_a6fea00d426951e0520437e5d_67cc14792f" tabIndex={-1} defaultValue /></div>
                        <div className="optionalParent" style={{marginTop: '10px'}}>
                            <div className="clear foot" style={{display: "flex", justifyContent: 'center'}}>
                            <input type="submit" className="button featured" name="subscribe" id="mc-embedded-subscribe" value="Registrarme" />
                            </div>
                        </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </ScrollingPage>
    );
}

export default LandingPage;